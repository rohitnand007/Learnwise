class CreateOrders < ActiveRecord::Migration[5.0]
  def change
    create_table :orders do |t|
      t.integer :user_id
      t.string :description
      t.float :amount
      t.string :currency
      t.string :products

      t.timestamps
    end
  end
end
