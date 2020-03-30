Spree::LineItem.class_eval do
	

	def api_response_data
		{
			variant_id: variant_id,
			quantity: quantity,
			price: price.to_f,
			currency: currency,
			order_number: order.number,
			product_info: self.product.get_general_data
		}
	end
end