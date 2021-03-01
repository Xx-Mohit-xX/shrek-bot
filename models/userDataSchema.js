const mongoose = require('mongoose')
const { user } = require('..')

const userData = new mongoose.Schema({
    userId: ({
        type: String,
        required: true
    }),
    coins: Number
})

module.exports = mongoose.model('userData', userData)


