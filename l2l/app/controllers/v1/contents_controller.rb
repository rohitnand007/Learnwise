class V1::ContentsController < V1::BaseController
  skip_before_action :authenticate_user!
  def content_data
    content_type = params[:content_type]
    content_id = params[:id]
    logger.info "------------------#{params[:content_type]} --------#{params[:id]}--------"
    url = "#{ENV['CONTENT_SERVER']}/#{params[:content_type]}/#{params[:id]}.json"
    key = "content:#{content_type}:#{content_id}"
    data = cached_data key, url
    render json: data
  end

  def quiz_data
    content_id = params[:id]
    url = "#{ENV['CONTENT_SERVER']}/quiz/data/#{params[:id]}.json"
    key = "quiz_data:#{content_id}"
    data = cached_data key, url
    render json: data
  end

  private
  def cached_data redis_key, content_server_url
    data = Rails.cache.fetch(redis_key) do
      logger.info "Sending request to content server for #{content_server_url}"
      data_as_string = get_data_from_server(content_server_url)
      # JSON.parse(data_as_string)
      data_as_string
    end
  end
end
