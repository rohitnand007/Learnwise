module ControllerHelpers
  # After user is signed in
  def update_cart_items
    if current_user.present?
      # update spree order for the user
      present_order = Spree::Order.where(guest_token: session[:order_token_id]).last
      if present_order.present?
        present_order.update_attributes(user_id: current_user.id, email: current_user.email)
        # remove line items already purchased by user
        purchased_product_guids = current_user.user_products.pluck(:product_id)
        purchased_variant_ids = Spree::Product.where(product_guid: purchased_product_guids).map(&:variant_ids).flatten
        present_order.line_items.where(variant_id: purchased_variant_ids).destroy_all
      end
    end
  end

  def skip_csrf_ckeck
    (request.headers['token']=='fpix2018')&&(request.format.json?)
  end

  def cart_items
    current_user.present? ? current_user.cart_items : CartItem.session_items(session.id)
  end

  def get_data_from_server(url)
    # to get data from a remote server
    uri = URI.parse(url)
    req = Net::HTTP::Get.new(uri.to_s)
    res = Net::HTTP.start(uri.host, uri.port, use_ssl: false){|http| http.request(req)}
    res.body
  end

  def create_user_profile
    if current_user.present?
      Profile.create(user_id:current_user.id) unless current_user.profile.present?
    end
  end
end