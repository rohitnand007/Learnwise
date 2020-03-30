class CreateProductTocs < ActiveRecord::Migration[5.1]
  def change
    create_table :spree_product_tocs do |t|
      t.integer :product_id
      t.string :toc_guid
      t.timestamps
    end
  end
end
