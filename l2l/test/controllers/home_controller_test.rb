require 'test_helper'

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "should get welcome" do
    get welcome_home_index_url
    assert_response :success, "welcome page not found"
  end
end