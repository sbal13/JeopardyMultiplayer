class CreateGames < ActiveRecord::Migration[5.1]
  def change
    create_table :games do |t|
      t.integer :round

      t.timestamps
    end
  end
end
