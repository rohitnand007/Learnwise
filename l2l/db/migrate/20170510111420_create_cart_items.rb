class CreateCartItems < ActiveRecord::Migration[5.0]
  def change
    create_table :cart_items do |t|
      t.string :product_id
      t.integer :order_id
      t.float :price
      t.integer :item_count
      t.timestamps
    end
  end
end
