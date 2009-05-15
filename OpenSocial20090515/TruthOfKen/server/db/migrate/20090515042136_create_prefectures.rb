class CreatePrefectures < ActiveRecord::Migration
  def self.up
    create_table :prefectures do |t|
      t.string :name
      t.string :url

      t.timestamps
    end
  end

  def self.down
    drop_table :prefectures
  end
end
