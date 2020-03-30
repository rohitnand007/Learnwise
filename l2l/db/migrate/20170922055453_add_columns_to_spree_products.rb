class AddColumnsToSpreeProducts < ActiveRecord::Migration[5.1]
  def change
    add_column :spree_products, :product_type, :string
    add_column :spree_products, :product_guid, :string
    add_index :spree_products, :product_guid
    add_index :spree_products, :product_type
  end
end
