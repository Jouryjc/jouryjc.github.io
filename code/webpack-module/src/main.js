import a from './a';
const b = require('./b');


import('./a').then((moduleA) => {
  console.log(moduleA)
})

console.log(a, b);