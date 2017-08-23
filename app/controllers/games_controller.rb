class GamesController < ApplicationController

   def create
      host_user = User.find_or_create_by(game_params)
      new_game = Game.new
      new_game.users << host_user
      new_game.initializeGame
    end

    def index
      
    end

end
