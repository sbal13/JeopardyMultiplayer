const Display = (function createDisplay(){
  return class Display{
    constructor(){
      this.screen = $('#game-screen')
      this.welcome = $('#welcome')
      this.board = $('#game-board')

      this.clue = $("#clue-display")
      this.question = $("#question")
      this.rhs = $("#rhs")
      this.input = $("#input")
      this.timer = $("#timer-div")

      this.user = $("#user-display")
    }
  }
})()
