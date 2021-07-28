ACC.checkoutsteps = {

	_autoload: [
		"permeateLinks"
	],
			
	permeateLinks: function() {
	
		$(document).on("click",".js-checkout-step",function(e){
			e.preventDefault();
			window.location=$(this).closest("a").attr("href")
		})		
	}


};