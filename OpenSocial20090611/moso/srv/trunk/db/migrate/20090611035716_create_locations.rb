class CreateLocations < ActiveRecord::Migration
  def self.up
    create_table :locations do |t|
      t.string :setX
      t.string :setY
      t.string :setPhoto
      t.string :comment
      t.integer :kinds
      t.string :userId

      t.timestamps
    end
  end

  def self.down
    drop_table :locations
  end
end
