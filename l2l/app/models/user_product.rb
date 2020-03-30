class UserProduct < ApplicationRecord
  belongs_to :user
  belongs_to :order
  validates :user, :order, presence: true
  validates_presence_of :product_id
  validates_uniqueness_of :product_id, scope: :user_id
end