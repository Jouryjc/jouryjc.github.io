// let variable = 1

// setTimeout(() => {
//   variable = 2
// })

// export {
//   variable as default
// }

// modules.js
function add() {
  console.log(1)
}

setTimeout(() => {
  function add () {
    console.log(2)
  }
})


export {
  add as default
};