class Users::PasswordsController < Devise::PasswordsController
  # GET /resource/password/new
  def new
    super
  end

  # POST /resource/password
  # POST /users/password
  def create
    unless request.format.json?
      super
      return
    end
    @user = User.find_by_email(params[:user][:email])
    if @user.present?
      @user.send_reset_password_instructions
      render json:{success:true, message:"check your registered mail once"}, status:200
    else
      render :text => "no such email"
    end
  end

  # GET /resource/password/edit?reset_password_token=abcdef
  def edit
    unless request.format.json?
      super
      return
    end
  end

  # PUT /resource/password
  def update
    unless request.format.json?
      super
      return
    end
    original_token = params[:user][:reset_password_token]
    reset_password_token = Devise.token_generator.digest(self, :reset_password_token, original_token)
    # reset_password_token = params[:user][:reset_password_token]

    recoverable = User.find_or_initialize_with_error_by(:reset_password_token, reset_password_token)

    if recoverable.persisted?
      if recoverable.reset_password_period_valid?
        recoverable.reset_password(params[:user][:password], params[:user][:password_confirmation])
        recoverable.reset_password_token = original_token if recoverable.reset_password_token.present?
        render json:{success:true, message:"password reset Successfully"}, status:200
      else
        recoverable.errors.add(:reset_password_token, :expired)
        render json:{success:false, message:recoverable.errors.messages}, status: :not_acceptable
      end
    end
  end

  protected

  def after_resetting_password_path_for(resource)
    super(resource)
  end

  # The path used after sending reset password instructions
  def after_sending_reset_password_instructions_path_for(resource_name)
    unless request.format.json?
      super(resource_name)
      return
    end
  end
end
