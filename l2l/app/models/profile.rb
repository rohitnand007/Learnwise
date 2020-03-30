class Profile < ApplicationRecord
  validates_uniqueness_of :user_id
  belongs_to :user
  serialize :preferences, Hash
end
