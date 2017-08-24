class GamesController < ApplicationController

  def create
    host_user = User.find_or_create_by(game_params)

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
  end

  def wager
  end

  def index
    ActionCable.server.broadcast "game_channel",
                                  content: "hello"
  end

  private
  def game_params
    params.require(:game).permit(:name)
  end
end
