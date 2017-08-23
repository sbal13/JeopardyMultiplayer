const Timer = (function createTimer(){
  const presentTime = $('#timer')

  return class Timer {
    constructor(clue){
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
        backToGame()
      } else {
        presentTime.html(this.seconds)
      }
    }

    ranOutOfTime(){
        currentUser.score -= this.clue.value
        alert(`Time's up! The correct answer was "${this.clue.answer}." \nYou are now at ${scoreNormalizer()}`)
    }

    stop(){
      clearInterval(this.goTimer);
      presentTime.html("")
    }
  }
})()
