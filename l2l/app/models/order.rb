class Order < ApplicationRecord
  extend Currency
  belongs_to :user
  has_many :cart_items
  has_many :user_products
  validates :amount, :currency, :products, :status, presence: true
  validates :amount, numericality: { greater_than: 0}
  validates :status, inclusion: {in: %w(post_checkout api_connection_error authentication_error invalid_request_error api_error card_error rate_limit_error successful)}
  validates :currency, inclusion: {in: currency_list}
  serialize :payment_info, Hash

  # Status:
    # post_checkout: 'Order created and needs to be proccessed for payment'
    # api_connection_error: 'Failed to connect to stripe server.'
    # authentication_error: 'Stripe authentication failed check api key.'
    # invalid_request_error: 'Invalid stripe token or other parameters.'
    # api_error: 'Internal error in stripe'
    # card_error: 'Failed to deduct from card need to check with bank.'
    # rate_limit_error: 'Too many request hit the stripe server.'
    # successful: 'Transaction successful.'

  # After successful payment
  def delete_cart_items
    cart_items.destroy_all
  end

  # If we want create a stripe account for user to charge later
  def user_stripe_account
    customer = Stripe::Customer.create(
      email: '123@gmail.com',
      source: '112' 
    )
  end

  def process_payment token
    begin
      # We can use a stripe token or cutomerid(from stripe) to charge
      charge = Stripe::Charge.create(
        # customer: customer.id,
        amount: (amount*100).to_i,
        description: description,
        currency: 'usd',
        source: token,
        metadata: {order_id: id}
      )
      self.payment_info = charge.to_hash
      self.status = 'successful'
      self.save!
      delete_cart_items
      give_access_to_products
    rescue Stripe::APIConnectionError => e
      # Error connecting to stripe server
      save_stripe_error e
    rescue Stripe::InvalidRequestError => e
      # Invalid token or params
      save_stripe_error e
    rescue Stripe::AuthenticationError => e
      # Invalid stripe api key
      save_stripe_error e
    rescue Stripe::RateLimitError => e
      # Too many requests
      save_stripe_error e
    rescue Stripe::CardError => e
      # Bank declined payment
      save_stripe_error e
    rescue Stripe::StripeError => e
      # Stripe Internal error
      save_stripe_error e
    rescue => e
      # some other exception
      puts e
    ensure
      # save!
    end
  end

  def give_access_to_products
    product_ids = products.split(',')
    product_ids.each{|p_id| UserProduct.find_or_create_by(user_id: user.id, order_id: id, product_id: p_id)}
  end

  def order_info
    order_details = {
        id:self.id,
        amount:self.amount,
        currency:self.currency,
        product_ids:self.products.split(",")
    }

  end

  private
  def save_stripe_error exception
    error = exception.json_body[:error]
    self.status = error[:type]
    self.payment_info = error
    self.save!
  end
end
