let add = function () {
  console.log(1)
}

setTimeout(() => {
  add = function () {
		console.log(2)
	}
})

//export { a as default };

export default add