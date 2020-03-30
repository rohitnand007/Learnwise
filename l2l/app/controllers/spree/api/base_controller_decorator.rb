Spree::Api::BaseController.class_eval do
  before_action :set_session_id

  private
  def load_user
    @current_api_user = current_user || Spree.user_class.find_by(spree_api_key: api_key.to_s)
  end

  def order_token
    request.headers["X-Spree-Order-Token"] || params[:order_token] || params[:order_guest_token]
  end

  def set_session_id
    session[:order_token_id] ||= Spree::Order.new.generate_guest_token
  end

  def authenticate_user
    return if @current_api_user

    if requires_authentication? && api_key.blank? && order_token.blank?
      must_specify_api_key and return
    elsif order_token.blank? && (requires_authentication? || api_key.present?)
      invalid_api_key and return
    else
      # An anonymous user
      @current_api_user = Spree.user_class.new
    end
  end

  def authenticate_user!
    if @current_api_user && @current_api_user.persisted?
      true
    else
      unauthorized and return
    end
  end
end