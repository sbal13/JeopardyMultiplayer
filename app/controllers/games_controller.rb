class GamesController < ApplicationController

  def create
    host_user = User.find_or_create_by(name: params[:game][:name].downcase)

    if Game.all.last && Game.all.last.active
      last_game = Game.all.last
      if !last_game.users.include?(host_user) && last_game.users.count < 3
        last_game.users << host_user
      end
      display_game = last_game

    else
      new_game = Game.new
      new_game.users << host_user
      new_game.initializeGame

      display_game = new_game
    end
    categories_with_clues =
      display_game.categories.map do |category|
        selected_clues = display_game.clues.select{ |x| x.category_id == category.id}
        {category: category, clues: selected_clues}
      end

    ActionCable.server.broadcast "game_channel", content: {game: display_game, users: display_game.users, board: categories_with_clues}
  end

  def answer
    target_user = User.find_by(name: params["user"].downcase)
    target_user_response = params["userAnswer"]
    clue_answer = params["clueAnswer"]
    clue_value = params["clueValue"].to_i
    if clue_answer.downcase.include?(target_user_response.downcase)
      target_user.update(score: (target_user.score + clue_value))
      status = "correct"
    else
      target_user.update(score: (target_user.score - clue_value))
      status = "incorrect"
    end
    ActionCable.server.broadcast "game_channel",
                                  content: {status: status, users: Game.all.last.users, targetUser: target_user, clueAnswer: clue_answer}
  end

  def wager
  end

  def index
    ActionCable.server.broadcast "game_channel",
                                  content: "hello"
  end

  def endgame
    last_game = Game.all.last
    last_game.clues.update(shown: true, dd: false)
    last_game.users.update(score: 0)
    Game.destroy_all
    ActionCable.server.broadcast "game_channel",
                                  content: {gameOver: true}
  end

  def clue
    clue_id = params["clueId"]
    Clue.find(clue_id).update(shown: false)

    ActionCable.server.broadcast "game_channel",
                                  content: {clueId: clue_id, users: Game.last.users}
  end
end
