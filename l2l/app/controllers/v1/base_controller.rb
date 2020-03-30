class V1::BaseController < ApplicationController
  before_action :authenticate_user!, except: [:set_redirect_url_after_login]
  layout 'products_layout'

  def get_user_details
    render json: {user: {username: current_user.username, email: current_user.email, profile_preferences: current_user.profile.preferences }}
  end

  def add_user_preference
    profile_pref = current_user.profile.preferences
    if profile_pref.empty?
      current_user.profile.update_attribute(:preferences, JSON.parse(params["profile_preference"]))
    else
      new_profile_pref = profile_pref.merge(JSON.parse(params["profile_preference"]))
      current_user.profile.update_attribute(:preferences, new_profile_pref)
    end
    render json: {success: true}, status: 200
  end

  def set_redirect_url_after_login
    render json: {success: true}, status: 200
  end
end
