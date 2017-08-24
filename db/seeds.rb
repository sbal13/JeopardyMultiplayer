# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


require 'rest-client'
require 'json'


requests = (11100..11300).to_a.map { |x| JSON.parse(RestClient.get("http://jservice.io/api/category?id=#{x}"))}

requests.each do |r|
	cat = Category.create(title: r["title"])
	r["clues"].each do |clue|
		new_clue = Clue.create(question: clue["question"], answer: clue["answer"], value: clue["value"], category_id: cat.id)
		cat.clues << new_clue
	end

	cat.save
end
