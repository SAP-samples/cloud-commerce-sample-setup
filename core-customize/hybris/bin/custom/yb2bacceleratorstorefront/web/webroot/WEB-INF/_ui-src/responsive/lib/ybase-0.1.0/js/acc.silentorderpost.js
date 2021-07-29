ACC.silentorderpost = {

	spinner: $("<img>").attr("src", ACC.config.commonResourcePath + "/images/spinner.gif"),

	bindUseDeliveryAddress: function ()
	{
		$('#useDeliveryAddress').on('change', function ()
		{
			if ($('#useDeliveryAddress').is(":checked"))
			{
				var options = {'countryIsoCode': $('#useDeliveryAddressData').data('countryisocode'), 'useDeliveryAddress': true};
				ACC.silentorderpost.enableAddressForm();
				ACC.silentorderpost.displayCreditCardAddressForm(options, ACC.silentorderpost.useDeliveryAddressSelected);
				ACC.silentorderpost.disableAddressForm();
			}
			else
			{
				ACC.silentorderpost.clearAddressForm();
				ACC.silentorderpost.enableAddressForm();
			}
		});

		if ($('#useDeliveryAddress').is(":checked"))
		{
			var options = {'countryIsoCode': $('#useDeliveryAddressData').data('countryisocode'), 'useDeliveryAddress': true};
			ACC.silentorderpost.enableAddressForm();
			ACC.silentorderpost.displayCreditCardAddressForm(options, ACC.silentorderpost.useDeliveryAddressSelected);
			ACC.silentorderpost.disableAddressForm();
		}
	},

	bindSubmitSilentOrderPostForm: function ()
	{
		$('.submit_silentOrderPostForm').click(function ()
		{
			ACC.common.blockFormAndShowProcessingMessage($(this));
			$('.billingAddressForm').filter(":hidden").remove();
			ACC.silentorderpost.enableAddressForm();
			$('#silentOrderPostForm').submit();
		});
	},

	bindCycleFocusEvent: function ()
	{
		$('#lastInTheForm').blur(function ()
		{
			$('#silentOrderPostForm [tabindex$="10"]').focus();
		})
	},

	isEmpty: function (obj)
	{
		if (typeof obj == 'undefined' || obj === null || obj === '') return true;
		return false;
	},

	disableAddressForm: function ()
	{
		$('input[id^="address\\."]').prop('disabled', true);
		$('select[id^="address\\."]').prop('disabled', true);
	},

	enableAddressForm: function ()
	{
		$('input[id^="address\\."]').prop('disabled', false);
		$('select[id^="address\\."]').prop('disabled', false);
	},

	clearAddressForm: function ()
	{
		$('input[id^="address\\."]').val("");
		$('select[id^="address\\."]').val("");
	},

	useDeliveryAddressSelected: function ()
	{
		if ($('#useDeliveryAddress').is(":checked"))
		{
			var countryIsoCode = $('#address\\.country').val($('#useDeliveryAddressData').data('countryisocode')).val();
			if(ACC.silentorderpost.isEmpty(countryIsoCode))
			{
				$('#useDeliveryAddress').click();
				$('#useDeliveryAddress').parent().hide();
			}
			else
			{
				ACC.silentorderpost.disableAddressForm();
			}
		}
		else
		{
			ACC.silentorderpost.clearAddressForm();
			ACC.silentorderpost.enableAddressForm();
		}
	},
	
	

	bindCreditCardAddressForm: function ()
	{
		$('#billingCountrySelector :input').on("change", function ()
		{
			var countrySelection = $(this).val();
			var options = {
				'countryIsoCode': countrySelection,
				'useDeliveryAddress': false
			};
			ACC.silentorderpost.displayCreditCardAddressForm(options);
		})
	},

	displayCreditCardAddressForm: function (options, callback)
	{
		$.ajax({ 
			url: ACC.config.encodedContextPath + '/checkout/multi/sop/billingaddressform',
			async: true,
			data: options,
			dataType: "html",
			beforeSend: function ()
			{
				$('#billingAddressForm').html(ACC.silentorderpost.spinner);
			}
		}).done(function (data)
				{
					$("#billingAddressForm").html(data);
					if (typeof callback == 'function')
					{
						callback.call();
					}
				});
	}
}

$(document).ready(function ()
{
	ACC.silentorderpost.bindUseDeliveryAddress();
	ACC.silentorderpost.bindSubmitSilentOrderPostForm();
	ACC.silentorderpost.bindCreditCardAddressForm();

	// check the checkbox
	$("#useDeliveryAddress").click();
});
