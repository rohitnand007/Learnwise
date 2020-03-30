class SwaggerBaseController
  include Swagger::Blocks
  swagger_path '/get_user_details.json' do
    operation :get do
      key :description, 'To get the present user details'
      response 200 do
        key :description, 'sends user details'
        schema do
          key :type, :object
          property :user do
            key :type, :object
            property :username, type: :string
            property :email, type: :string
          end
        end
      end
    end
  end

  swagger_path '/set_redirect_url_after_login.json' do
    operation :get do
      key :description, 'To provide the redirect_url after login'
      parameter do
        key :name, :redirect_url
        key :in, :params
        key :required, true
        key :type, :string
      end
      response 200 do
        key :description, 'successfully set the redirect_url'
        schema do
          key :type, :object
          property :success, type: :boolean
          end
        end
      end
    end

end
