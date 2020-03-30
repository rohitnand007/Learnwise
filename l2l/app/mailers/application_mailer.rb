class ApplicationMailer < ActionMailer::Base
  default from: 'from@example.com'
  # layout 'mailer'

  def pdf_attachment_method(note_id)
    user_note = UserNote.find(note_id)
    attachments["user_note_#{user_note.id}.pdf"] = WickedPdf.new.pdf_from_string(
        user_note.image.to_s
    )
    mail(to: "rohit.nand1007@gmail.com", subject: 'Your note PDF is attached')
    puts "mail_delieevred"
  end
end
