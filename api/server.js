const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))

const mongoRUI = 'mongodb+srv://Admin:leQw9ZKSYUAM07fi@mycluster-vwfqm.mongodb.net/MyWebPage?retryWrites=true&w=majority'
mongoose.connect(mongoRUI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))

const UserRouter = require('./routes/user.router')
app.use('/user', UserRouter)

app.listen(port, () => {
    console.log(`Server has running on port ${port}`)
})