const User = (function createUser(){

	const all = []
	let id = 0

	return class User {
		constructor(name){
			this.id = ++id
			this.name = name
			this.score = 0

			all.push(this)
		}

		static all(){
			return all
		}
	}
})()
