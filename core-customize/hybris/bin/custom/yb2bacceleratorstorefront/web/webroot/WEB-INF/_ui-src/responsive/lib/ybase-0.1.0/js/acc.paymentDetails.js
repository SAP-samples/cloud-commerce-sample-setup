ACC.paymentDetails = {
	_autoload: [
		"showRemovePaymentDetailsConfirmation"
	],
	
	showRemovePaymentDetailsConfirmation: function ()
	{
		$(document).on("click", ".removePaymentDetailsButton", function ()
		{
			var paymentId = $(this).data("paymentId");
			var popupTitle = $(this).data("popupTitle");

			ACC.colorbox.open(ACC.common.encodeHtml(popupTitle),{
				inline: true,
				href: "#popup_confirm_payment_removal_" + paymentId,
				onComplete: function ()
				{
					$(this).colorbox.resize();
				}
			});

		})
	}
}