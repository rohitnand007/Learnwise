class SwaggerProductsController
  include Swagger::Blocks

  swagger_path '/products/{id}' do
    operation :get do
      key :description, 'Returns a single product if the user has access'
      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of product to fetch'
        key :required, true
        key :type, :string
      end
      parameter :header_token
      response 200 do
        key :description, 'product response'
        schema do
          key :'$ref', :ProductShow
        end
      end
      response 403 do
        key :description, 'you are not authorized to view the product'
      end
      response :default do
        key :description, 'unexpected error'
        schema do
          key :'$ref', :ErrorModel
        end
      end
    end
  end
  swagger_path '/products' do
    operation :get do
      key :description, 'Returns all products'
      key :produces, [
        'application/json'
      ]
      parameter do
        key :name, :grade
        key :in, :query
        key :description, 'Products belonging to this grade'
        key :required, false
        key :type, :string
      end
      parameter do
        key :name, :subject
        key :in, :query
        key :description, 'Products belonging to this subject'
        key :required, false
        key :type, :string
      end
      response 200 do
        key :description, 'products list response'
        schema do
          key :type, :object
          property :count do
            key :type, :integer
          end
          property :products do
            key :type, :array
              items do
                key :'$ref', :ProductList
              end
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
  end
  swagger_path '/products/my_subjects' do
    operation :get do
      key :description, 'Returns user subjects grade wise.'
      key :produces, [
        'application/json'
      ]
      response 200 do
        key :description, 'products '
        schema do
          key :type, :object
          property :grades do
            key :type, :object
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
  end
end