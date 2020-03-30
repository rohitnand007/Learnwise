namespace :products do
  desc "populating proper products"
  task populate: :environment do
  x = {"toc"=>{"ge"=>{"ge"=>{"ge"=>{"ce"=>[{"flow_rule"=>"\n\t\t\t\t\t\t\tusage = 500\n\t\t\t\t\t\t", "_icon"=>"icon/video.png", "_display_name"=>"Video", "_id"=>"CONTENT_ID", "_CEW"=>"10", "_RE"=>"5", "_type"=>"VIDEO", "_min_eff_time"=>"300", "_max_eff_time"=>"600", "_url"=>"/videos/Z121327.mp4"}, {"flow_rule"=>"\n\t\t\t\t\t\t\tmpm=70%\n\t\t\t\t\t\t", "_icon"=>"icon/activity_bio.png", "_display_name"=>"Activity", "_id"=>"CONTENT_ID", "_CEW"=>"4", "_RE"=>"8", "_type"=>"ACTIVITY", "_total_assessment_points"=>"5", "_minimum_assessment_points"=>"3", "_url"=>"/activities/ac1.html"}, {"flow_rule"=>"\n\t\t\t\t\t\tmpm = 50%\n\t\t\t\t\t\t", "_id"=>"CONTENT_ID", "_CEW"=>"10"}, {"flow_rule"=>"\n\t\t\t\t\t\t", "_id"=>"CONTENT_ID", "_CEW"=>"10"}, {"flow_rule"=>"\n\t\t\t\t\t\t", "_id"=>"CONTENT_ID", "_CEW"=>"10"}, {"template"=>{"qoq"=>[{"_level"=>"1", "_noq"=>"2"}, {"_level"=>"3", "_noq"=>"2"}, {"_level"=>"2", "_noq"=>"2"}, {"_level"=>"4", "_noq"=>"1"}], "_noq"=>"7"}, "_id"=>"CONTENT_ID", "_CEW"=>"6", "_type"=>"TEST_MCQ", "_min_score"=>"3", "_max_score"=>"10"}], "_display_name"=>"Cells, tissues, organs and organ systems", "_tags"=>""}, "_display_name"=>"Tissues", "_icon"=>""}, "_display_name"=>"The Fundamental Unit of Life: Cell", "_icon"=>"/icon/tfu.png"}, "_version"=>"1", "_lang"=>"en", "_icon"=>"/icon/bio.png", "_display_name"=>"Biology", "_learning_engine"=>"disabled"}}
  price = 10
  grade_array = ["9","10"]
  subjects_array = ["Biology", "Physics", "Chemistry"]
  subjects_array.each do |subject|
    grade_array.each do |grade|
      Product.create!(
          name: subject + " Book",
          default_price: price,
          subject: subject,
          grade: grade,
          data: x
      )
      price = price + 5
    end
  end
  end

  task populate_toc_for_products: :environment do
    Product.all.each do |product|
     url = Rails.root.to_s + "/updated_toc/" + product.subject.downcase + "_#{product.grade}.json"
     if File.exist?(url)
       json_load = JSON.load File.new(url)
       product.update_attribute("data",json_load)
       puts product.id
     end
     end
  end

  task all_delete: :environment do
    Product.destroy_all
    CartItem.destroy_all
    Order.destroy_all
    UserProduct.destroy_all
  end
end