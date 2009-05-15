ActiveRecord::Schema.define(:version => 0) do
  create_table :valid_attributes_models, :force => true do |t|
    t.column :login,        :string, :limit => 255
    t.column :first_name,   :string, :limit => 255
    t.column :last_name,    :string, :limit => 255
    t.column :employee_id,  :integer
    t.column :email,    :string, :limit => 255
  end
end