class User < ApplicationRecord
	has_many :usergames
	has_many :games, through: :usergames
end
