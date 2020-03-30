class CustomRoutesController < Spree::Api::BaseController
  def present_order
    @order = current_user.orders.where("state != 'complete'").last
    logger.info "---------------#{current_user.id}"
    render json: @order
  end
end