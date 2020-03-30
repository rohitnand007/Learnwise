require 'test_helper'

class OrderTest < ActiveSupport::TestCase
  def setup
    @user = User.last
    @order = orders(:one)
  end

  test 'valid order' do
    assert_not Order.new.save
    # without amount
    assert_not Order.new(user_id: @user.id).save
    # without currency
    assert_not Order.new(user_id: @user.id, amount: 10).save
    # without status
    assert_not Order.new(user_id: @user.id, amount: 10, currency: 'USD').save
    # without products    
    assert_not Order.new(user_id: @user.id, amount: 10, currency: 'USD', status: 'post_checkout').save
    # with dummy status
    assert_not Order.new(user_id: @user.id, amount: 10, currency: 'USD', status: 'dummy', products: '1,2').save
    # with invalid currency
    assert_not Order.new(user_id: @user.id, amount: 10, currency: 'UDSD', status: 'post_checkout', products: '1,2').save
    # with invalid user_id
    assert_not Order.new(user_id: 1545, amount: 10, currency: 'USD', status: 'post_checkout', products: '1,2').save
    # proper order
    assert Order.new(user_id: @user.id, amount: 10, currency: 'USD', status: 'post_checkout', products: '1,2').save
  end

  test 'build order' do
    # building order from cart items
    product_ids = Product.limit(2).pluck(:id).map(&:to_s)
    cart_items = []
    product_ids.each {|p_id| cart_items << CartItem.build_cart_item(p_id, @user, nil).save}
    puts "------------------#{cart_items.last}"
    assert_equal 2, cart_items.count
    assert @user.create_order
  end
end
