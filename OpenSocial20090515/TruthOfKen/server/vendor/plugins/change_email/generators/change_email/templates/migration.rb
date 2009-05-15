class <%= migration_name %> < ActiveRecord::Migration
  def self.up
    create_table "<%= table_name %>" do |t|
      t.integer :<%= user_model_name %>_id
      t.string :email
      t.string :activation_code
      t.datetime :expiration_date

      t.timestamps
    end
  end

  def self.down
    drop_table "<%= migration_name %>"
  end
end
