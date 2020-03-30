require 'test_helper'

class V1::ContentsControllerTest < ActionDispatch::IntegrationTest

  setup do
    user = {username: 'test_user',email: '111@gmail.com', password: 'edutor' }
    sign_in user
  end

  test "should get data" do
    get '/contents/script/1.json'
    assert_response :success
  end

  test 'get data from content server' do
    data_url = "#{ENV['CONTENT_SERVER']}/script/b121002.json"
    uri = URI.parse(data_url)
    req = Net::HTTP::Get.new(uri.to_s)
    res = Net::HTTP.start(uri.host, uri.port, use_ssl: false){|http| http.request(req)}
    assert res.code, '200'
  end
end
