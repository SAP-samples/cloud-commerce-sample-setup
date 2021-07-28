ACC.order = {

	_autoload: [
	    "backToOrderHistory",
	    "bindMultidProduct"
	],

	backToOrderHistory: function(){
		$(".orderBackBtn > button").on("click", function(){
			var sUrl = $(this).data("backToOrders");
			window.location = sUrl;
		});
	},
	
	bindMultidProduct: function ()
	{
		// link to display the multi-d grid in read-only mode
		$(document).on("click",'.js-show-multiD-grid-in-order', function (event){
			ACC.multidgrid.populateAndShowGrid(this, event, true);
			return false;
		});

		// link to display the multi-d grid in read-only mode
		$(document).on("click",'.showMultiDGridInOrderOverlay', function (event){
			ACC.multidgrid.populateAndShowGridOverlay(this, event);
		});

	}
};