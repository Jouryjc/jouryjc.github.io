console.log('this is file b');

const a = require('./a')

module.exports = () => {
    console.log('this is function b');
};