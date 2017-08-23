class CreateClues < ActiveRecord::Migration[5.1]
  def change
    create_table :clues do |t|
      t.string :question
      t.string :answer
      t.integer :category_id
      t.integer :value

      t.timestamps
    end
  end
end
