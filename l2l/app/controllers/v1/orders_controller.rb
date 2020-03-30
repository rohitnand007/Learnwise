class V1::OrdersController < V1::BaseController
  before_action :set_order, only: [:charge]

  def payment
    # Create order
    @order = current_user.create_order
    data = {
      id: @order.id,
      currency: @order.currency,
      amount: @order.amount,
      description: ''
    }
    respond_to do |format|
      format.html {render 'new'}
      format.json {render json: data}
    end
  end

  def charge
    @order.process_payment params[:stripeToken]
    if @order.status=='successful'
      flash['success']= 'Payment Successful.'
    elsif @order.status=='card_error'
      flash['danger'] = 'Error while processing your card please contact your bank or try with different card.'
    else
      flash['info'] = 'Something went wrong, please try after some time.'
    end
    if request.format.json?
      if @order.status == 'successful'
        render json: {success: true, message: @order.status}, status: 200
      elsif @order.status == 'card_error'
        render json: {success: false, message: @order.status}, status: 422
      else
        render json: {success: false, message: @order.status}, status: 422
      end
      return
    end
    redirect_to products_path
  end

  def order_history
    user_orders = current_user.orders
    data = []
    user_orders.each do|order|
    data << order.order_info
    end
    render json: {success: true,user_id:current_user.id, order_history: data}, status: 200
  end

  private
  def order_params
    params #.require(:order).permit(:id, :stripeTokenType, :stripeEmail, :stripeToken)
  end

  def set_order
    @order = Order.find params[:id]
  end
end
