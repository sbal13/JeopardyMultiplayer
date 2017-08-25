const Clue = (function createClue(){

	const all = []

	return class Clue {
		constructor(id, question, answer, category_id, value, shown){
			this.id = id
			this.question = question
			this.answer = answer
			this.category_id = category_id
			this.value = value
			this.dd = false
			this.shown = shown
			this.findCategory()

			all.push(this)
		}

		findCategory(){

			this.category = Category.all().find(cat => cat.id === this.category_id)
			console.log(this.category)
		}

		display(){
			const content = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({clueId: this.id})
			}
			 fetch('/clue', content)
		}

		static all(){
			return all
		}
	}
})()
