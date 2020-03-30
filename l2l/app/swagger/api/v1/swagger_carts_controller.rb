class SwaggerCartsController
	include Swagger::Blocks
	swagger_path '/cart_items.json' do
		operation :get do
      key :description, 'Return all the cart items'
      response 200 do
        key :description, 'product response'
        schema do
        	key :type, :object
        	property :count, type: :integer
        	property :total_price, type: :integer
        	property :cart_items do
        		key :type, :array
        		items do
        			key :'$ref', :CartItem
        		end
        	end
        	property :checkout_url, type: :string
          property :back_url_data do
            key :type, :object
            property :url,type: :string
            property :method,type: :string
          end
          property :checkout_url_data do
            key :type, :object
            property :url,type: :string
            property :method,type: :string
          end
          property :clear_cart_url_data do
            key :type, :object
            property :url,type: :string
            property :method,type: :string
          end
        end
      end
      response :default do
        key :description, 'unexpected error'
        schema do
          key :'$ref', :ErrorModel
        end
      end
    end
    operation :post do
    	key :description, 'Add a product to the cart.'
      parameter :header_token
    	parameter do
        key :name, :id
        key :in, :body
        key :description, 'ID of product to add'
        key :required, true
        key :type, :integer
      end
      response 200 do
    		key :description, 'Product added to cart.'
    		schema do
    			key :type, :object
          property :message, type: :string
    		end
    	end
    end
	end

	swagger_path '/cart_items/{id}.json' do
		operation :delete do
			key :description, 'Remove a single product from cart'
      parameter :header_token
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of cart item to remove'
        key :required, true
        key :type, :integer
      end
      response 200 do
    		key :description, 'Deleted the cart item.'
    		schema do
    			key :type, :object
          property :message, type: :string
    		end
    	end
    	response :default do
        key :description, 'unexpected error'
        schema do
          key :'$ref', :ErrorModel
        end
      end
		end
	end

	swagger_path '/cart_items/clear_cart.json' do
		operation :delete do
      key :description, 'To clear the cart item.'
      parameter :header_token
			response 200 do
				key :description, 'Cleared the cart.'
				schema do
					key :type, :object
          property :message, type: :string
				end
			end
		end
	end
  swagger_path '/cart_items/remove_grade.json' do
    operation :delete do
      key :description, 'To remove all products of a grade.'
      parameter :header_token
      parameter do
        key :name, :grade
        key :in, :body
        key :description, 'Grade of the books to be removed.'
        key :required, true
        key :type, :string
      end
      response 200 do
        key :description, 'removed successfully.'
        schema do
          key :type, :object
          property :message, type: :string
        end
      end
    end
  end
end