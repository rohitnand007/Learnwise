class ApplicationController < ActionController::Base
  include ControllerHelpers

  # Spree Helpers
  include Spree::AuthenticationHelpers
  # include Spree::Core::ControllerHelpers::Auth
  include Spree::Core::ControllerHelpers::AuthDecorator
  include Spree::Core::ControllerHelpers::Common
  # include Spree::Core::ControllerHelpers::Order
  include Spree::Core::ControllerHelpers::OrderDecorator
  include Spree::Core::ControllerHelpers::Store
  helper 'spree/base'
  # Spree Helpers end

  before_action :store_current_location, :unless => :devise_controller?
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?
  # protect_from_forgery with: :exception
  protect_from_forgery with: :exception, unless: :skip_csrf_ckeck
  layout 'login_layout'

  # Catch all CanCan errors and alert the user of the exception
  rescue_from CanCan::AccessDenied do | exception |
    redirect_to welcome_home_index_path, alert: exception.message
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username])
    devise_parameter_sanitizer.permit(:account_update, keys: [:username])
  end

  # private
  # override the devise helper to store the current location so we can
  # redirect to it after loggin in or out. This override makes signing in
  # and signing up work automatically.
  def store_current_location
    # To redirect to the url user hit before signin.
    store_location_for(:user, request.url)
    # devise handles redirect after sign in using session[:user_return_to]
    # updating redirect url for api
    session[:user_return_to] = params[:redirect_url] if params['redirect_url'].present?
  end

  def after_sign_out_path_for(resource)
    root_path
  end
end