const Clue = (function createClue(){

	const all = []

	return class Clue {
		constructor(id, question, answer, category_id, value){
			this.id = id
			this.question = question
			this.answer = answer
			this.category_id = category_id
			this.value = value
			this.dd = false
			this.shown = true
			this.findCategory()

			all.push(this)
		}

		findCategory(){
			this.category = Category.all().find(cat => cat.id === this.category_id)
			console.log(this.category)
		}



		static makeDD(){
			var randClue = this.all()[Math.floor(Math.random() * this.all().length)];
			randClue.dd = true
			console.log(randClue)
		}

		static all(){
			return all
		}
	}
})()
