class CartItem < ApplicationRecord

  validate :proper_product
  validates_uniqueness_of :product_id, scope: :user_id, :if => Proc.new {|u| u.user_id.present?}
  validates_presence_of :session_id, :unless => Proc.new {|u| u.user_id.present?}
  validates_uniqueness_of :product_id, scope: :session_id, :unless => Proc.new {|u| u.user_id.present?}
  validate :proper_user
  scope :user_items, ->(user){where("user_id = ?", user.id)}
  scope :session_items, ->(session_id){where("session_id = ?", session_id)}

  def self.build_cart_item(product_id, user, session_id)
    cart_item = CartItem.new
    cart_item.product_id = product_id
    cart_item.user_id = user.id if user.present?
    cart_item.session_id = session_id unless user
    cart_item.price = Product.find(product_id).default_price
    cart_item
  end

  def product
    Product.find(product_id)    
  end

  def get_display_data
    display_data = {
      id: id,
      product_name: product.name,
      product_id: product.id.to_s,
      grade: product.grade,
      subject: product.subject,
      price: price
    }  
  end

  def update_user user
    update_attributes(user_id: user.id, session_id: nil)
  end

  private
  def proper_product
    if product_id.blank?
      errors.add(:product_id, 'ProductId can not be blank')
    elsif !(Product.pluck(:id).map(&:to_s).include? product_id)
      errors.add(:product_id, 'Invalid product id')
    end
  end

  def proper_user
    if user_id.present? && !(User.pluck(:id).include?(user_id))
      errors.add(:user_id, 'Invalid User id')
    end
  end
end
