require 'simplecov'
SimpleCov.start 'rails'

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
  def setup
    create_products
  end

  def sign_in u
    User.create(username: u[:username], email: u[:email], password: u[:password], confirmed_at: Time.now.to_s)
    post user_session_path, params:{user: {email: u[:email], password: u[:password]}}
  end

  def create_products
    (1..5).each do |x|
      Product.create(
        name: 'product_'+x.to_s,
        default_price: x*10,
        data: {a: 'A', b: 'B'}
      )
    end
  end

  def sign_in_a_user
    user = {username: 'test_user',email: '111@gmail.com', password: 'edutor' }
    sign_in user
  end
end
