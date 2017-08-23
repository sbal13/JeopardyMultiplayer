class Game < ApplicationRecord
	has_many :gameclues
	has_many :clues, through: :gameclues
	has_many :usergames
	has_many :users, through: :usergames
end
