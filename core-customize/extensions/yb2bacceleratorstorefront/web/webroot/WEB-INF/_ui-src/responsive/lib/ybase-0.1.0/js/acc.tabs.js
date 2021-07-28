ACC.tabs = {

	_autoload: [
		["bindTabs", $(".js-tabs").length > 0],
		"hideReviewBtn",
		"determineToDisplayReviews"
	],

	bindTabs: function(){

		$e = $(".js-tabs");
		 var tabs = $e.accessibleTabs({
			tabhead:'.tabhead',
			tabbody: '.tabbody', 
			fx:'show', 
			fxspeed: 0,
			currentClass: 'active', 
			autoAnchor:true
		});

		$e.on("click",".tabhead",function(e){
			e.preventDefault();

			if($(this).hasClass("active")){
				$(this).removeClass("active");
			}else{
				$(this).parents(".js-tabs").children(".tabs-list").find("a[href='"+"#"+$(this).attr("id")+"']").click();

				var offset = $(this).offset().top;
				$("body,html").scrollTop(offset);
			}
			
		});
		
		$e.on("click","#tabreview",function(e){
			e.preventDefault();
            ACC.track.trackShowReviewClick();
			ACC.tabs.showReviewsAction("reviews");
		});
		
		$e.on("click",".all-reviews-btn",function(e){
			e.preventDefault();
			ACC.tabs.showReviewsAction("allreviews");
			ACC.tabs.hideReviewBtn(".all-reviews-btn");
			ACC.tabs.showReviewBtn(".less-reviews-btn");
		});
		
		$e.on("click",".less-reviews-btn",function(e){
			e.preventDefault();
			ACC.tabs.showReviewsAction("reviews");
			ACC.tabs.hideReviewBtn(".less-reviews-btn");
			ACC.tabs.showReviewBtn(".all-reviews-btn");
		});
		
		$(document).on("click", '.js-writeReviewTab', function(e){
			e.preventDefault();
			tabs.showAccessibleTabSelector($(this).attr("href"));
			$(".js-review-write").show();
			$('#reviewForm input[name=headline]').focus();
		});
		
		$(document).on("click",".js-review-write-toggle",function(e){
			e.preventDefault();
			if($(".js-review-write:visible").length<1){
				$(".js-review-write").show();

			}else{
				$(".js-review-write").hide();
			}		
		});

		$(document).on("click",".js-openTab",function() {
            tabs.showAccessibleTabSelector($(this).attr("href")); 
		});
	},
	
	showReviewsAction: function (s)
	{
		$.get($("#reviews").data(s), undefined, function (result){
			$('#reviews').html(ACC.sanitizer.sanitize(result));
			if($(".js-ratingCalc").length > 0){
				ACC.ratingstars.bindRatingStars();
				ACC.tabs.showingAllReviews();
			}
		}, 'html');
	},
	
	hideReviewBtn: function (btnClass) {

		btnClass = (btnClass === undefined) ? ".less-reviews-btn" : btnClass;
		$(btnClass).hide();
	},
	
	showReviewBtn: function (btnClass) {
		$(btnClass).show();
	},
	
	showingAllReviews: function()
	{
		var isShowingAllReviews = $("#showingAllReviews").data("showingallreviews");
		if(isShowingAllReviews){
			ACC.tabs.hideReviewBtn(".all-reviews-btn");
		}
	},
	
	determineToDisplayReviews: function ()
	{
		if(location.hash === "#tabreview"){
			ACC.tabs.showReviewsAction('reviews');
		}
	}
};
