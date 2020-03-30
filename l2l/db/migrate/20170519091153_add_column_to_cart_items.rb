class AddColumnToCartItems < ActiveRecord::Migration[5.0]
  def change
    add_column :cart_items, :session_id, :string
  end
end
