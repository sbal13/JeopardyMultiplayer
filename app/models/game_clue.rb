class GameClue < ApplicationRecord
	belongs_to :game
	belongs_to :clue
end
