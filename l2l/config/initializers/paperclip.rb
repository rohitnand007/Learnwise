Paperclip::Attachment.default_options[:command_path] = "/usr/bin"
module Paperclip
  module Interpolations
    # def user_id attachment, style_name
    #     attachment.instance.sender_id
    # end
    def student_id attachment, style_name
      attachment.instance.student_id rescue attachment.instance.sender_id
    end
    def topic_id attachment, style_name
      attachment.instance.topic_id
    end
  end
end
