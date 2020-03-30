class ChangeColumnUserProducts < ActiveRecord::Migration[5.0]
  def change
    change_column :user_products, :product_id, :string
  end
end
