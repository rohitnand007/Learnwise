require 'test_helper'

class CartItemTest < ActiveSupport::TestCase
  def setup
    @user = User.last
  end

  def set_cart_item
    @cart_item=CartItem.create(product_id: Product.last.id.to_s, session_id: 'abcd')
  end

  test 'valid cart items' do
    assert_not CartItem.new.save
    # Dummy product id
    assert_not CartItem.new(product_id: 'abcd').save
    # Dummy User ID
    assert_not CartItem.new(product_id: Product.last.id.to_s, user_id: 234).save
    assert_not CartItem.new(product_id: Product.last.id.to_s).save
    assert CartItem.new(product_id: Product.last.id.to_s, session_id: 'abcd').save
    assert CartItem.new(product_id: Product.last.id.to_s, user_id: @user.id).save
  end

  test 'product' do
    set_cart_item
    assert @cart_item.product.present?
  end

  test 'update user' do
    set_cart_item
    assert @cart_item.update_user @user
    assert_equal @cart_item.user_id, @user.id
  end

  test 'display data' do
    set_cart_item
    assert (data=@cart_item.get_display_data).present?
    assert data[:product_name]
  end

  test 'build cart item' do
    product_id = Product.last.id.to_s
    c=CartItem.build_cart_item(product_id, @user, nil)
    assert c.save
  end
end
