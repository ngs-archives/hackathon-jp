class CreateAttenders < ActiveRecord::Migration
  def self.up
    create_table :attenders do |t|
      t.column :party_id, :string
      t.column :member_id, :string
      t.column :name, :string
      t.column :gender, :tinyint
      t.column :age, :tinyint
      t.column :comment, :text
      t.timestamps
    end
  end

  def self.down
    drop_table :attenders
  end
end
