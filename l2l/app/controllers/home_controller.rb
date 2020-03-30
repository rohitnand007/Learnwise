class HomeController < ApplicationController
  skip_before_action :authenticate_user!, only: [:welcome]
  def welcome
    render 'welcome', layout: false 
  end

  def profile
  end
end
