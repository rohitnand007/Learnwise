# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby(2.4.1) and Rails(5.0.2) Installation
  
  * Install RVM
    curl -sSL https://get.rvm.io | bash

  * Installing Ruby
    rvm install ruby-2.4.1
    rvm use ruby-2.4.1 (making this version default) (run this command as login-shell)

  * Installing rails
    gem install rails -v 5.0.2

* System dependencies
    OS - Ubuntu (above 14.04), minimum RAM: 4GB

* Database creation
    ###Mysql Installation(5.7.18)
      * sudo apt-get install mysql-server
      (Note down user and password when prompted)

    ###Redis Installation
      * wget http://download.redis.io/releases/redis-3.2.8.tar.gz
      * tar xzf redis-3.2.8.tar.gz
      * cd redis-3.2.8
      * make
      * make test 
      * sudo make install
      * cd utils 
      * sudo ./install_server.sh
      (Select the defaults when prompted for any thing)

    ###MongoDB Installation(3.4.3)
      *sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6

      *echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list (for ubuntu 14.04)

      *sudo apt-get update

      *sudo apt-get install -y mongodb-org

      *To prevent mongodb from auto updating
        echo "mongodb-org hold" | sudo dpkg --set-selections
        echo "mongodb-org-server hold" | sudo dpkg --set-selections
        echo "mongodb-org-shell hold" | sudo dpkg --set-selections
        echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
        echo "mongodb-org-tools hold" | sudo dpkg --set-selections


* Database initialization


* Other dependencies
    sudo apt-get install imagemagick libmagickwand-dev libmagickcore-dev
    sudo apt-get install libmysqlclient-dev
    sudo apt-get install libpq-dev
    sudo apt-get install nodejs


* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Configuration
  ### Mysql
    * Create a database.yml file in config directory and add the following in the file(place the username and password values with the one given while installing mysql)

      default: &default
        adapter: mysql2
        encoding: utf8
        pool: 5
        username: 
        password: 
        socket: /var/run/mysqld/mysqld.sock

      development:
        <<: *default
        database: L2L_development

      test:
        <<: *default
        database: L2L_test

      production:
        <<: *default
        database: L2L_production
        username: L2L
        password: <%= ENV['L2L_DATABASE_PASSWORD'] %>

      staging:
        <<: *default
        database: L2L_staging

  ### MongoDB
    * rails generate mongoid:config (do this after bundle install)

* Deployment instructions

  * Starting Mysql server
    sudo service mysql start

  * Starting Redis server
    sudo service redis_6379 start

  * From the app directory run the following commands
    * bundle install
    * rake db:create
    * rake db:migrate

* ...
