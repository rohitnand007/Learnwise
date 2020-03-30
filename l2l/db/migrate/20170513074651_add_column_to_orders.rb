class AddColumnToOrders < ActiveRecord::Migration[5.0]
  def change
    add_column :orders, :payment_info, :binary, limit: 1.megabyte
  end
end
