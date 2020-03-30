Spree::Admin::ProductsController.class_eval do
  def new
    @toc_items = Product.only(:id, :name, :grade, :subject).all
  end

  def create
    selected_tocs = params[:product][:product_tocs]
    @product = Spree::Product.new(product_params)
    @product.sku = @product.product_guid
    @product.price = 0
    @product.product_tocs = []
    if @product.product_type == 'Book'
      @product.product_tocs << Spree::ProductToc.new(toc_guid: @product.product_guid)
    elsif @product.product_type == 'Grade'
      selected_tocs.each do |toc|
        @product.product_tocs << Spree::ProductToc.new(toc_guid: toc) 
      end
    end
    if @product.save
      redirect_to admin_products_path
    else
      @toc_items = Product.only(:id, :name, :grade, :subject).all
      render 'new'
      # render json: {messages: @product.errors.messages, product: @product}
    end
  end

  def index
  end


  private
  def product_params
    params.require(:product).permit(:name, :available_on, :shipping_category_id, :product_type, :product_guid )
  end
end