class SwaggerCart
	include Swagger::Blocks

  swagger_schema :CartItem do
  	key :required, [:id, :product_name, :price]
  	# property id: :integer, product_name: :string, price: :integer

  	property :id, type: :integer
  	property :product_name, type: :string
    property :product_id, type: :integer
    property :grade, type: :string
    property :subject, type: :string
  	property :price, type: :integer
  end

  # swagger_schema :CartItemList do
  # 	allOf do
  # 		key :'$ref', :CartItem
  # 	end
  # 	schema do
  		
  # 	end
  # end
end