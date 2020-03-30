class CreateProfiles < ActiveRecord::Migration[5.0]
  def change
    create_table :profiles do |t|
      t.references :user, foreign_key: true
      t.string :firstname
      t.string :middlename
      t.string :surname
      t.string :dob
      t.text :address
      t.string :gender
      t.string :alternateemail
      t.integer :mobile
      t.binary :preferences

      t.timestamps
    end
  end
end
