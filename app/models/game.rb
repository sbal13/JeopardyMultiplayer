class Game < ApplicationRecord
	has_many :game_clues
	has_many :clues, through: :game_clues
	has_many :game_categories
	has_many :categories, through: :game_categories
	has_many :user_games
	has_many :users, through: :user_games

  def initializeGame
		self.categories = Category.all.sample(6)
		selected_clues = self.categories.map { |cat|
						sort_clues = (1..5).to_a.map do |x|
								cat.clues.select{ |clue| clue.value == 200*x}
						end
						final_clues = sort_clues.map{|clue_array| clue_array.sample(1)}
					}.flatten
		self.clues = selected_clues
		self.save
	end
end
