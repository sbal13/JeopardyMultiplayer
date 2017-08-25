App.game = App.cable.subscriptions.create("GameChannel", {
  connected() {},
    // Called when the subscription is ready for use on the server

  disconnected() {},
    // Called when the subscription has been terminated by the server

  received(json) {
    console.log(json.content);

    if (json.content && json.content.board){
      renderCategories()
      renderScoreboard(json.content.users)
    } else if (json.content.clueId){

      $(`#clue-${json.content.clueId}`).html("")

      const targetClue = Clue.all().find(clue => clue.id === json.content.clueId)
      targetClue.shown = false

      timer = new Timer(targetClue, json.content.users)
      renderClue(json.content.clueId)

    } else if (json.content.status) {
      if(json.content.status === "correct") {
        const targetUser = json.content.targetUser
        const clueAnswer = json.content.clueAnswer
        alert(`Good job, ${targetUser.name.toUpperCase()}! The answer was "${clueAnswer}."`)
        Timer.last().stop(json.content.users)
        backToGame(json.content.users)
      } else {
        alert(`Incorrect!`)
        renderScoreboard(json.content.users)
      }

      checkEndGame(json.content.users)
    } else if (json.content.gameOver) {
      location.reload()
    }

    function renderCategories(){
      const channelDisplay = new Display()

      renderScoreboard(json.content.users)

    	const categoryHTML = json.content.board.map(object => {
    		new Category(object.category.id, object.category.title, object.clues)
    		const cluesHTML = object.clues.map((clue,index) => {
    			new Clue(clue.id, clue.question, clue.answer, clue.category_id, clue.value, clue.shown)
          console.log(index + ". " + clue.value)
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

    	console.log(json)
    	channelDisplay.board.html(categoryHTML)
    	channelDisplay.board.on("click", "div.clue", function(e) {
    		e.stopImmediatePropagation()
    		const targetId = parseInt(this.id.split("-")[1])
    		const targetClue = Clue.all().find(clue => clue.id === targetId)
    		if(targetClue.shown) {
          targetClue.display()
    		}
    	})
    }

    function renderClue(clueId){
      const channelDisplay = new Display()
      console.log(currentUser.name)
      channelDisplay.clue.show()
      channelDisplay.board.hide()

      const targetClue = Clue.all().find(clue => clue.id === clueId)
      const questionHTML = `<h2>${targetClue.question.toUpperCase()}</h2>`
      const responseHTML = `
        <h2>${targetClue.category.title.toUpperCase()}</h2>
        <br>
        <br>
        <form id="answer-form" autocomplete="off" action="/answer" method="POST" data-remote="true" >
          <p>What is
          <input type="text" id="answer" name="userAnswer" autocomplete="off">
          <input type="hidden"  name="user" value="${currentUser.name}">
          <input type="hidden"  name="clueValue" value="${targetClue.value}">
          <input type="hidden"  name="clueAnswer" value="${targetClue.answer}">
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

    }


    function guess(questionHTML, responseHTML, targetClue, channelDisplay){
    		channelDisplay.question.html(questionHTML)
    		channelDisplay.input.html(responseHTML)
        $('#answer').focus()
    }

    function winner(users){
      const rankedUsers = users.sort((a,b) => {
        return a.score - b.score
      })

      console.log(rankedUsers)
      return rankedUsers[0]
    }



    function endGame(){
      const content = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			}
      fetch("/endgame", content)
    }
  }
});
