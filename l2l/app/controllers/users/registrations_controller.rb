class Users::RegistrationsController < Devise::RegistrationsController
  # protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }
  before_action :configure_sign_up_params, only: [:create]
  before_action :configure_account_update_params, only: [:update]
  protect_from_forgery with: :exception, unless: :skip_csrf_ckeck
  after_action :update_cart_items, only: [:create]
  after_action :create_user_profile, only:[:create]
  # GET /resource/sign_up
  def new
    super
  end

  # POST /resource
  def create
    unless request.format.json?
      super
      return
    end
    build_resource sign_up_params
 
    if resource.save
      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_navigational_format?
        sign_up(resource_name, resource)
        return render :json => {:success => true}, status: 200
      else
        set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_navigational_format?
        expire_data_after_sign_in!
        return render :json => {:success => true, message: 'Verify your email account.'}, status: 200
      end
    else
      # clean_up_passwords resource
      return render :json => {success: false, errors: resource.errors.messages}, status: 401
    end
  end

  # GET /resource/edit
  def edit
    super
  end

  # PUT /resource
  def update
    super
  end

  # DELETE /resource
  def destroy
    super
  end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  def cancel
    super
  end

  protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username])
  end

  # If you have extra params to permit, append them to the sanitizer.
  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: [:username])
  end

  # The path used after sign up.
  def after_sign_up_path_for(resource)
    super(resource)
  end

  # The path used after sign up for inactive accounts.
  def after_inactive_sign_up_path_for(resource)
    super(resource)
  end
end