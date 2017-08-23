// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require turbolinks
//= require_tree .


document.addEventListener('DOMContentLoaded', function(){
	loadScreen()
})

const screen = $('#game-screen')
const welcome = $('#welcome')
const board = $('#game-board')

const clueDisplay = $("#clue-display")
const questionDisplay = $("#question")
const rhs = $("#rhs")
const inputDisplay = $("#input")
const timerDisplay = $("#timer-div")

const userDisplay = $("#user-display")
var currentUser;

function loadScreen(){
	clueDisplay.hide()
	welcome.html('<h2 id="welcome-message"> Click here to start! </h2>')
	$('#welcome-message').on('click',function() {
		promptUsername()
	})
}


function promptUsername(){
	const userForm = `
			<form id="user-form">
			<input type="text" id="username" placeholder="enter your name">
			</form>
	`
	welcome.html(userForm)
	$('#user-form').on('submit', function(event){
		event.preventDefault()
		const userName = $('#username').val()
		currentUser = new User(userName)
		userDisplay.html(`${currentUser.name.toUpperCase()}: $${currentUser.score}`)
		welcome.html("")
		welcome.hide()
		setCategories()
	})
}



function setCategories(){

	fetch("http://localhost:3000/api/v1/categories")
	.then(res=> res.json())
	.then(res => renderCategories(res))

}

function renderCategories(json){
	const categoryHTML = json.map(object => {

		new Category(object["category"].id, object["category"].title, object["clues"])

		const cluesHTML = object["clues"].map(clue => {

			new Clue(clue.id, clue.question, clue.answer, clue.category_id, clue.value)

			return `
				<div id="clue-${clue.id}" class="clue inline-middle">
					<h3 class="text-center">$${clue.value}</h3>
				</div>
			`
		}).join("")

		return `<div class="col-md-2">
			<div class="category"><h4>${object["category"].title.toUpperCase()}</h4></div>
			<div id="clues" class="">

				${cluesHTML}
			</div>
		</div>`
	}).join("")

	Clue.makeDD()

	//Console logs all the clues
	console.log(json)

	board.html(categoryHTML)

	board.on("click", "div.clue", function(e) {
		e.stopImmediatePropagation()
		const targetId = parseInt(this.id.split("-")[1])
		const targetClue = Clue.all().find(clue => clue.id === targetId)

		if(targetClue.shown) {

			clueDisplay.show()
			board.hide()

			const questionHTML = `<h2>${targetClue.question.toUpperCase()}</h2>`
			const responseHTML = `
				<h2>${targetClue.category.title.toUpperCase()}</h2>
				<br>
				<br>
				<form id="answer-form">
					<p>What is
					<input type="text" id="answer" class="input-large">
					 ?</p>
				</form>
			`

			if (targetClue.dd===true) {

				timerDisplay.hide()
				const ddHTML = `
					<p>You have selected a Daily Double! Please make a wager between $5 and $${maxWager()}</p>
					<form id="wager-form">
						<input type="number" id="wager">
					</form>
				`
				const ddImage = `url(../images/dd.png)`
				// we are clearing previous question from display
				questionDisplay.html("")
				questionDisplay.css('background-image', ddImage)
				inputDisplay.html(ddHTML)

				$('#wager-form').on("submit", function(e){
					e.preventDefault()

					const wagerValue = parseInt($('#wager').val())

					if(!wagerValue || wagerValue > maxWager() || wagerValue < 5) {
						alert("Please enter a valid wager.")
					} else {
						timerDisplay.show()
						// we are resetting background image to nothing
						questionDisplay.css('background-image', "")
						targetClue.value = wagerValue
						$('#daily-double').html(`<p>You have wagered: $${targetClue.value}</p>`)
						guess(questionHTML, responseHTML,targetClue)
					}

				})

			} else {
				guess(questionHTML, responseHTML,targetClue)
			}
			console.log(this)
			targetClue.shown = false

			//This hides the value after question answered
			this.innerHTML = ""
		}
	})
}

function guess(questionHTML, responseHTML, targetClue){

		var newTimer = new Timer(targetClue)
		questionDisplay.html(questionHTML)
		inputDisplay.html(responseHTML)

		$('#answer-form').on("submit", function(e){
			e.preventDefault()

			let sanitizedInput = $('#answer').val().toLowerCase().trim()
			let regex = sanitizedInput

			if (sanitizedInput && targetClue.answer.toLowerCase().includes(sanitizedInput)) {
				currentUser.score += targetClue.value
				alert(`Correct! You now have ${scoreNormalizer()}`)
			} else {
				currentUser.score -= targetClue.value
				alert(`Incorrect! The correct answer was "${targetClue.answer}." \nYou are now at ${scoreNormalizer()}`)
			}
			checkEndGame()
			backToGame()

			newTimer.stop()

		})
}



function backToGame(){
	userDisplay.html(`${currentUser.name.toUpperCase()}: ${scoreNormalizer()}`)
	clueDisplay.hide()
	$('#daily-double').html("")
	board.show()

}

function scoreNormalizer(){
	if (currentUser.score < 0){
		return `-$${-currentUser.score}`
	} else {
		return `$${currentUser.score}`
	}
}

function maxWager(){
	if (currentUser.score <= 1000) {
		return 1000
	} else {
		return currentUser.score
	}
}

function checkEndGame() {
	const shownClues = Clue.all().filter(clue => clue.shown)
	if(shownClues.length === 0) {
		if(currentUser.score > 0) {
			alert(`Congrats! You won $${currentUser.score}`)
		} else {
			alert(`Game over! You owe us $${-currentUser.score}`)
		}
		location.reload()
	}

}
