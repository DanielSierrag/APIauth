const mongoose = require('mongoose')

const Cars = mongoose.model('Car', {
    brand: {type: String, required: true, minlength: 3},
    model: {type: String, required: true, minlength: 3},
})

module.exports = Cars