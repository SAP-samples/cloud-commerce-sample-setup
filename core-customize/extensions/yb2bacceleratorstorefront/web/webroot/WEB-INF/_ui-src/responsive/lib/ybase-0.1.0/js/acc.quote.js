ACC.quote = {
	_autoload : [
		[ "bindAddComment", $("#js-quote-comments").length !== 0 ],
		[ "bindAddEntryComment", $(".js-quote-entry-comments").length !== 0],
		[ "toggleMoreComments", $("#js-quote-comments").length !== 0 ],
		[ "toggleLessComments", $("#js-quote-comments").length !== 0 ],
		[ "displayLessComments", $("#js-quote-comments").length !== 0 ],
		[ "quoteDetailsNavigation", $(".js-quote-actions").length !== 0],
		[ "bindQuoteButtons", $(".js-btn-quote").length !== 0 ],
		[ "bindEditQuoteButton", $(".js-quote-edit-btn").length !== 0 ],
		[ "bindSubmitConfirmation", $(".js-quote-submit-btn").length !== 0],
		[ "bindCancelConfirmation", $(".js-quote-cancel-btn").length !== 0],
		[ "bindName" , $("#js-quote-name").length !== 0],
		[ "bindDescription" , $("#js-quote-description").length !== 0],
		[ "bindExpirationTime", $("#js-quote-expiration-time").length !== 0],
		[ "bindCheckoutConfirmation", $(".js-quote-checkout-btn").length !== 0],
		[ "bindEditConfirmation", $(".js-quote-warning-btn").length !== 0],
		[ "bindQuoteDiscount", $(".js-quote-discount-link").length !== 0],
		[ "bindNewCartClick", $(".new__cart--link").length !== 0]
	],

	bindEditQuoteButton: function(){
		$(".js-quote-edit-btn").on("click", function(){
			var sUrl = $(this).data("quoteEditUrl");
			window.location = sUrl;
		});
	},
	bindNewCartClick: function(){
		$(".new__cart--link").bind("click", function(event){
			$(this).unbind(event);
		});
	},
	bindAddComment : function() {
		$(document).on(
			"keypress",
			'#js-quote-comments #comment',
			function(event) {
				var key = event.keyCode;

				// If the user has pressed enter
				if (key === 13) {
					if($('#comment').val().trim() === '') {
						return false;
					}
					event.preventDefault();
					ACC.quote.quoteCommentSubmit($('#comment').val());
					$('#comment').val("");
					return false;
				} else {
					return true;
				}
			});
	},

	bindAddEntryComment: function () {
		$(document).on(
			"keypress",
			".js-quote-entry-comments",
			function (event) {
				var key = event.keyCode;

				if (key === 13) {
					event.preventDefault();
					ACC.quote.quoteEntryCommentSubmit($(this).val(), $(this).data("entry-number"));
					return false;
				} else {
					return true;
				}
			}
		);
	},

	bindQuoteButtons : function() {
		$('.js-save-quote-btn').click(function() {
			var url = $(this).data("saveQuoteUrl");
			$('#quoteForm').attr('action', url).submit();
		});
		$('.js-submit-quote-btn').click(function() {
			var url = $(this).data("submitQuoteUrl");
			$('#quoteForm').attr('action', url).submit();
		});
		$('.js-accept-quote-btn').click(function() {
			var url = $(this).data("acceptQuoteUrl");
			$('#quoteForm').attr('action', url).submit();
		});
	},

	quoteCommentSubmit : function(comment) {
		var quoteComments = $("#js-quote-comments");
		var addCommentUrl = quoteComments.data("quote-base-link") + "comment";
		var showAllComments = quoteComments.data("show-all-comments");

		$.ajax({
			url : addCommentUrl,
			data : {
				comment : comment
			},
			type : "post",
			success : function(response) {
				ACC.quote.onCommentSuccess(showAllComments);
			}
		});
	},

	quoteEntryCommentSubmit: function (comment, entryNumber) {
		if (!comment || !comment.length) {
			return;
		}

		var quoteComments = $("#js-quote-comments");
		var addEntryCommentUrl = quoteComments.data("quote-base-link") + "entry/comment";

		$.ajax({
			url: addEntryCommentUrl,
			data: {
				comment: comment,
				entryNumber: entryNumber
			},
			type: "post",
			success: function () {
				ACC.quote.onEntryCommentSuccess(entryNumber);
			}
		});
	},

	onCommentSuccess : function(showAllComments) {
		$("#commentListDiv").load(location.href + " #commentListDiv", function() {
			ACC.quote.displayComments("" + showAllComments);
		});
	},

	onEntryCommentSuccess: function (entryNumber) {
        var entryNumberHtml = ACC.common.encodeHtml(entryNumber);
		$("#entryCommentListDiv_" + entryNumberHtml).load(location.href + " #entryCommentListDiv_" + entryNumberHtml, function () {
			ACC.quote.displayEntryComments(entryNumberHtml);
		});

		$("#entryComment_" + entryNumberHtml).val("");
	},

	toggleMoreComments : function() {
		$(document).on('click', '#moreCommentsAnchor', ACC.quote.displayMoreComments);
		$(document).on('click', '.js-more-entry-comments-anchor', ACC.quote.displayMoreEntryComments);
	},

	toggleLessComments : function() {
		$(document).on('click', '#lessCommentsAnchor', ACC.quote.displayLessComments);
		$(document).on('click', '.js-less-entry-comments-anchor', ACC.quote.displayLessEntryComments);
	},

	displayMoreComments : function(e) {
		e.preventDefault();
		ACC.quote.displayComments("true");
	},

	displayMoreEntryComments: function (e) {
		e.preventDefault();
		ACC.quote.displayEntryComments($(this).data("entry-number"), "true");
	},

	displayLessComments : function(e) {
		if (e !== undefined) {
			e.preventDefault();
		}
		ACC.quote.displayComments("false");
	},

	displayLessEntryComments: function (e) {
		e.preventDefault();
		ACC.quote.displayEntryComments($(this).data("entry-number"), "false");
	},

	displayComments : function(showAll) {
		var quoteComments = $("#js-quote-comments");
		var currentCommentsShown = quoteComments.data("current-comments-shown");
		var comments = $('[id^="comment_"]');

		// iterate over comments. If showAll, just show, otherwise check if max comments is reached then hide
		for (var i = 0; i < comments.length; i++) {
			if (showAll === "true") {
				$(comments[i]).show();
			} else {
				if (i < currentCommentsShown) {
					$(comments[i]).show();
				} else {
					$(comments[i]).hide();
				}
			}
		}

		// toggle anchors
		if (showAll === "false") {
			$('#moreCommentsAnchor').show();
			$('#lessCommentsAnchor').hide();
			quoteComments.data("show-all-comments", false);
		} else {
			$('#moreCommentsAnchor').hide();
			$('#lessCommentsAnchor').show();
			quoteComments.data("show-all-comments", true);
		}

		return false;
	},

	displayEntryComments: function (entryNumber, showAll) {
		var entryNumberHtml = ACC.common.encodeHtml(entryNumber);
		var quoteEntryComments = $("#entryCommentListDiv_" + entryNumberHtml);
		var comments = quoteEntryComments.find('[id^="entryComment_' + entryNumberHtml + '"]');

		showAll = showAll || "" + quoteEntryComments.data("show-all-entry-comments");

		// iterate over comments. If showAll, just show, otherwise check if max comments is reached then hide
		for (var i = 0; i < comments.length; i++) {
			if (showAll === "true") {
				$(comments[i]).show();
			} else {
				if (i < 4) {
					$(comments[i]).show();
				} else {
					$(comments[i]).hide();
				}
			}
		}

		// toggle anchors
		if (showAll === "false") {
			quoteEntryComments.find(".js-more-entry-comments-anchor").show();
			quoteEntryComments.find(".js-less-entry-comments-anchor").hide();
			quoteEntryComments.data("show-all-entry-comments", false);
		} else {
			quoteEntryComments.find(".js-more-entry-comments-anchor").hide();
			quoteEntryComments.find(".js-less-entry-comments-anchor").show();
			quoteEntryComments.data("show-all-entry-comments", true);
		}

		return false;
	},

	quoteDetailsNavigation: function(){
		$('.js-quote-actions').on('click', function(e){
			$(this).parent().find('nav').toggleClass('display-none');
		});
	},

	bindSubmitConfirmation : function(e) {
		ACC.quote.handleConfirmationModal({
			actionButtonSelector:".js-quote-submit-btn",
			modalWindowSelector:"#js-quote-submit-modal",
			modalTitleDataAttributeName:"submit-confirmation-modal-title",
			cancelButtonSelector:"#js-quote-submit-modal #submitNoButton"
		});

		$("#quoteSubmitForm").submit(function(event) {
			var quoteForm = $("#quoteForm");

			if (quoteForm.is("form")) {
				event.preventDefault();

				var submitUrl = $(this).prop("action");

				quoteForm.prop("action", submitUrl);
				quoteForm.submit();
			}
		});
	},

	bindCheckoutConfirmation : function(e) {
		ACC.quote.handleConfirmationModal({
			actionButtonSelector:".js-quote-checkout-btn",
			modalWindowSelector:"#js-quote-checkout-modal",
			modalTitleDataAttributeName:"submit-confirmation-modal-title",
			cancelButtonSelector:"#js-quote-checkout-modal #submitNoButton"
		});
	},

	bindCancelConfirmation: function(e) {
		ACC.quote.handleConfirmationModal({
			actionButtonSelector: ".js-quote-cancel-btn",
			modalWindowSelector: "#js-quote-cancel-modal",
			modalTitleDataAttributeName: "cancel-confirmation-modal-title",
			cancelButtonSelector: "#js-quote-cancel-modal #cancelNoButton"
		});
	},

	bindEditConfirmation: function(e) {
		ACC.quote.handleConfirmationModal({
			actionButtonSelector: ".js-quote-warning-btn",
			modalWindowSelector: "#js-quote-edit-modal",
			modalTitleDataAttributeName:"edit-confirmation-modal-title",
			cancelButtonSelector: "#js-quote-edit-modal #cancelEditNoButton",
			confirmButtonSelector: "#js-quote-edit-modal #cancelEditYesButton"
		});
	},

	handleConfirmationModal: function(options) {
        var $actionButtonSelector = $(document).find(options.actionButtonSelector);
        $actionButtonSelector.click(function(e) {
			e.preventDefault();

            var modalWindow = $(document).find(options.modalWindowSelector);
			var title = modalWindow.data(options.modalTitleDataAttributeName);

			if (options.initializeCallback) {
				options.initializeCallback();
			}

			ACC.colorbox.open(ACC.common.encodeHtml(title), {
				inline: true,
				href: modalWindow,
				width: "480px",
				escKey: false,
				overlayClose: false,
				onComplete: function(){
					ACC.colorbox.resize();
				}
			});
		});

        var $cancelButtonSelector = $(document).find(options.cancelButtonSelector);
		$cancelButtonSelector.click(function(e) {
			e.preventDefault();
			ACC.colorbox.close();
		});

        var $confirmButtonSelector = $(document).find(options.confirmButtonSelector);
        $confirmButtonSelector.click(function(e) {
			e.preventDefault();
			ACC.colorbox.close();
			var sUrl = $actionButtonSelector.data("quoteEditUrl");
			window.location = sUrl;
		});
	},

	bindQuoteDiscount: function(e) {
		ACC.quote.handleDiscountModal({
			actionButtonSelector: ".js-quote-discount-link",
			modalWindowSelector: "#js-quote-discount-modal",
			modalTitleDataAttributeName: "quote-modal-title",
			modalTotalDataAttributeName: "quote-modal-total",
			modalQuoteDiscountDataAttributeName: "quote-modal-quote-discount",
			modalCurrencyDataAttributeName: "quote-modal-currency",
			cancelButtonSelector: "#js-quote-discount-modal #cancelButton"
		});
	},

	handleDiscountModal: function(options) {
        var modalWindow = $(document).find(options.modalWindowSelector);
		var total = parseFloat(modalWindow.data(options.modalTotalDataAttributeName));
		var quoteDiscount = parseFloat(modalWindow.data(options.modalQuoteDiscountDataAttributeName));
		var currency = modalWindow.data(options.modalCurrencyDataAttributeName);

        $(document).find(options.actionButtonSelector).click(function(e) {
			e.preventDefault();

			var title = modalWindow.data(options.modalTitleDataAttributeName);

			if (options.initializeCallback) {
				options.initializeCallback();
			}

			ACC.colorbox.open(ACC.common.encodeHtml(title), {
				inline: true,
				href: modalWindow,
				width: "480px",
				onComplete: function(){
					ACC.colorbox.resize();
					var percent = (quoteDiscount / total) * 100;
					var adjustTotal = (total - quoteDiscount).toFixed(2);
					$("#js-quote-discount-by-percentage").val(percent.toFixed(2));
					$("#js-quote-discount-by-amount").val(quoteDiscount.toFixed(2));
					$("#js-quote-discount-adjust-total").val(adjustTotal);
				}
			});
		});

        $(document).find(options.cancelButtonSelector).click(function(e) {
			e.preventDefault();
			ACC.colorbox.close();
		});

		function enableSubmit(){
			$("#js-quote-discount-by-percentage").css('border-color', '#cccccc');
			$("#js-quote-discount-by-amount").css('border-color', '#cccccc');
			$("#js-quote-discount-adjust-total").css('border-color', '#cccccc');
			$("#submitButton").prop("disabled", false);
		}
         function resetIntial(val)
         {
        		if(isNaN(parseFloat(val))){
        			val = 0.00;
        			val=val.toFixed(2);
    			}	
        		return val;
         }
		function updateByPercentage()
		{
			var percent = parseFloat($("#js-quote-discount-by-percentage").val());
			// input validation
			if(percent > 100 || percent < 0){
				$("#js-quote-discount-by-percentage").css('border-color', 'red');
				$("#submitButton").prop("disabled", true);
			}else{
				enableSubmit();
			}
			var discountAmount = total * percent / 100;
			var discountAmount = discountAmount.toFixed(2);
			$("#js-quote-discount-by-amount").val(resetIntial(discountAmount));
			var remainTotal = total - discountAmount;
			var remainTotal = remainTotal.toFixed(2);
			$("#js-quote-discount-adjust-total").val(resetIntial(remainTotal));
			$("#js-quote-discount-rate").val(resetIntial(percent));
			$("#js-quote-discount-type").val("PERCENT");

			updateNewTotal(remainTotal);
		}

		$('#js-quote-discount-by-percentage').keyup(updateByPercentage);
		$('#js-quote-discount-by-percentage').change(updateByPercentage);
		$('#js-quote-discount-by-percentage').blur(reset);
		$('#js-quote-discount-by-percentage').keypress(holdPreviousValue);
		
		function reset()
		{
	        var per = $('#js-quote-discount-by-percentage').val();
	        var amt = $('#js-quote-discount-by-amount').val();
	        var tot = $('#js-quote-discount-adjust-total').val();
	        if(per === '')
	        	$('#js-quote-discount-by-percentage').val('0.00');
	        if(amt === '')
	        	$('#js-quote-discount-by-amount').val('0.00');
	        if(tot === '' || tot === 0.00)
	        	$('#js-quote-discount-adjust-total').val(total);
		}
		
		function holdPreviousValue(event)
		{
		    var $this = $(this);
		    if((event.which !== 46 || $this.val().indexOf('.') !== -1))
		    {
		    	if (((event.which < 48 || event.which > 57) &&
		    		 (event.which !== 0 && event.which !== 8))) {
		    		event.preventDefault();
		    	}
		    }

		    var text = $(this).val();
		    if ((event.which === 46) && (text.indexOf('.') === -1)) {
		        setTimeout(function() {
		            if ($this.val().substring($this.val().indexOf('.')).length > 3) {
		                $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
		            }
		         }, 1);
		    }

		    if((text.indexOf('.') !== -1))
		    {
		    	if ((text.substring(text.indexOf('.')).length > 2) &&
				        (event.which !== 0 && event.which !== 8) &&
				        ($(this)[0].selectionStart >= text.length - 2)) {
				            event.preventDefault();
				    }
		    }
		}	    

		function updateByAmount()
		{
			var discountAmount = parseFloat($("#js-quote-discount-by-amount").val());

			// input validation
			if(discountAmount > total || discountAmount < 0){
				$("#js-quote-discount-by-amount").css('border-color', 'red');
				$("#submitButton").prop("disabled", true);
			}else{
				enableSubmit();
			}

			var percent = (discountAmount / total) * 100;
			var percent = percent.toFixed(2);
			$("#js-quote-discount-by-percentage").val(resetIntial(percent));
			var remainTotal = total - discountAmount;
			var remainTotal = remainTotal.toFixed(2);
			$("#js-quote-discount-adjust-total").val(resetIntial(remainTotal));
			$("#js-quote-discount-rate").val(resetIntial(discountAmount));
			$("#js-quote-discount-type").val("ABSOLUTE");

			updateNewTotal(remainTotal);
		}
		
		$('#js-quote-discount-by-amount').keyup(updateByAmount);
		$('#js-quote-discount-by-amount').change(updateByAmount);
		$('#js-quote-discount-by-amount').keypress(holdPreviousValue);
		$('#js-quote-discount-by-amount').blur(reset);

		function updateByAdjustTotal()
		{
			var adujstTotal = parseFloat($("#js-quote-discount-adjust-total").val());

			// input validation
			if(adujstTotal > total || adujstTotal < 0){
				$("#js-quote-discount-adjust-total").css('border-color', 'red');
				$("#submitButton").prop("disabled", true);
			}else{
				enableSubmit();
			}

			var discountAmount = total - adujstTotal;
			var discountAmount = discountAmount.toFixed(2);
			$("#js-quote-discount-by-amount").val(resetIntial(discountAmount));
			var percent = (discountAmount / total) * 100;
			var percent = percent.toFixed(2);
			$("#js-quote-discount-by-percentage").val(resetIntial(percent));
			$("#js-quote-discount-rate").val(resetIntial(adujstTotal));
			$("#js-quote-discount-type").val("TARGET");

			updateNewTotal(adujstTotal);
		}
		
		$('#js-quote-discount-adjust-total').keyup(updateByAdjustTotal);
		$('#js-quote-discount-adjust-total').change(updateByAdjustTotal);
		$('#js-quote-discount-adjust-total').keypress(holdPreviousValue);
		$('#js-quote-discount-adjust-total').blur(reset);
		
		function updateNewTotal(newTotal){
			if(isNaN(parseFloat(newTotal))){
				newTotal = total;
			}
			var newTotal = parseFloat(newTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); // format num to money
			$("#js-quote-discount-new-total").text(currency.concat(newTotal));
		}
	},

	bindName: function () {
		$("#js-quote-name").on("focusout", function () {
			ACC.quote.updateMetadata();
		});
	},

	bindDescription: function () {
		$("#js-quote-description").on("focusout", function () {
			ACC.quote.updateMetadata();
		});
	},

	updateMetadata: function () {
		var quoteForm = $("#quoteFormDiv");
		var updateMetadataUrl = quoteForm.data("metadata-url");
		var name = $("#js-quote-name").val().trim();
		var description = $("#js-quote-description").val();
		var nameWrapperElement = $("#js-quote-name-wrapper")

		if (name && name.length) {
			nameWrapperElement.removeClass("has-error");

			$.ajax({
				url: updateMetadataUrl,
				data: {
					name: name,
					description: description
				},
				type: "POST",
				success: function() {
					$(".js-modal-quote-description").text(description);
					$(".js-modal-quote-name").text(name);
				}
			});
		} else {
			if (!nameWrapperElement.hasClass("has-error")) {
				nameWrapperElement.addClass("has-error");
			}
		}
	},

	bindExpirationTime: function(e) {
		var expirationTimeWrapperElement = $("#js-quote-expiration-time");
		var dateFormatForDatePicker = expirationTimeWrapperElement.data("date-format-for-date-picker");
		var minOfferValidityPeriodDays = expirationTimeWrapperElement.data("min-offer-validity-period-days");

		var minDate = new Date();
		minDate.setDate(minDate.getDate() + minOfferValidityPeriodDays);

		$("#expirationTime").datepicker({
			dateFormat: dateFormatForDatePicker,
			constrainInput: true,
			minDate: minDate,
			onSelect: function() {
				ACC.quote.handleExpirationTimeUpdate(expirationTimeWrapperElement, dateFormatForDatePicker,
					minOfferValidityPeriodDays);
			}
		});

		$("#expirationTime").change(function() {
			ACC.quote.handleExpirationTimeUpdate(expirationTimeWrapperElement, dateFormatForDatePicker,
				minOfferValidityPeriodDays);
		});

		$(document).on("click", ".js-open-datepicker-quote-expiration-time", function() {
			$("#expirationTime").datepicker('show');
		});
	},

	handleExpirationTimeUpdate: function(expirationTimeWrapperElement, dateFormat, minOfferValidityPeriodDays) {
		var expirationTimeElement = $("#expirationTime");
		var expirationTime = expirationTimeElement.val();

		if (ACC.quote.validateExpirationTime(dateFormat, expirationTime, minOfferValidityPeriodDays)) {
			ACC.quote.updateExpirationTime(expirationTime.trim());
			expirationTimeWrapperElement.removeClass("has-error");
		} else {
			if (!expirationTimeWrapperElement.hasClass("has-error")) {
				expirationTimeWrapperElement.addClass("has-error");
			}
		}
	},

	validateExpirationTime: function(dateFormat, value, minOfferValidityPeriodDays) {
		try {
			if (value) {
				var selectedDate = $.datepicker.parseDate(dateFormat, value);

				var validDate = new Date();
				validDate.setHours(0,0,0,0);
				validDate.setDate(validDate.getDate() + minOfferValidityPeriodDays);

				if (selectedDate >= validDate) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		} catch (error) {
			return false;
		}
	},

	updateExpirationTime: function(expirationTime) {
		var url = $("#js-quote-expiration-time").data("expiration-time-url");
		$.ajax({
			url: url,
			type: 'POST',
			data: {expirationTime: expirationTime},
			error: function (jqXHR) {
				var expirationTimeWrapperElement = $("#js-quote-expiration-time");
				if (!expirationTimeWrapperElement.hasClass("has-error")) {
					expirationTimeWrapperElement.addClass("has-error");
				}
			}
		});
	}
};


$(document).ready(function () {

//toggles the whole quote block
    $('.js-quote-toggle-btn').click(function () {
        $(this).toggleClass('open');
        $("#quote__form--collapse").slideToggle(400);
        if ($(this).hasClass('open')) {
            $(this).addClass('collapsed');
        } else {
            $(this).removeClass('collapsed');
        }
    });

//toggles only the comments
    $('.js-quote-comments-btn').click(function () {
        $(this).toggleClass('open');
        $("#comments__collapse").slideToggle(400);
        if ($(this).hasClass('open')) {
            $(this).addClass('collapsed');
        } else {
            $(this).removeClass('collapsed');
        }

    });

});
