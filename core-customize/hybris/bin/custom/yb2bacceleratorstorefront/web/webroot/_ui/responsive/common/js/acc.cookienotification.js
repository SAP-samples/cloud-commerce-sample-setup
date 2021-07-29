ACC.coookienotification = {
    _autoload: [
    	["bindCookieNotificationClick", $(".js-cookie-notification-accept").length != 0]
    ],

    bindCookieNotificationClick:function(){
        $('.js-cookie-notification-accept').on("click",function(){
        	$.cookie('cookie-notification', "ACCEPTED", {path:'/'});
        	$('#js-cookie-notification').hide();
        });
    }
};

