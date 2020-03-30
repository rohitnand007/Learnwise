class AddingIndexToTables < ActiveRecord::Migration[5.0]
  def change
    # CartItems
    add_index :cart_items, :user_id
    add_index :cart_items, :session_id
    add_index :cart_items, :order_id
    add_index :cart_items, :product_id
    # Orders
    add_foreign_key :orders, :users
    add_index :orders, :user_id
    # User Products :user_products
    add_foreign_key :user_products, :orders
    add_foreign_key :user_products, :users
    add_index :user_products, :order_id
    add_index :user_products, :user_id
    add_index :user_products, :product_id
  end
end