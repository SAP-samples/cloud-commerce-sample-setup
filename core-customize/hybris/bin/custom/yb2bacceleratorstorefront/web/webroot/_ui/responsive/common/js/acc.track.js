ACC.track = {
	trackAddToCart: function (productCode, quantity, cartData)
	{
		window.mediator.publish('trackAddToCart',{
			productCode: productCode,
			quantity: quantity,
			cartData: cartData
		});
	},
	trackRemoveFromCart: function(productCode, initialCartQuantity)
	{
		window.mediator.publish('trackRemoveFromCart',{
			productCode: productCode,
			initialCartQuantity: initialCartQuantity
		});
	},

	trackUpdateCart: function(productCode, initialCartQuantity, newCartQuantity)
	{
		window.mediator.publish('trackUpdateCart',{
			productCode: productCode,
			initialCartQuantity: initialCartQuantity,
			newCartQuantity: newCartQuantity
		});
	},

    trackShowReviewClick: function(productCode)
    {
        window.mediator.publish('trackShowReviewClick',{});
    }

};