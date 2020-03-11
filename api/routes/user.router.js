const express = require('express')
const crypto = require('crypto-js')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')


const UserModel = require('../models/User.model')
router.use(cors())

process.env.SECRET_KEY = 'secret'

router.post('/register', (req, res) => {
    const userData = new UserModel(req.body)
    UserModel.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user) {
                var hash = crypto.AES.encrypt(req.body.password, 'secret key 1234')
                userData.password = hash
                UserModel.create(userData)
                    .then(user => {
                        res.json({ status: `${user.email} registered` })
                    })
                    .catch(err => {
                        res.status(400).send(`Error: can't create user because ${err}`)
                    })
            } else {
                res.status(400).json({ error: 'User already exists' })
            }
        })
        .catch(err => {
            res.status(500).send(`error: ${err}`)
        })
})

router.post('/login', (req, res) => {
    UserModel.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                var hash = crypto.AES.decrypt(user.password, 'secret key 1234')
                var hashpass = hash.toString(crypto.enc.Utf8)
                // res.send(hashpass)
                if (hashpass == req.body.password) {
                    const payload = {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        status: user.status
                    }

                    const token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    })
                    res.send(token)
                } else {
                    res.status(400).send('email or password is correct')
                }
            }
            else {
                res.status(400).send('email or password is null')
            }
        })
        .catch(err => {
            res.status(500).send(`error: ${err}`)
        })
})

router.post('/edit', (req, res) => {
    UserModel.updateOne({ _id: req.body._id },
        {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                status: req.body.status
            }
        },
        { upsert: true })
        .then(user => {
            res.send(user)
            // res.redirect('users')
        })
        .catch(err => {
            res.status(400).send(err)
        })

})


module.exports = router