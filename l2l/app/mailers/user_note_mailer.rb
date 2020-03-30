class UserNoteMailer < ApplicationMailer

  def send_user_note_pdf(note_id, to_mail_id, from_mail_id, mail_subject)
    @from_mail_id = from_mail_id
    user_note = UserNote.find(note_id)
    attachments["Note_#{user_note.id}.pdf"] = WickedPdf.new.pdf_from_string(
        user_note.text.try(:data)
    )
    mail(to: to_mail_id, subject: mail_subject )
  end

end
