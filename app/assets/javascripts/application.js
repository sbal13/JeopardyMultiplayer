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

function renderScoreboard(users) {
  channelDisplay = new Display()
  var gameUsersHTML = users.map(user=>{
    return `<div class="col-md-4">${user.name.toUpperCase()}: ${scoreNormalizer(user)}</div>`
  }).join("")
  channelDisplay.user.html(gameUsersHTML)
}

function promptUsername(display){
	const userForm = `
			<form id="user-form" action="/game" method="POST" data-remote="true">
			   <input type="text" id="username" name="game[name]" placeholder="enter your name">
			</form>
	`
	display.welcome.html(userForm)
  $('#username').focus()
	$('#user-form').on('submit', function(event){
		const userName = $('#username').val().toLowerCase()
		currentUser = new User(userName)
		display.welcome.html("")
		display.welcome.hide()
    $('#username').blur()
	})
}

function backToGame(users){
  channelDisplay = new Display()
  $("#answer").blur()
  renderScoreboard(users)
  channelDisplay.clue.hide()
  $('#daily-double').html("")
  channelDisplay.board.show()
}

function scoreNormalizer(user){
  if (user.score < 0){
    return `-$${-user.score}`
  } else {
    return `$${user.score}`
  }
}

function maxWager(user){
	if (user.score <= 1000) {
		return 1000
	} else {
		return user.score
	}
}

function checkEndGame(users) {
  const shownClues = Clue.all().filter(clue => clue.shown)
  if(shownClues.length === 0) {
    const winner = winner(users)
    alert(`${winner.name} has won the game with ${scoreNormalizer(winner.score)}!`)
    endGame()
  }
}
