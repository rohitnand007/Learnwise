Spree::Api::V1::CheckoutsController.class_eval do
  before_action :authenticate_user!, only: [:update]
  def next
    authorize! :update, @order, order_token
    # byebug
    @order.next!
    respond_with(@order, default_template: 'spree/api/v1/orders/show', status: 200)
  rescue StateMachines::InvalidTransition => e
    puts "-----------#{e}"
    respond_with(@order, default_template: 'spree/api/v1/orders/could_not_transition', status: 422)
  end

  def advance
    authorize! :update, @order, order_token
    while @order.next; end
    respond_with(@order, default_template: 'spree/api/v1/orders/show', status: 200)
  end

  def update

    # updating the order including payment info
    authorize! :update, @order, order_token
    
    # need to remove
    # @order.update_column(:email, 'krishna.chaitanya@ignitorlearning.com')
    # byebug
    if @order.update_from_params(params, permitted_checkout_attributes, request.headers.env)
      if current_api_user.has_spree_role?('admin') && user_id.present?
        @order.associate_user!(Spree.user_class.find(user_id))
      end

      return if after_update_attributes
      while @order.next; end
      if @order.completed?
        state_callback(:after)
        # respond_with(@order, default_template: 'spree/api/v1/orders/show')
        render json: @order.api_response_data
      else
        respond_with(@order, default_template: 'spree/api/v1/orders/could_not_transition', status: 422)
      end
    else
      invalid_resource!(@order)
    end
  end

end