class V1::UserDataUploadController < V1::BaseController

  def upload_user_note
    @user_note = UserNote.where(student_id:current_user.id, topic_id: params["topic_id"]).last
    if @user_note.present?
      @user_note.text = BSON::Binary.new(params["text"], :generic) if params["text"].present?
      # @user_note.image = BSON::Binary.new(params["image"], :generic) if params["image"].present?
      @user_note.save!
      render :json => {success:true, message:"notes updated successfully", note_id: @user_note.id.to_s}
    else
      @user_note = UserNote.new
      @user_note.student_id = current_user.id #params["student_id"]
      @user_note.topic_id = params["topic_id"]
      @user_note.text = BSON::Binary.new(params["text"], :generic) if params["text"].present?
      # @user_note.image = BSON::Binary.new(params["image"], :generic) if params["image"].present?
      if @user_note.save!
        render :json => {success:true, message: "User note posted successfully", note_id: @user_note.id.to_s}
      else
        render :json=> {sucess: false, message:"User Note cannot be saved"}
      end
    end
  end

  def update_user_note
    @user_note = UserNote.find(params["note_id"])
    if @user_note.present?
      @user_note.text = BSON::Binary.new(params["text"], :generic) if params["text"].present?
      # @user_note.image =  BSON::Binary.new(params["image"], :generic) if params["image"].present?
      @user_note.save!
      render :json => {success:true, message:"notes updated successfully", note_id: @user_note.id.to_s}
    else
      render :json => {success:false, message:"No notes available for this id"}
    end
  end

  def retrive_user_notes
    @user_notes = UserNote.where(student_id: current_user.id, topic_id: params["topic_id"]).last
    if @user_notes.present?
      notes_json = {note_id: @user_notes.id.to_s, text: @user_notes.text.try(:data) }
      render :json => {success: true, notes: notes_json}
    else
      render :json => {success:false, message:"No notes available for this user in this topic"}
    end
  end

  def sharing_note_mail
    note_id = params["note_id"]
    receiver_mail_id = params["receiver_mail_id"]
    mail_subject = params["mail_subject"]
    #create_attachment and send mail to user
    UserNoteMailer.send_user_note_pdf(note_id, receiver_mail_id, current_user.email, mail_subject).deliver_now
    render :json => {success: true, message:"Mail delivered to #{receiver_mail_id}"}
  end

end
