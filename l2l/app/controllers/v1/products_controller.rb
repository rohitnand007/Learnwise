class V1::ProductsController < V1::BaseController
  skip_before_action :authenticate_user! , only: [:index, :show, :chapters_and_sections, :topics, :complete_toc]
  layout 'products_layout'
  # load_and_authorize_resource
  # skip_authorize_resource :only => [:index, :show, :my_subjects]
  before_action :set_product, only: [:show, :chapters_and_sections, :topics, :complete_toc]

  def index
    @session_id = session.id
    @user = current_user
    if params[:grade].present? || params[:subject].present?
      @products = Product
      @products = @products.where(grade: params[:grade]) if params[:grade].present?
      @products = @products.where(subject: params[:subject]) if params[:subject].present?
    else
      @products = Product.all
    end
    products_data = @products.map{|prod| prod.get_display_data(current_user)}
    respond_to do |format|
      format.html
      format.json {render json: {count: products_data.count, products:  products_data}}
    end
  end

  def show
    @product = Product.find params[:id]
    data = Rails.cache.fetch(@product) do
      # logger.info "#{@product.id} storing data in cache"
      @product.data
    end
    if current_user
      user_data = current_user.product_toc @product.id.to_s
      render json: user_data
    else
      render json: data
    end
  end

  def complete_toc
    toc_data = get_toc_data
    logger.info "----------#{toc_data}"
    chapters = []
    toc_data['toc']['ge'].each do |chapt|
      sections = []
      chapt['ge'].each do |sect|
        topics = []
        sect['ge'].each do |topic|
          topics << topic 
        end
        sect['topics'] = topics
        sect.delete 'ge'
        sections << sect
      end
      chapt.delete 'ge'
      chapt['sections'] = sections
      chapters << chapt
    end
    render json: {chapters: chapters}  
  end

  def chapters_and_sections
    toc_data = get_toc_data
    logger.info "----------#{toc_data}"
    chapters = []
    toc_data['toc']['ge'].each do |chapt|
      sections = []
      chapt['ge'].each do |sect|
        sect.delete 'ge'
        sections << sect
      end
      chapt.delete 'ge'
      chapt['sections'] = sections
      chapters << chapt
    end
    render json: {chapters: chapters}
  end

  def topics
    toc_data = get_toc_data
    section_data = {}
    section_id = params[:section_id]
    section_found = false
    toc_data['toc']['ge'].each do |chapt|
      break if section_found
      chapt['ge'].each do |sect|
        break if section_found
        if sect['_id'] == section_id
          section_data = sect
          section_found = true
        end
      end
    end
    render json: {topics: section_data['ge']}
  end

  def my_subjects
    @products = current_user.products
    grades = {}
    # data = {grades: []}
    @products.each do |product|
       grades[product.grade] ||= {'subjects' => []}
       grades[product.grade]['subjects'] << {name: product.subject, id: product.id.to_s}
    end
    render json: {grades: grades}
  end

  private
  def set_product
    @product = Product.find params[:id]    
  end

  def get_toc_data
    data = Rails.cache.fetch(@product) do
      logger.info "#{@product.id} storing data in cache"
      @product.data
    end
    if current_user
      user_data = current_user.product_toc @product.id.to_s
      user_data
    else
      {'toc' => UserUsage.product_toc_for_user(-1, @product.id)}
    end
  end
end
