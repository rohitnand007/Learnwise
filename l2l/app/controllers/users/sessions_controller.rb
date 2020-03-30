class Users::SessionsController < Devise::SessionsController
  # protect_from_forgery unless: :skip_csrf_ckeck
  before_action :configure_sign_in_params, only: [:create]
  after_action :update_cart_items, only: [:create]
  after_action :create_user_profile, only: [:create]

  # GET /resource/sign_in
  def new
    super
  end

  # POST /users/sign_in
  def create
    if request.format.json?
      resource = User.find_for_database_authentication(email: params[:user][:email])
      return invalid_login_attempt unless resource
      if resource.valid_password?(params[:user][:password])
        sign_in :user, resource
        return render json: {success: true}, status: 200
      else
        return invalid_login_attempt
      end
    else
      super
    end
  end

  # DELETE /users/sign_out
  def destroy
    if request.format.json?
      sign_out :user
      return render json: {success: true}, status: 200
    else
      super
    end
  end

  protected
  def invalid_login_attempt
    render json: {success: false, error: 'invalid email or password'}, status: 401
  end

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_in_params
    devise_parameter_sanitizer.permit(:sign_in, keys: [:username])
  end 
end