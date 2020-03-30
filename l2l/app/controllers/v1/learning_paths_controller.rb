class V1::LearningPathsController < V1::BaseController

  def my_status
    my_paths = current_user.learning_paths.select('id, content_id, topic_id, attempted')
    my_paths = my_paths.where(topic_id: params[:topic_id]) if params[:topic_id].present?
    render json: my_paths
  end
  
  def create
    l_p = current_user.learning_paths.build(allowed_params)
    if l_p.save
      render json: {saved: true}
    else
      render json: {saved: false, errors: l_p.errors.messages}
    end
  end

  def delete_path
    l_p = current_user.learning_paths.where(content_id: allowed_params[:content_id], topic_id: allowed_params[:topic_id])[0]
    if l_p.present?
      l_p.destroy
      render json: {destroyed: true}
    else
      render json: {destroyed: false, message: 'Learning Path not found'}
    end    
  end

  private
  def allowed_params
    params.require(:learning_path).permit(:content_id, :topic_id, :attempted)
  end
end
