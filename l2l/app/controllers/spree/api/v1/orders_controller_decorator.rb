Spree::Api::V1::OrdersController.class_eval do
  def create
    # Disabled for allowing anonymous users to create an order in cart state
    # authorize! :create, Order

    # set quantity of each line item to 1
    line_items = params[:order][:line_items]
    params[:order][:line_items] = []
    order_user = if @current_user_roles.include?('admin') && order_params[:user_id]
      Spree.user_class.find(order_params[:user_id])
    else
      current_api_user
    end
    # order_user = current_api_user

    import_params = if @current_user_roles.include?("admin")
      params[:order].present? ? params[:order].permit! : {}
    else
      order_params
    end

    @order = Spree::Core::Importer::Order.import(order_user, import_params)

    # update order guest token using session id if anonymous user
    unless order_user.persisted?
      @order.reset_guest_token(session[:order_token_id])
    end

    # add line items to order
    line_items.each do |line_item|
      variant = Spree::Variant.find(line_item[:variant_id])
      @order.contents.add(variant, 1, {})
    end
    render json: {order_info: @order.api_response_data}, status: 201
    # respond_with(@order, default_template: :show, status: 201)
  rescue Exception => e
    # when invalid variant ids are sent
    logger.error "Error: #{e.message}"
    @order.empty!
    invalid_resource!(@order)  
  end

  def current
    @order = find_current_order
    if @order
      # respond_with(@order, default_template: :show, locals: { root_object: @order })
      render json: {incomplete_order_present: true, order_info: @order.api_response_data}
    else
      render json: {incomplete_order_present: false}
    end
  end

  def empty
    authorize! :update, @order, order_token
    @order.empty!
    render json: {order_emptied: true, order_info: @order.api_response_data}
  end

  def update
    # byebug
    logger.info "Updating order."
    find_order(true)
    authorize! :update, @order, order_token

    # order.contents.remove(variant, quantity = 1, options = {})
    # if @order.contents.update_cart(order_params)
    #   user_id = params[:order][:user_id]
    #   if current_api_user.has_spree_role?('admin') && user_id
    #     @order.associate_user!(Spree.user_class.find(user_id))
    #   end
    #   respond_with(@order, default_template: :show)
    # else
    #   invalid_resource!(@order)
    # end  
    @order.empty!
    logger.info "++++++++++++#{order_params_with_varaiants}"
    order_params_with_varaiants[:variants].each { |v| @order.contents.add(Spree::Variant.find(v))}
    render json: {order_updated: true, order_info: @order.api_response_data}
  rescue Exception => e
    # when invalid variant ids are sent
    logger.error "Error: #{e.message}"
    @order.empty!
    invalid_resource!(@order)
  end

  private
  def find_current_order
    # current_api_user ? current_api_user.orders.incomplete.order(:created_at).last : nil
    if current_api_user && current_api_user.persisted?
      current_api_user.orders.incomplete.order(:created_at).last
    elsif (order=Spree::Order.incomplete.where(guest_token: session[:order_token_id]).last)
      order
    else
      nil
    end
  end

  def order_params_with_varaiants
    params.require(:order).permit(:order_token, variants: [])
  end
end