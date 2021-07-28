var oDoc = document;

ACC.navigation = {

    _autoload: [
        "offcanvasNavigation",
        "myAccountNavigation",
        "orderToolsNavigation"
    ],

    offcanvasNavigation: function(){

    	enquire.register("screen and (max-width:"+ ACC.common.encodeHtml(screenSmMax) +")", {

            match : function() {

                $(document).on("click",".js-enquire-offcanvas-navigation .js-enquire-has-sub .js_nav__link--drill__down",function(e){
                    e.preventDefault();
                    $(".js-userAccount-Links").hide();
                    $(".js-enquire-offcanvas-navigation ul.js-offcanvas-links").addClass("active");
                    $(".js-enquire-offcanvas-navigation .js-enquire-has-sub").removeClass("active");
                    $(this).parent(".js-enquire-has-sub").addClass("active");
                });


                $(document).on("click",".js-enquire-offcanvas-navigation .js-enquire-sub-close",function(e){
                    e.preventDefault();
                    $(".js-userAccount-Links").show();
                    $(".js-enquire-offcanvas-navigation ul.js-offcanvas-links").removeClass("active");
                    $(".js-enquire-offcanvas-navigation .js-enquire-has-sub").removeClass("active");
                });

            },

            unmatch : function() {

                $(".js-userAccount-Links").show();
                $(".js-enquire-offcanvas-navigation ul.js-offcanvas-links").removeClass("active");
                $(".js-enquire-offcanvas-navigation .js-enquire-has-sub").removeClass("active");

                $(document).off("click",".js-enquire-offcanvas-navigation .js-enquire-has-sub > a");
                $(document).off("click",".js-enquire-offcanvas-navigation .js-enquire-sub-close");


            }


        });

    },

    myAccountNavigation: function(){

        //copy the site logo
        $('.js-mobile-logo').html( $('.js-site-logo a').clone());

        //Add the order form img in the navigation
        $('.nav-form').append($("<span>").addClass("glyphicon glyphicon-list-alt"));


        var aAcctData = [];
        var sSignBtn = "";

        //my account items
        var oMyAccountData = $(".accNavComponent");

        //the my Account hook for the desktop
        var oMMainNavDesktop = $(".js-secondaryNavAccount > ul");

        //offcanvas menu for tablet/mobile
        var oMainNav = $(".navigation--bottom > ul.nav__links.nav__links--products");

        if(oMyAccountData){
            var aLinks = oMyAccountData.find("a");
            for(var i = 0; i < aLinks.length; i++){
                aAcctData.push({link: aLinks[i].href, text: aLinks[i].title});
            }
        }

        var navClose = $("<div>").addClass("close-nav")
		.append($("<button>").attr("type", "button")
				.addClass("js-toggle-sm-navigation btn")
				.append($("<span>").addClass("glyphicon glyphicon-remove")));

        //create Sign In/Sign Out Button
        if($(".liOffcanvas a") && $(".liOffcanvas a").length > 0){
        	sSignBtn = $("<li>").addClass("auto liUserSign")
			.append($("<a>").addClass("userSign")
					.attr("href", $(".liOffcanvas a")[0].href)
					.text($(".liOffcanvas a")[0].innerHTML));
        }

        //create Welcome User + expand/collapse and close button
        //This is for mobile navigation. Adding html and classes.
        var oUserInfo = $(".nav__right ul li.logged_in");
        //Check to see if user is logged in
        if(oUserInfo && oUserInfo.length === 1)
        {
        	var sUserBtn = $("<li>").addClass("auto")
			.append($("<div>")
					.addClass("userGroup")
					.append($("<span>")
							.addClass("glyphicon glyphicon-user myAcctUserIcon"))
							.append($("<div>")
									.addClass("userName")
									.html(oUserInfo[0].innerHTML)));

            if(aAcctData.length > 0){
            	$(sUserBtn).find(".userGroup").append($("<a>").addClass("collapsed js-nav-collapse")
        				.attr("id", "signedInUserOptionsToggle")
        				.attr("data-toggle", "collapse")
        				.attr("data-target", ".offcanvasGroup1")
        				.append($("<span>").addClass("glyphicon glyphicon-chevron-up myAcctExp")));
            }
            sUserBtn.append(navClose);

            $('.js-sticky-user-group').html(sUserBtn);

            $('.js-userAccount-Links').append(sSignBtn);
            $('.js-userAccount-Links').append($("<li>").addClass("auto").append($("<div>").addClass("myAccountLinksContainer js-myAccountLinksContainer")));


            //FOR DESKTOP
            var myAccountHook = $("<div>").addClass("myAccountLinksHeader js-myAccount-toggle")
			.attr("data-toggle", "collapse")
			.attr("data-parent", ".nav__right")
			.text(oMyAccountData.data("title"));

            myAccountHook.insertBefore(oMyAccountData);

            //*For toggling collapse myAccount on Desktop instead of with Bootstrap.js
            $('.myAccountLinksHeader').click(function () {
                $(this).toggleClass('show');
                $(".js-secondaryNavAccount").slideToggle(400);
                if ( $(this).hasClass('show') ) {
                    $('.myCompanyLinksHeader').removeClass('show'); // hide the other one
                    $('.js-secondaryNavCompany').slideUp(400);
                }
                return false;
            });

            //FOR MOBILE
            //create a My Account Top link for desktop - in case more components come then more parameters need to be passed from the backend
            var myAccountHook = $("<div>").addClass("sub-nav")
			.append($("<a>").attr("id", "signedInUserAccountToggle")
					.addClass("myAccountLinksHeader collapsed js-myAccount-toggle")
					.attr("data-toggle", "collapse")
					.attr("data-target", ".offcanvasGroup2")
					.text(oMyAccountData.data("title"))
					.append($("<span>").addClass("glyphicon glyphicon-chevron-down myAcctExp")));

            $('.js-myAccountLinksContainer').append(myAccountHook);

            //add UL element for nested collapsing list
            $('.js-myAccountLinksContainer').append($("<ul>")
					.attr("data-trigger" ,"#signedInUserAccountToggle")
					.addClass("offcanvasGroup2 offcanvasNoBorder collapse js-nav-collapse-body subNavList js-myAccount-root sub-nav"));

            //*For toggling collapse on Mobile instead of with Bootstrap.js
            $('#signedInUserAccountToggle').click(function () {
                $(this).toggleClass('show');
                $(".offcanvasGroup2").slideToggle(400);
                if ( $(this).hasClass('show') ) {
                    $(this).find('span').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                    $('#signedInCompanyToggle').removeClass('show'); // hide the other one
                    $('#signedInCompanyToggle').find('span').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                    $('.offcanvasGroup3').slideUp(400);
                }
                else {
                    $(this).find('span').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                }
            });

            //offcanvas items
            //TODO Follow up here to see the output of the account data in the offcanvas menu
            for(var i = aAcctData.length - 1; i >= 0; i--){
                var oLink = oDoc.createElement("a");
                oLink.title = aAcctData[i].text;
                oLink.href = aAcctData[i].link;
                oLink.innerHTML = ACC.common.encodeHtml(aAcctData[i].text);

                var oListItem = oDoc.createElement("li");
                oListItem.appendChild(oLink);
                oListItem = $(oListItem);
                oListItem.addClass("auto ");
                $('.js-myAccount-root').append(oListItem);
            }

        } else {
        	if(sSignBtn)
        		{
        			var navButtons = sSignBtn.append(navClose);
        			$('.js-sticky-user-group').append(navButtons);
        		}
        }

        //desktop
        for(var i = 0; i < aAcctData.length; i++){
            var oLink = oDoc.createElement("a");
            oLink.title = aAcctData[i].text;
            oLink.href = aAcctData[i].link;
            oLink.innerHTML = ACC.common.encodeHtml(aAcctData[i].text);

            var oListItem = oDoc.createElement("li");
            oListItem.appendChild(oLink);
            oListItem = $(oListItem);
            oListItem.addClass("auto col-md-4");
            oMMainNavDesktop.get(0).appendChild(oListItem.get(0));
        }

        //hide and show content areas for desktop
        $('.js-secondaryNavAccount').on('shown.bs.collapse', function () {

            if($('.js-secondaryNavCompany').hasClass('in')){
                $('.js-myCompany-toggle').click();
            }

        });

        $('.js-secondaryNavCompany').on('shown.bs.collapse', function () {

            if($('.js-secondaryNavAccount').hasClass('in')){
                $('.js-myAccount-toggle').click();
            }

        });

        //change icons for up and down
        $('.js-nav-collapse-body').on('hidden.bs.collapse', function(e){

            var target = $(e.target);
            var targetSpanSelector = target.attr('data-trigger') + ' > span';
            if(target.hasClass('in')) {
                $(document).find(targetSpanSelector).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            }
            else {
                $(document).find(targetSpanSelector).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
            }
        });

        $('.js-nav-collapse-body').on('show.bs.collapse', function(e){
            var target = $(e.target);
            var targetSpanSelector = target.attr('data-trigger') + ' > span';
            if(target.hasClass('in')) {
                $(document).find(targetSpanSelector).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
            }
            else {
                $(document).find(targetSpanSelector).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            }
        });

    },

    orderToolsNavigation: function(){
        $('.js-nav-order-tools').on('click', function(e){
            $(this).toggleClass('js-nav-order-tools--active');
        });
    }
};
