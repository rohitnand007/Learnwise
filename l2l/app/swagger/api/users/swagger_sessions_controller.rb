class SwaggerSessionsController
  include Swagger::Blocks
  swagger_path '/users/sign_in.json' do
    operation :post do
      key :description, 'To sign in the user'
      parameter :header_token
      parameter do
        key :name, :user
        key :in, :body
        key :description, 'User details'
        key :required, true
        schema do
          key :type, :object
          property :email, type: :string
          property :password, type: :string
        end
      end
      response 200 do
        key :description, 'sends the sign in status'
        schema do
          key :type, :object
          property :success, type: :boolean
        end
      end
    end
  end
  swagger_path '/users/sign_out.json' do
    operation :delete do
      key :description, 'Sign outs the present user'
      parameter :header_token
      response 200 do
        key :description, 'successfully signs out the user'
        schema do
          key :type, :object
          property :success, type: :boolean
        end
      end
    end
  end
end
