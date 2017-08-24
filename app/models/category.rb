class Category < ApplicationRecord
	has_many :clues
	has_many :game_categories
	has_many :games, through: :game_categories

end
