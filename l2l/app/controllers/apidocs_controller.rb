class ApidocsController < ActionController::Base
  include Swagger::Blocks

  Dir[Rails.root.to_s+"/app/swagger/api/v1/*.rb"].each {|file| require file } +
      Dir[Rails.root.to_s+"/app/swagger/api/users/*.rb"].each {|file| require file }

  swagger_root do
    key :swagger, '2.0'
    info do
      key :version, '1.0.0'
      key :title, 'L2L'
      key :description, 'A sample API ' 
                        
      key :termsOfService, ''
      contact do
        key :name, ''
      end
      license do
        key :name, ''
      end
    end
    tag do
      key :name, 'l2l'
      key :description, 'l2l operations'
      externalDocs do
        key :description, 'Find more info here'
        key :url, 'https://swagger.io'
      end
    end
    key :host, 'localhost:3000' #http://lifetolearning.com/
    key :basePath, ''
    key :consumes, ['application/json']
    key :produces, ['application/json']
    security_definition :api_key do
      key :type, :apiKey
      key :name, :token
      key :in, :header
    end
    parameter :header_token do
      key :name, :token
      key :in, :header
      key :description, 'access token'
      key :required, true
      key :type, :string
    end
  end


  # A list of all classes that have swagger_* declarations.
  # SWAGGERED_CLASSES = [
  #   PetsController,
  #   Pet,
  #   ErrorModel,
  #   self,
  # ].freeze

  SWAGGERED_CLASSES = [
    SwaggerProductsController, SwaggerProduct, ErrorModel, SwaggerCart, SwaggerCartsController, SwaggerOrdersController, SwaggerBaseController,SwaggerSessionsController, SwaggerContentsController, SwaggerLearningPathsController, self].freeze

  def index
    render json: Swagger::Blocks.build_root_json(SWAGGERED_CLASSES)
  end
end