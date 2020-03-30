class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  protect_from_forgery unless: :skip_csrf_ckeck
  after_action :update_cart_items, only: [:facebook, :google_oauth2]
  after_action :create_user_profile, only: [:facebook, :google_oauth2]

  # More info at:
  # https://github.com/plataformatec/devise#omniauth

  def facebook
    @user = User.find_for_oauth_user(request.env["omniauth.auth"])
    if @user.persisted?
      sign_in_and_redirect @user, :event => :authentication
      set_flash_message(:notice, :success, :kind => "Facebook") if is_navigational_format?
    else
      session["devise.facebook_data"] = request.env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end

  def failure
    redirect_to root_path
  end

  def google_oauth2
    @user = User.find_for_oauth_user(request.env["omniauth.auth"])
    if @user.persisted?
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Google"
      sign_in_and_redirect @user, :event => :authentication
    else
      session["devise.google_data"] = request.env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end
end