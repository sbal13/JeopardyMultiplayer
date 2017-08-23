const Category = (function createCategory(){

	const all = []

	return class Category {
		constructor(id, title, clues){
			this.id = id
			this.title = title
			this.clues = clues

			all.push(this)
		}

		static all(){
			return all
		}
	}
})()
