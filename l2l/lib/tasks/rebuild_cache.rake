namespace :rebuild_cache do
  desc "Caching the static pages in redis"
  task static_pages: :environment do
    #welcome page
    data = File.read(Rails.root.to_s+'/app/views/home/welcome.html')
    $redis_static.set('welcome_page', data)
    puts "Welcome page added in cache."
  end

end
