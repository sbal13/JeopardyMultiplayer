const Timer = (function createTimer(){
  let all = []
  return class Timer {
    constructor(clue, users){
      this.presentTime = $('#timer')
      this.clue = clue
      this.users = users
      this.seconds = 11
      this.goTimer = setInterval(function(){this.run()}.bind(this), 1000)
      all.push(this)
    }


    run(){
      this.seconds--
      if(this.seconds < 0) {
        this.stop()
        this.ranOutOfTime()
        checkEndGame(this.users)
        backToGame(this.users)
      } else {
        this.presentTime.html(this.seconds)
      }
    }

    ranOutOfTime(){
        alert(`Time's up! The correct answer was "${this.clue.answer}."`)
    }

    static last(){
      return all[all.length - 1]
    }

    stop(){
      clearInterval(this.goTimer);
      this.presentTime.html("")
    }
  }
})()
