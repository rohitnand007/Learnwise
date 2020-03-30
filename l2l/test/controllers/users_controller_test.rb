require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  test "new user registration" do
    get new_user_registration_url
    assert_response :success
    post '/users', params: {user: {username: 'user', email: 'email@gmail.com', password: 'edutor', 'password_confirmation': 'edutor'}}
    assert_response :redirect
    assert_redirected_to root_url
    follow_redirect!
    assert_response :success
  end

  test 'user sign in' do 
    user = {username: 'test_user',email: '111@gmail.com', password: 'edutor' }
    sign_in user
    assert_response :redirect
  end

  test "user sign out" do 
    delete '/users/sign_out'
    assert_redirected_to root_url
    follow_redirect!
    assert_response :success
  end

  test 'edit user' do
    test_user_sign_in
    get edit_user_registration_path
    assert_response :success
    # assert_select 'h1', 'Edit User'
  end

  test 'update user' do
    test_user_sign_in
    put '/users', params: {user: {username: 'new name', email: '234@gmail.com', current_password: 'edutor', password: '', password_confirmation: ''}}
    assert_response :redirect
    assert_redirected_to root_url
    user_confirmation_token = User.last.confirmation_token
    url = "http://127.0.0.1:3000/users/confirmation?confirmation_token=#{user_confirmation_token}"
    get url
    assert_equal User.last.username, 'new name', 'Username not updated.'
    assert_equal User.last.email, '234@gmail.com', 'Email not updated.'
  end
end
