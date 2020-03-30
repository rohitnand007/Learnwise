Spree::Api::V1::ProductsController.class_eval do
  def index
    @products = Spree::Product.includes(:option_types, :taxons, product_properties: :property, variants: variants_associations, master: variants_associations).joins(:taxons)
    # @products = product_scope.joins(:taxons)
    @products = @products.where("spree_taxons.permalink like ?", "%#{params[:grade]}%") if params[:grade].present?
    @products = @products.where("spree_taxons.permalink like ?", "%#{params[:subject]}%") if params[:subject].present?
    render json: {products: @products.map(&:api_response_data)}
  end
end