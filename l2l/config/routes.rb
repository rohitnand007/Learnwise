Rails.application.routes.draw do
  # This line mounts Spree's routes at the root of your application.
  # This means, any requests to URLs such as /products, will go to
  # Spree::ProductsController.
  # If you would like to change where this engine is mounted, simply change the
  # :at option to something different.
  #
  # We ask that you don't use the :as option here, as Spree relies on it being
  # the default of "spree".
  mount Spree::Core::Engine, at: '/spree'


  root to: 'v1/products#index'
  # API version1
  api_version(:module => "V1",:default => true, :header => {:name => "Accept", :value => "application/vnd.mycompany.com; version=1"}) do
    resources :user_usages, only: [] do
      collection do
        post 'video_usage' => 'user_usages#create_video_usage'
        get 'topics/:topic_id/video_usage/:video_id' => 'user_usages#video_usage'
      end
    end
    get '/get_user_details' => 'base#get_user_details'
    get '/set_redirect_url_after_login' => 'base#set_redirect_url_after_login'
    post '/add_user_preference' => 'base#add_user_preference'
    # post '/upload_user_note' => 'base#upload_user_note'
    resources :user_data_upload, only: [] do
      collection do
        post '/upload_user_note' => 'user_data_upload#upload_user_note'
        post '/update_user_note' => 'user_data_upload#update_user_note'
        post '/sharing_note_mail' => 'user_data_upload#sharing_note_mail'
        get '/retrive_user_notes' => 'user_data_upload#retrive_user_notes'
      end
    end
    resources :orders, only: [] do
      member do
        post 'charge'
      end
      collection do
        get 'payment'
        get 'order_history'
      end
    end
    resources :products, only: [:index, :show] do
      collection do
        get 'my_subjects'        
      end
      member do
        get 'chapters_and_sections'
        get "topics/:section_id" => 'products#topics'
        get 'complete_toc'
      end
    end
    resources :cart_items do
      collection do
        delete 'clear_cart'
        delete 'remove_grade'
      end
    end

    resources :learning_paths, only: [:create] do
      collection do
        get 'my_status'
        delete 'delete_path'
      end
    end

    # Quiz data
    get '/quiz/data/:id' => 'contents#quiz_data'
    # Content routes
    get 'contents/:content_type/:id' => 'contents#content_data'
  end
  # frontend interface to view details of workers and jobs of resque
  resque_web_constraint = lambda { |request| request.remote_ip == '127.0.0.1' }
  constraints resque_web_constraint do
    mount ResqueWeb::Engine => "/resque_web"
  end

  # all devise related routes are below (start)
  devise_for :users, controllers: {
                       omniauth_callbacks: 'users/omniauth_callbacks',
                       sessions: 'users/sessions',
                       confirmations: 'users/confirmations',
                       passwords: 'users/passwords',
                       unlocks: 'users/unlocks',
                       registrations: 'users/registrations'
                   }

  devise_scope :user do
    get "users/sign_out" => "devise/sessions#destroy"
  end
  # devise routes (end)

  resources :home, only: [] do
    collection do
      get 'welcome'
      get 'profile'
    end
  end

  # Swagger api
  resources :apidocs, only: [:index]
end
