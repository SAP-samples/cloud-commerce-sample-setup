ACC.minicart = {
	
	_autoload: [
		"bindMiniCart"
	],

	bindMiniCart: function(){

		$(document).on("click",".js-mini-cart-link", function(e){
			e.preventDefault();
			var url = $(this).data("miniCartUrl");
			var cartName = ($(this).find(".js-mini-cart-count").html() != 0) ? $(this).data("miniCartName"):$(this).data("miniCartEmptyName");

			ACC.colorbox.open(ACC.common.encodeHtml(cartName),{
				href: url,
				maxWidth:"100%",
				width:"380px",
				initialWidth :"380px"
			});
		});

		$(document).on("click",".js-mini-cart-close-button", function(e){
			e.preventDefault();
			ACC.colorbox.close();
		});
	},

	updateMiniCartDisplay: function(){
		var cartItems = $(".js-mini-cart-link").data("miniCartItemsText");
		var miniCartRefreshUrl = $(".js-mini-cart-link").data("miniCartRefreshUrl");
		$.ajax({
			url: miniCartRefreshUrl,
			cache: false,
			type: 'GET',
			dataType: 'json',
			success: function(jsonData){
				var $cartItems = $("<span>").addClass("items-desktop hidden-xs hidden-sm").text(" " + cartItems);
				var $numberItem = $("<span>").addClass("nav-items-total").text(jsonData.miniCartCount).append($cartItems);
				$(".js-mini-cart-link .js-mini-cart-count").empty();
				$(".js-mini-cart-link .js-mini-cart-count").append($numberItem);
				$(".js-mini-cart-link .js-mini-cart-price").text(jsonData.miniCartPrice);	
			}
		});
	}

};
