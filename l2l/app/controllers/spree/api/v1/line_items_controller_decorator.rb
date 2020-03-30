Spree::Api::V1::LineItemsController.class_eval do
  
  def create
    variant = Spree::Variant.find(params[:line_item][:variant_id])
    @line_item = order.contents.add(variant, 1, {})
    if @line_item.errors.empty?
      render json: {line_item_added: true, order_info: order.api_response_data}
    else
      render json: {line_item_added: false, errors: @line_item.errors.messages}
    end
  end

  def update
    @line_item = find_line_item_from_variant
    if @order.contents.update_cart(line_items_attributes)
      @line_item.reload
      respond_with(@line_item, default_template: :show)
    else
      invalid_resource!(@line_item)
    end
  end

  def destroy
    @line_item = find_line_item_from_variant
    @order.contents.remove_line_item(@line_item)
    render json: {line_item_removed: true, order_info: order.api_response_data}
  end

  private
  def order
    @order ||= Spree::Order.includes(:line_items).find_by!(number: order_id)
    authorize! :update, @order, order_token
  end

  def find_line_item_from_variant
    variant_id = params[:id].to_i
    order.line_items.detect { |line_item| line_item.variant_id == variant_id } or
        raise ActiveRecord::RecordNotFound
  end

  def line_items_attributes
    {line_items_attributes: {
        id: params[:id],
        quantity: params[:line_item][:quantity],
        options: line_item_params[:options] || {}
    }}
  end

  def line_item_params
    params.require(:line_item).permit(
        :quantity,
        :variant_id,
        options: line_item_options
    )
  end
end