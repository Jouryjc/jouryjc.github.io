const db = require('../mongodb')

let userSchema = db.Schema({
    name: String,
    address: String
})

module.exports = db.model('test', userSchema)