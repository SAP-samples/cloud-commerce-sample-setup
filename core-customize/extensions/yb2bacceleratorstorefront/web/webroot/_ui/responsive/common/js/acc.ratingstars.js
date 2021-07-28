ACC.ratingstars = {

	_autoload: [
		["bindRatingStars", $(".js-ratingCalc").length > 0],
		["bindRatingStarsSet", $(".js-ratingCalcSet").length > 0]
	],

	bindRatingStars: function(){

		$(".js-ratingCalc").each(function(){
			var rating =  $(this).data("rating");
			$(this).find(".js-greenStars").width($(this).width() * ( parseFloat(rating.rating, 10) / rating.total ))
		})
	},
	bindRatingStarsSet: function(){
        $('.js-writeReviewStars').on({
            mouseleave: function mouseleave(){
                clearReviewState();
                var sV = (parseFloat( $(".js-ratingSetInput").val(), 10)) * 2;
                (typeof sV === "number" && !isNaN(sV) )? setReviewState(sV) : clearReviewState();
            }
        });
        var ratingIcons = $('.js-writeReviewStars .js-ratingIcon');
        var setReviewState = function(index){
            ratingIcons.slice(0, parseFloat(index,10) ).addClass('active');
        };
        var clearReviewState = function(){
            ratingIcons.removeClass('active');
        };
        ratingIcons.on({
            mouseenter: function mouseenter(){
                clearReviewState();
                setReviewState( $(this).index()+1 );
            },
            mouseleave: function mouseleave(){
                $(this).removeClass('active');
            },
            click: function click(){
                $(".js-ratingSetInput").val( ($(this).index() + 1) /2);
            }
        });

	}

};