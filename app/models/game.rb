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
						
						nil_clues = cat.clues.where(value: nil)

						puts ("Nil Clues: #{nil_clues.count}")

						final_clues = sort_clues.map.with_index{|clue_array, i|
							if clue_array.any?
								clue_array.sample
							else
								chosen = nil_clues.sample
								chosen.update(value: (200*i))
								chosen
							end
						}

					}.flatten

		self.clues = selected_clues
		self.clues.sample.update(dd: true)
		self.save
	end
end
