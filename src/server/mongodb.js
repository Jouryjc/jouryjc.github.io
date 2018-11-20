//Import the mongoose module
const mongoose = require('mongoose');
const config = require('./config');
const chalk = require('chalk')

//Set up default mongoose connection
const mongoDB = `mongodb://${config.mongodb.address}/${config.mongodb.db}`;

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

mongoose.connect(mongoDB, {
    useNewUrlParser: true
}, err => {
    if (err) {
        console.log(chalk.red("数据库连接失败！"))
    } else {
        console.log(chalk.green("数据库连接成功！"))
    }
})

module.exports = mongoose