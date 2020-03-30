Spree::Order.class_eval do
	remove_checkout_step :address
	remove_checkout_step :delivery
	state_machine.after_transition to: :complete, do: :give_product_access_to_user
	def api_response_data
		{
			order_number: number,
			order_token: guest_token,
			state: state,
			total_amount: total.to_f,
			currency: currency,
			user_id: user_id,
			email: email,
			created_at: created_at,
			updated_at: updated_at,
			line_items: line_items.map(&:api_response_data),
			payment_state: payment_state,
			payments: payments
		}
	end

	def reset_guest_token(new_token)
		update_attribute(:guest_token, new_token)
	end

	def give_product_access_to_user
		products.each do |product|
			if product.product_type=='Book'
				UserProduct.create(user_id: user_id, product_id: product.product_guid, order_id: id)
			else
			end	
		end
	end
end