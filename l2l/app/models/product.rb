class Product
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :data, type: Hash
  field :grade, type: String
  field :subject, type: String
  field :default_price, type: Integer
  validates_presence_of [:name, :data, :grade, :subject, :default_price]
  # resourcify

  def is_accessible? user
    return false if user.nil?
    UserProduct.find_by(user_id: user.id, product_id: id.to_s).present?
  end

  def in_cart? user
    return false if user.nil?
    CartItem.find_by(user_id: user.id, product_id: id.to_s).present?    
  end

  def in_cart_with_session? session_id
    CartItem.find_by(session_id: session_id, product_id: id.to_s).present?
  end

  def get_display_data user=nil, session_id=nil
    display_data = {
      id: id.to_s,
      name: name,
      default_price: default_price,
      grade: grade,
      subject: subject,
      accessible: user.present? ? is_accessible?(user) : false,
      in_cart: user.present? ? in_cart?(user) : in_cart_with_session?(session_id)
    }
  end

  def display_name
    grade + "/" + subject + "--" + name
  end
end
