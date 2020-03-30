module ApplicationHelper
  def header(text)
    content_for(:header) { text.to_s }
  end
  def number_to_currency(number, options = {})
    options[:locale] ||= I18n.locale
    super(number, options)
  end
end
