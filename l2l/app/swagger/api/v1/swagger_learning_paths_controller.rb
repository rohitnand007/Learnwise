class SwaggerLearningPathsController
  include Swagger::Blocks

  swagger_path '/learning_paths/my_status' do
    operation :get do
      key :description, 'get learning paths of the user'
      parameter :header_token
      parameter do
        key :name, :topic_id
        key :in, :query
        key :description, 'status of only this topic'
        key :required, false
        key :type, :string
      end
      response 200 do
        key :description, 'response'
        schema do
          key :type, :array
          items do
            key :type, :object
            property :content_id, type: :string
            property :topic_id, type: :string
            property :attempted, type: :boolean
          end
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

  swagger_path '/learning_paths' do
    operation :post do
      key :description, 'Create a new path'
      parameter :header_token
      parameter do
        key :name, :content_id
        key :in, :body
        key :description, 'Content Id'
        key :required, true
        key :type, :string
      end
      parameter do
        key :name, :topic_id
        key :in, :body
        key :description, 'Topic Id'
        key :required, true
        key :type, :string
      end
      parameter do
        key :name, :attempted
        key :in, :body
        key :description, 'Attempted'
        key :required, true
        key :type, :boolean
      end
      response 200 do
        key :description, 'Status'
        schema do
          key :type, :object
          property :saved, type: :boolean
          property :errors, type: :array
        end
      end
    end
  end

  swagger_path '/learning_paths/delete_path' do
    operation :delete do
      key :description, 'Delete a path'
      parameter :header_token
      parameter do
        key :name, :content_id
        key :in, :body
        key :description, 'Content Id'
        key :required, true
        key :type, :string
      end
      parameter do
        key :name, :topic_id
        key :in, :body
        key :description, 'Topic Id'
        key :required, true
        key :type, :string
      end
      response 200 do
        key :description, 'Status'
        schema do
          key :type, :object
          property :destroyed, type: :boolean
          property :message, type: :string
        end
      end
    end
  end
end