App.game = App.cable.subscriptions.create("GameChannel", {
  connected() {},
    // Called when the subscription is ready for use on the server

  disconnected() {},
    // Called when the subscription has been terminated by the server

  received(json) {
    console.log(json.content);

    function renderCategories(){
      const channelDisplay = new Display()

      var gameUsersHTML = json.content.users.map(user=>{
        return `<div class="col-md-4">${user.name.toUpperCase()}: $${user.score}</div>`
      }).join("")
  		channelDisplay.user.html(gameUsersHTML)

    	const categoryHTML = json.content.board.map(object => {
    		new Category(object.category.id, object.category.title, object.clues)
    		const cluesHTML = object.clues.map(clue => {
    			new Clue(clue.id, clue.question, clue.answer, clue.category_id, clue.value)
    			return `
    				<div id="clue-${clue.id}" class="clue inline-middle">
    					<h3 class="text-center">$${clue.value}</h3>
    				</div>
    			`
    		}).join("")
    		return `<div class="col-md-2">
    			<div class="category"><h4>${object.category.title.toUpperCase()}</h4></div>
    			<div id="clues" class="">
    				${cluesHTML}
    			</div>
    		</div>`
    	}).join("")
      Clue.makeDD()
    	//Console logs all the clues
    	console.log(json)
    	channelDisplay.board.html(categoryHTML)
    	channelDisplay.board.on("click", "div.clue", function(e) {
    		e.stopImmediatePropagation()
    		const targetId = parseInt(this.id.split("-")[1])
    		const targetClue = Clue.all().find(clue => clue.id === targetId)
    		if(targetClue.shown) {
    			channelDisplay.clue.show()
    			channelDisplay.board.hide()
    			const questionHTML = `<h2>${targetClue.question.toUpperCase()}</h2>`
    			const responseHTML = `
    				<h2>${targetClue.category.title.toUpperCase()}</h2>
    				<br>
    				<br>
    				<form id="answer-form" autocomplete="off" action="/answer" method="POST" data-remote="true" >
    					<p>What is
    					<input type="text" id="answer" autocomplete="off">
    					 ?</p>
    				</form>
    			`
    			if (targetClue.dd===true) {
    				channelDisplay.timer.hide()
    				const ddHTML = `
    					<p>You have selected a Daily Double! Please make a wager between $5 and $${maxWager()}</p>
    					<form id="wager-form">
    						<input type="number" id="wager">
    					</form>
    				`
    				const ddImage = `url('/images/dd.png')`
    				// we are clearing previous question from channelDisplay
    				channelDisplay.question.html("")
    				channelDisplay.question.css('background-image', ddImage)
    				channelDisplay.input.html(ddHTML)
            $("#wager").focus()
    				$('#wager-form').on("submit", function(e){
    					e.preventDefault()
              $("#wager").blur()

    					const wagerValue = parseInt($('#wager').val())

    					if(!wagerValue || wagerValue > maxWager() || wagerValue < 5) {
    						alert("Please enter a valid wager.")
    					} else {
    						channelDisplay.timer.show()
    						// we are resetting background image to nothing
    						channelDisplay.question.css('background-image', "")
    						targetClue.value = wagerValue
    						$('#daily-double').html(`<p>You have wagered: $${targetClue.value}</p>`)
    						guess(questionHTML, responseHTML,targetClue, channelDisplay)
    					}
    				})
    			} else {
    				guess(questionHTML, responseHTML,targetClue, channelDisplay)
    			}
    			console.log(this)
    			targetClue.shown = false
    			//This hides the value after question answered
    			this.innerHTML = ""
    		}
    	})
    }
    if (json.content && json.content.board){
      renderCategories()
    }

    function guess(questionHTML, responseHTML, targetClue, channelDisplay){

    		var newTimer = new Timer(targetClue, channelDisplay)
    		channelDisplay.question.html(questionHTML)
    		channelDisplay.input.html(responseHTML)
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
      channelDisplay.user.html(gameUsersHTML)
    	channelDisplay.clue.hide()
    	$('#daily-double').html("")
    	channelDisplay.board.show()

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



  }
});
    // Called when there's incoming data on the websocket for this channel
