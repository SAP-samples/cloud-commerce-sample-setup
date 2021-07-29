ACC.quickview = {

	_autoload: [
		"bindToUiCarouselLink"
	],
		
	initQuickviewLightbox:function(){
		ACC.product.enableAddToCartButton();
		ACC.product.bindToAddToCartForm();
		ACC.product.enableStorePickupButton();
	},
		
	refreshScreenReaderBuffer: function ()
	{
		// changes a value in a hidden form field in order
		// to trigger a buffer update in a screen reader
		$('#accesibility_refreshScreenReaderBufferField').attr('value', new Date().getTime());
	},
	


	bindToUiCarouselLink: function ()
	{
		var titleHeaderHtml = $('#quickViewTitle').html();
		$(".js-owl-carousel-reference .js-reference-item").colorbox({
			close:'<span class="glyphicon glyphicon-remove"></span>',
			title: titleHeaderHtml,
			maxWidth:"100%",
			onComplete: function ()
			{
				ACC.quickview.refreshScreenReaderBuffer();
				ACC.quickview.initQuickviewLightbox();
				ACC.ratingstars.bindRatingStars($(".quick-view-stars"));
			},

			onClosed: function ()
			{
				ACC.quickview.refreshScreenReaderBuffer();
			}
		});
	}
	
};