class CreateLearningPaths < ActiveRecord::Migration[5.0]
  def change
    create_table :learning_paths do |t|
      t.integer :user_id
      t.string :content_id
      t.string :topic_id
      t.boolean :attempted, default: false

      t.timestamps
    end
    add_index :learning_paths, [:user_id, :content_id, :topic_id], unique: true
  end
end
