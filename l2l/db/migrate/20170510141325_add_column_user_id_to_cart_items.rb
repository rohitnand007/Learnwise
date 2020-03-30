class AddColumnUserIdToCartItems < ActiveRecord::Migration[5.0]
  def change
    add_column :cart_items, :user_id, :integer
  end
end
