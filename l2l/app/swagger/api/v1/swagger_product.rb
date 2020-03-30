class SwaggerProduct
	include Swagger::Blocks

  swagger_schema :ProductShow do
    key :required, [:id]
    property :id, type: :string
    property :data, type: :object
  end

  swagger_schema :ProductList do
  	key :required, [:id, :default_price, :name, :accessible]
  	property :id do
  		key :type, :string
  	end
  	property :default_price do
  		key :type, :integer
  	end
  	property :name do
  		key :type, :string
  	end
  	property :accessible do
  		key :type, :boolean
  	end
  	property :in_cart do
  		key :type, :boolean
  	end
    property :grade, type: :string

    property :subject, type: :string
  end
end