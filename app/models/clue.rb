class Clue < ApplicationRecord
	belongs_to :category
	has_many :gameclues
	has_many :games, through: :gameclues
end
