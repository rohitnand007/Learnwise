class V1::CartItemsController < V1::BaseController
  skip_before_action :authenticate_user!

  def index
    @cart_items = cart_items
    c_t = {}
    @cart_items.map{|k| c_t[k.product.grade] = []}
    # @cart_items.map{|k| c_t[k.product.grade][k.product.subject] = []}
    @cart_items.map{|c_item| c_t[c_item.product.grade] << c_item.get_display_data } #[c_item.product.subject]
    data = {
      total_price: @cart_items.sum(:price),
      items: c_t,
      clear_cart_url_data: {
        url: '/clear_cart.json',
        method: 'delete'
      },
      back_url_data: {
        url: '/products.json',
        method: 'get'
      },
      check_out_url_data: {
        url: '/orders/new_order',
        method: 'get'
      }
    }
    respond_to do |format|
      format.html
      format.json {render json: data}    
    end
  end

  def create
    product_id = cart_item_params[:product_id]
    @cart_item = CartItem.build_cart_item(product_id, current_user, session.id)
    respond_to do |format|
      if cart_items.map(&:product_id).include? product_id
        format.html {redirect_to action: index, notice: 'Product already in cart.'}
        format.json {render json: {message: 'Product already in cart.'}}
      elsif @cart_item.save
        format.html {redirect_to action: index}
        format.json {render json: {message: 'successfully added'}, status: 200}
      else
        format.html {redirect_to products_path, notice: 'Unable to add.'}
        format.json{render json: {message: 'some thing went wrong'}, status: :not_acceptable}
      end
    end
  end

  def destroy
    @cart_item = CartItem.find(cart_item_params[:id])
    respond_to do |format|
      if @cart_item.present?
        @cart_item.destroy
        format.html {redirect_back(fallback_location: root_path)}
        format.json {render json: {message: 'successfully removed from cart'}, status: 200}
      else
        format.json{render json: {message: ''}, status: :not_acceptable}
      end
    end
    
  end

  def clear_cart
    @cart_items = cart_items
    @cart_items.destroy_all
    respond_to do |format|
      format.html {redirect_to "/products"}
      format.json {render json: {message: 'successully cleared the cart'}}     
    end   
  end

  def remove_grade
    @cart_items = cart_items.select{|c| c.product.grade == params[:grade]}
    @cart_items.each {|c| c.destroy}
    respond_to do |format|
      format.json {render json: {message: 'removed items of grade'}}
    end
  end

  private
  def cart_item_params
    params.permit(:product_id, :id)
  end
end