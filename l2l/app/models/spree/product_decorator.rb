Spree::Product.class_eval do
  # before_validation :set_defaults

  has_many :product_tocs
  accepts_nested_attributes_for :product_tocs
  validates_presence_of :product_type
  validates_presence_of :product_guid, if: Proc.new {|p| p.product_type=='Book'}
  validates_uniqueness_of :product_guid, if: Proc.new {|p| p.product_type=='Book'}

  # def set_defaults
  #   self.sku = product_guid
  #   self.price = 0
  # end

  def api_response_data
    {
      general_data: get_general_data,
      variants_data: get_variants_data
    }
  end

  def get_general_data
    if taxons.any? # need to update
      taxons_info = taxons.last.permalink.split("/")
      grade = taxons_info[1]
      subject = taxons_info[3]
    end
    {
      product_id: id,
      name: name,
      available_from: available_on,
      product_type: product_type,
      product_guid: product_guid,
      grade: grade, #from taxon
      subject: subject # from taxons
    }
  end

  def get_variants_data
    variants.map do |variant|
      {
        variant_id: variant.id,
        cost_price: variant.price.to_f,
        cost_currentcy: variant.cost_currency,
        position: variant.position,
        option_value: variant.option_values.first.presentation,
        option_type: variant.option_values.first.option_type.presentation
      }
    end
  end
end