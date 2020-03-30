redis = Redis.new(:host => 'localhost', :port => 6379, :db => 1)

#using namespaced static for static files
$redis_static = Redis::Namespace.new("static", :redis => redis)

#using namespaced toc
$redis_toc = Redis::Namespace.new("toc", :redis => redis)