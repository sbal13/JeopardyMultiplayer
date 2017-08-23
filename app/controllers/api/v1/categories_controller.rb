class Api::V1::CategoriesController < ApplicationController
	def index

		selected_categories = Category.all.sample(6)
		selected_clues = selected_categories.map { |cat|
			sort_clues = (1..5).to_a.map do |x| 
				cat.clues.select{ |clue| clue.value == 200*x} 
			end

			final_clues = sort_clues.map{|clue_array| clue_array.sample(1)}.flatten

		}
		final_display = selected_categories.map.with_index {|x, i| {category: x, clues: selected_clues[i]}}

		# alternate: final_display = Hash[category_display.zip(selected_clues)]

		
		render json: final_display, status: 201
	end
end
