class V1::UserUsagesController < V1::BaseController

  def create_video_usage
    video_data = video_usage_params

    video_usage = VideoUsage.where(user_id: current_user.id, video_id: video_data[:video_id], topic_id: video_data[:topic_id])[0]
    if video_usage.present?
      video_usage.watched_data['raw_data'] += video_data['watched_data']['raw_data']
    else
      video_usage = VideoUsage.new(user_id: current_user.id, video_id: video_data[:video_id], topic_id: video_data[:topic_id], duration: video_data[:duration], watched_data: {'raw_data' => video_data['watched_data']['raw_data']})
    end
    if video_usage.save
      render json: video_usage.response_data
    else
      render json: {saved: false, message: video_usage.errors.messages}, status: :not_acceptable
    end
  end

  def update_video_usage
    video_data = video_usage_params
    video_usage = VideoUsage.where(user_id: current_user.id, video_id: video_data[:video_id], topic_id: video_data[:topic_id])[0]
    if video_usage.present?
      video_usage.update_attributes(watched: video_data[:watched])
      render json: video_usage.response_data
    else
      render json: {message: 'No Video found.'}, status: :not_acceptable
    end
  end

  def video_usage
    logger.info "--------#{current_user.id}"
    video_usage = VideoUsage.where(user_id: current_user.id, video_id: params[:video_id], topic_id: params[:topic_id])[0]
    if video_usage.present?
      render json: video_usage.response_data
    else
      render json: {message: 'No Video found.'}
    end
  end
  private
  def video_usage_params
    params[:user_usage]#.require(:user_usage).permit(:video_id, :topic_id, :duration, :watched_data )
  end
end
