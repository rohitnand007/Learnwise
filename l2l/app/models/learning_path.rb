class LearningPath < ApplicationRecord
	belongs_to :user
	validates_presence_of :user_id, :content_id, :topic_id
	validates_uniqueness_of :topic_id, scope: [:content_id, :user_id]
end
