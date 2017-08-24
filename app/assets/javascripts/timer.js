const Timer = (function createTimer(){

  return class Timer {
    constructor(clue, display){
      this.presentTime = $('#timer')
      this.display = display
      this.clue = clue
      this.seconds = 11
      this.goTimer = setInterval(function(){this.run()}.bind(this), 1000)
    }


    run(){
      this.seconds--
      if(this.seconds < 0) {
        this.stop()
        this.ranOutOfTime()
        checkEndGame()
        backToGame(this.display)
      } else {
        this.presentTime.html(this.seconds)
      }
    }

    ranOutOfTime(){
        currentUser.score -= this.clue.value
        alert(`Time's up! The correct answer was "${this.clue.answer}." \nYou are now at ${scoreNormalizer()}`)
    }

    stop(){
      clearInterval(this.goTimer);
      this.presentTime.html("")
    }
  }
})()
