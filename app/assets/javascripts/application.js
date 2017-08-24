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

//= require turbolinks
//= require jquery
//= require rails-ujs
//= require display.js
//= require cable.js
//= require category.js
//= require clue.js
//= require timer.js
//= require user.js




document.addEventListener('DOMContentLoaded', function(){
  const display = new Display()
	loadScreen(display)
})


var currentUser;

function loadScreen(display){

	display.clue.hide()
	display.welcome.html('<h2 id="welcome-message"> Click here to start! </h2>')
	$('#welcome-message').on('click',function() {
		promptUsername(display)
	})
}


function promptUsername(display){
	const userForm = `
			<form id="user-form">
			   <input type="text" id="username" placeholder="enter your name">
			</form>
	`
	display.welcome.html(userForm)
  $('#username').focus()
	$('#user-form').on('submit', function(event){
		event.preventDefault()
		const userName = $('#username').val()
		currentUser = new User(userName)
		display.user.html(`${currentUser.name.toUpperCase()}: $${currentUser.score}`)
		display.welcome.html("")
		display.welcome.hide()
    $('#username').blur()
		setCategories(display)

	})
}



function setCategories(display){

	fetch("http://localhost:3000/api/v1/categories")
	.then(res=> res.json())
	.then(res => renderCategories(res, display))

}

function renderCategories(json, display){
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

	display.board.html(categoryHTML)

	display.board.on("click", "div.clue", function(e) {
		e.stopImmediatePropagation()
		const targetId = parseInt(this.id.split("-")[1])
		const targetClue = Clue.all().find(clue => clue.id === targetId)

		if(targetClue.shown) {

			display.clue.show()
			display.board.hide()

			const questionHTML = `<h2>${targetClue.question.toUpperCase()}</h2>`
			const responseHTML = `
				<h2>${targetClue.category.title.toUpperCase()}</h2>
				<br>
				<br>
				<form id="answer-form" autocomplete="off">
					<p>What is
					<input type="text" id="answer" autocomplete="off">
					 ?</p>
				</form>
			`

			if (targetClue.dd===true) {

				display.timer.hide()
				const ddHTML = `
					<p>You have selected a Daily Double! Please make a wager between $5 and $${maxWager()}</p>
					<form id="wager-form">
						<input type="number" id="wager">
					</form>
				`
				const ddImage = `url('/images/dd.png')`
				// we are clearing previous question from display
				display.question.html("")
				display.question.css('background-image', ddImage)
				display.input.html(ddHTML)
        $("#wager").focus()

				$('#wager-form').on("submit", function(e){
					e.preventDefault()
          $("#wager").blur()

					const wagerValue = parseInt($('#wager').val())

					if(!wagerValue || wagerValue > maxWager() || wagerValue < 5) {
						alert("Please enter a valid wager.")
					} else {
						display.timer.show()
						// we are resetting background image to nothing
						display.question.css('background-image', "")
						targetClue.value = wagerValue
						$('#daily-double').html(`<p>You have wagered: $${targetClue.value}</p>`)
						guess(questionHTML, responseHTML,targetClue, display)
					}

				})

			} else {
				guess(questionHTML, responseHTML,targetClue, display)
			}
			console.log(this)
			targetClue.shown = false

			//This hides the value after question answered
			this.innerHTML = ""
		}
	})
}

function guess(questionHTML, responseHTML, targetClue, display){

		var newTimer = new Timer(targetClue, display)
		display.question.html(questionHTML)
		display.input.html(responseHTML)
    $('#answer').focus()

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
			backToGame(display)

			newTimer.stop()

		})
}



function backToGame(display){
  $("#answer").blur()
  display.user.html(`${currentUser.name.toUpperCase()}: ${scoreNormalizer()}`)
	display.clue.hide()
	$('#daily-double').html("")
	display.board.show()

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
