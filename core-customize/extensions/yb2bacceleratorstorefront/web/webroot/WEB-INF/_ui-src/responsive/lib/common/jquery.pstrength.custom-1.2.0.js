/* jQuery Password Strength Plugin (pstrength) - A jQuery plugin to provide accessibility functions
 * Author: Tane Piper (digitalspaghetti@gmail.com)
 * Website: http://digitalspaghetti.me.uk
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 * This code uses a modified version of Steve Moitozo's algorithm (http://www.geekwisdom.com/dyn/passwdmeter)
 *
 * === Changelog ===
 * Version 1.2 (03/09/2007)
 * Added more options for colors and common words
 * Added common words checked to see if words like 'password' or 'qwerty' are being entered
 * Added minimum characters required for password
 * Re-worked scoring system to give better results
 *
 * Version 1.1 (20/08/2007)
 * Changed code to be more jQuery-like
 *
 * Version 1.0 (20/07/2007)
 * Initial version.
 */
(function($){
	$.extend($.fn, {
		pstrength : function(options) {
			var options = $.extend({
				verdicts:	["Too Short!","Very Weak","Weak","Medium","Strong","Very Strong"],
				colors: 	["#ccc","#f00","#c06","#f60","#3c0","#3f0"],
				values: 	[20,30,40,60,80,100],
				scores: 	[10,15,30,40],
				minchar:	6,
				minCharText: "Minimum length is %d characters"
			},options);
			return this.each(function(){
				var infoarea = $(this).attr('id');

				$(this).after($("<div>").attr("id", infoarea + "_bar").addClass("progress").css("display", "none")
						.append($("<div>").addClass("progress-bar").css("width", "0%").attr({
							"role":"progressbar",
							"aria-valuenow":0,
							"aria-valuemin":0,
							"aria-valuemax":100
						}).append($("<span>").attr("id", infoarea + "_text").text("0%"))));
				
				if(options.minchar>0){
					$(this).after($("<div>").addClass("help-block").attr("id", infoarea + "_minchar").text(options.minCharText.replace('%d', options.minchar)));
				}


				options.$ctlBar = $(document).find("#" + infoarea + "_bar .progress-bar");
	    		options.$ctlText = $(document).find("#" + infoarea + "_text");

				$(this).keyup(function(){
					if(options.minchar <= $(this).val().length && $(document).find("#"+infoarea + '_bar:hidden')){
						$(document).find("#"+infoarea + '_bar').show();
					}

					$.fn.runPassword($(this).val(), infoarea, options);
				});
			});
		},
		runPassword : function (password, infoarea, options){

			nPerc = $.fn.checkPassword(password, options);
	    	var statusNum;

			if (nPerc < 0){
				statusNum=0
			}
			else if(nPerc <= options.scores[0]){
				statusNum=1
			}
			else if (nPerc > options.scores[0] && nPerc <= options.scores[1]){
				statusNum=2
			}
			else if (nPerc > options.scores[1] && nPerc <= options.scores[2]){
				statusNum=3
			}
			else if (nPerc > options.scores[2] && nPerc <= options.scores[3]){
				statusNum=4
			}
			else{
				statusNum=5
			}


			options.$ctlBar.css({width: options.values[statusNum]+"%"});
			options.$ctlBar.attr("aria-valuenow",options.values[statusNum]);
			options.$ctlBar.css({backgroundColor: options.colors[statusNum]});
			options.$ctlText.html(options.verdicts[statusNum]);

		},
		checkPassword : function(password, options)
		{
			var intScore = 0;
			var strVerdict = options.verdicts[0];
			
			if (password.length  < options.minchar){
				intScore = (intScore-100)
			}
			else if (password.length >options.minchar+1 && password.length <options.minchar+3){
				intScore = (intScore+6)
			}
			else if (password.length >options.minchar+2 && password.length <options.minchar+4){
				intScore = (intScore+12)
			}
			else if (password.length >options.minchar*2){
				intScore = (intScore+18)
			}

			if (password.match(/[a-z]/)){
				intScore = (intScore+1)
			}

			if (password.match(/[A-Z]/)){
				intScore = (intScore+5)
			}

			if (password.match(/\d+/)){
				intScore = (intScore+5)
			}

			if (password.match(/(.*[0-9].*[0-9].*[0-9])/)){
				intScore = (intScore+5)
			}

			if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)){
				intScore = (intScore+5)
			}

			if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)){
				intScore = (intScore+5)
			}

			if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)){
				intScore = (intScore+2)
			}

			if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)){
				intScore = (intScore+2)
			}

			if (password.match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)){
				intScore = (intScore+2)
			}

			return intScore;

		}
	});
})(jQuery);