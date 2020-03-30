class UserUsage
  include Mongoid::Document
  include Mongoid::Timestamps
  # field :name, type: String
  # field :data, type: Hash
  # field :grade, type: String
  # field :subject, type: String
  # field :default_price, type: Integer
  # validates_presence_of [:name, :data, :grade, :subject, :default_price]
  field :user_id, type: Integer
  field :product_id, type: String
  field :toc, type: Hash

  def self.product_toc_for_user user_id, product_id
    product = Product.find product_id
    toc_data = product.data['toc']

    @previous_chapter_completed = true
    @previous_section_completed = true
    @previous_topic_completed = true

    chapters = toc_data['ge']
    chapters.each_with_index do |chapter, index|
      sections = chapter['ge']
      if @previous_chapter_completed
        chapter.merge!({'_unlocked' => true})

        total_sections_completed = 0
        sections.each_with_index do |section, index|
          topics = section['ge']
          if @previous_section_completed
            section.merge!({'_unlocked' => true})
            
            @total_topics_completed = 0
            topics.each_with_index do |topic, index|
              notes_present = UserNote.find_by(student_id: user_id, topic_id: topic['_id']).present?
              topic.merge!({'notes_present' => notes_present})
              if @previous_topic_completed
                topic.merge!({'_unlocked' => true})
                present_topic_completed = LearningPath.find_by_user_id_and_topic_id(user_id, topic['_id']).present?
                if !present_topic_completed
                  @previous_chapter_completed = false
                  @previous_section_completed = false
                  @previous_topic_completed = false
                  topic.merge!({'percent_completed' => 0})
                else
                  topic.merge!({'percent_completed' => 100})
                  @total_topics_completed += 1
                end
              else
                topic.merge!({'_unlocked' => false})
                topic.merge!({'percent_completed' => 0})
              end
            end
            section.merge!({'percent_completed' => (@total_topics_completed/(topics.count*1.0)) * 100})
            total_sections_completed += 1 if (@total_topics_completed == topics.count)
            section.merge!({'ge' => topics})
          else
            section.merge!({'_unlocked' => false})
            section.merge!({'percent_completed' => 0})
            topics.each_with_index do |topic, index|
              notes_present = UserNote.find_by(student_id: user_id, topic_id: topic['_id']).present?
              topic.merge!({'notes_present' => notes_present})
              topic.merge!({'_unlocked' => false})
              topic.merge!({'percent_completed' => 0})
            end
          end
        end
        
        chapter.merge!({'percent_completed' => (total_sections_completed/(sections.count*1.0)) * 100})
      else
        chapter.merge!({'_unlocked' => false})
        sections.each_with_index do |section, index|
            section.merge!({'_unlocked' => false})
            section.merge!({'percent_completed' => 0})
            topics = section['ge']
            topics.each_with_index do |topic, index|
              notes_present = UserNote.find_by(student_id: user_id, topic_id: topic['_id']).present?
              topic.merge!({'notes_present' => notes_present})
              topic.merge!({'_unlocked' => false})
              topic.merge!({'percent_completed' => 0})
            end
            section.merge!({'ge' => topics})
        end
      end
      chapter.merge!({'ge' => sections})
    end
    toc_data.merge!({'ge' => chapters})
    toc_data
  end

  def self.set_user_usage_data user_id, product_id
    u = UserUsage.new(
      user_id: user_id,
      product_id: product_id,
      toc: product_toc_for_user(user_id, product_id)
    )
    u.save
    u
  end

  def reevaluate_toc
    self.toc = UserUsage.product_toc_for_user user_id, product_id
    self.save!
  end
end

# def modified_topic_data topic, user_id
#   if @previous_topic_completed
#     topic.merge!({'_unlocked' => true})
#     present_topic_completed = LearningPath.find_by_user_id_and_topic_id(user_id, topic['_id']).present?
#     if !present_topic_completed
#       @previous_chapter_completed = false
#       @previous_section_completed = false
#       @previous_topic_completed = false
#       topic.merge!({'percent_completed' => 0})
#     else
#       topic.merge!({'percent_completed' => 100})
#       @total_topics_completed += 1
#     end
#   else
#     topic.merge!({'_unlocked' => false})
#     topic.merge!({'percent_completed' => 0})
#   end
#   topic
# end