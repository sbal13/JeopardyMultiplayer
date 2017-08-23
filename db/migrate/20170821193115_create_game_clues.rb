class CreateGameClues < ActiveRecord::Migration[5.1]
  def change
    create_table :game_clues do |t|
      t.integer :game_id
      t.integer :clue_id

      t.timestamps
    end
  end
end
