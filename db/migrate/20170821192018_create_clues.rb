class CreateClues < ActiveRecord::Migration[5.1]
  def change
    create_table :clues do |t|
      t.string :question
      t.string :answer
      t.integer :category_id
      t.integer :value
      t.boolean :dd, default: false
      t.boolean :shown, default: true

      t.timestamps
    end
  end
end
