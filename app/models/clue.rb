class Clue < ApplicationRecord
	belongs_to :category
	has_many :game_clues
	has_many :games, through: :game_clues
end
