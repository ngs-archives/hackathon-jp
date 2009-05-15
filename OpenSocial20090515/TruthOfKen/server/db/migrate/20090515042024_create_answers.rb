class CreateAnswers < ActiveRecord::Migration
  def self.up
    create_table :answers do |t|
      t.integer :question_id
      t.string :ans
      t.integer :prefecture_id
      t.integer :rate
      t.integer :mixi_id

      t.timestamps
    end
  end

  def self.down
    drop_table :answers
  end
end
