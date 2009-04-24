class CreateParties < ActiveRecord::Migration
  def self.up
    create_table :parties do |t|
      t.column :name, :string
      t.column :max, :integer
      t.column :place, :string
      t.column :kanji, :string
      t.column :description, :text
      t.column :start_date, :datetime
      t.timestamps
    end
  end

  def self.down
    drop_table :parties
  end
end
