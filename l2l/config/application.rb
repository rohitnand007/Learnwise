require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

# Require mongoid config
require 'mongoid'
Mongoid.load!(File.expand_path('mongoid.yml', './config'))



module L2L
  class Application < Rails::Application
    
    config.to_prepare do
      # Load application's model / class decorators
      Dir.glob(File.join(File.dirname(__FILE__), "../app/**/*_decorator*.rb")) do |c|
        Rails.configuration.cache_classes ? require(c) : load(c)
      end

      # Load application's view overrides
      Dir.glob(File.join(File.dirname(__FILE__), "../app/overrides/*.rb")) do |c|
        Rails.configuration.cache_classes ? require(c) : load(c)
      end
    end

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    #redis configuration 
    config.cache_store = :redis_store, {
      host: "localhost",
      port: 6379,
      db: 1,
      namespace: "cache"
    }, { expires_in: 1.day }
    # Setting active record as default for models when generating
    # To generate a model which use mongodb:
    # => rails g mongoid:model modelname
    config.generators do |g|
      g.orm :active_record
    end
    # Setting up environment variables
    config.before_configuration do
      env_file = File.join(Rails.root, 'config', 'local_env.yml')
      YAML.load(File.open(env_file)).each do |key, value|
         if key.to_s==Rails.env 
          value.each do |k,v|
             ENV[k.to_s] = v 
          end
         end
      end if File.exists?(env_file)
    end

    # loading files from lib
    config.autoload_paths += %W(#{config.root}/lib)

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '*', :headers => :any, :methods => [:get, :post, :delete, :put, :options], :credentials => true
      end
    end
  end
end