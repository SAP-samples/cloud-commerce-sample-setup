ACC.futurelink = {
	
	_autoload: [
			"bindFutureStockLink"
		],

	bindFutureStockLink: function() {
		$(document).on("click",".futureStockLink", function(e) {
			e.preventDefault();
			var url = $(this).attr("href");
			var title = $(this).attr("title");

			ACC.colorbox.open(ACC.common.encodeHtml(title),{
				href: url,
				maxWidth:"100%",
				width:"320px",
				height:"320px",
				initialWidth :"320px"
			});
		})
	}
};