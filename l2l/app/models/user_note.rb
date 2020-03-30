class UserNote
  include Mongoid::Document
  include Mongoid::Timestamps
  # include Mongoid::Paperclip
  field :student_id, type: Integer
  field :topic_id, type: String
  field :text, type: BSON::Binary
  # field :image, type: BSON::Binary
  # # has_mongoid_attached_file :image, :path =>  ":rails_root/public/system/:class/:student_id/:topic_id/:filename"
  # # attr_accessor :text, :topic_id, :image, :student_id
  validates_presence_of [:student_id, :topic_id]
  # # validates_attachment :image, content_type: { content_type: /\Aimage\/.*\Z/ }

end