class User < ApplicationRecord
  # rolify
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable, :lockable,:omniauthable, :omniauth_providers => [:facebook,:google_oauth2]
  validates :username , presence:true
  has_many :cart_items
  has_many :orders
  has_many :user_products
  has_many :learning_paths
  has_one :profile

  include Spree::UserMethods
  include Spree::UserAddress
  include Spree::UserPaymentSource

  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session["devise.facebook_data"] && session["devise.facebook_data"]["extra"]["raw_info"]
        user.email = data["email"] if user.email?
      end
    end
  end

  # authenticates or creates user coming from google+, facebook sign in and provider will be google_oauth2 or facebook and uid is the unique ID.
  def self.find_for_oauth_user(auth)
    user = User.where(provider: auth.provider, uid: auth.uid).first
    if user
      return user
    else
      registered_user = User.find_by_email auth.info.email
      if registered_user
        return registered_user
      else
        user = User.new
        user.email = auth.info.email
        user.password = Devise.friendly_token[0,20]
        user.username = auth.info.name   # the profile name from the provider is saved in the username colummn
        user.provider = auth.provider
        user.uid = auth.uid
        user.skip_confirmation!
        user.save
        return user
      end
    end
  end

  def create_order
    price = cart_items.sum(:price)
    product_ids = cart_items.pluck(:product_id)
    self.orders.build(amount: price, products: product_ids.join(','),status: 'post_checkout', currency: 'USD',cart_items: cart_items)
    self.save!
    orders.last
  end

  def products
    Product.where(:id.in => user_products.map(&:product_id))
  end

  def product_toc product_id
    # Product Toc of user with locked, unlocked, percentage completions
    user_data = UserUsage.where(user_id: id,product_id: product_id)[0]
    unless user_data.present?
      user_data = UserUsage.set_user_usage_data(id, product_id)
    end
    user_data.reevaluate_toc
    {'toc' => user_data.toc}
  end

  # def spree_api_key
  #   authenticatable_salt
  # end
end
