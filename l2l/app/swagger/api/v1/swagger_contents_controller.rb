class SwaggerContentsController
  include Swagger::Blocks

  swagger_path '/contents/{content_type}/{content_id}.json' do
    operation :get do
      key :description, 'Returns a single product if the user has access'
      parameter do
        key :name, :content_type
        key :in, :path
        key :description, 'content_type'
        key :required, true
        key :type, :string
      end
      parameter do
        key :name, :content_id
        key :in, :path
        key :description, 'content_id'
        key :required, true
        key :type, :string
      end
      parameter :header_token
      response 200 do
        key :description, 'response'
        schema do
          key :type, :object
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