/*!
	Zoom v1.7.13 - 2014-04-29
	Enlarge images on click or mouseover.
	(c) 2014 Jack Moore - http://www.jacklmoore.com/zoom
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function ($) {
	var defaults = {
		url: false,
		callback: false,
		target: false,
		duration: 120,
		on: 'mouseover', // other options: grab, click, toggle
		touch: true, // enables a touch fallback
		onZoomIn: false,
		onZoomOut: false,
		zoomEnableCallBack:false,
		zoomEnable:true,
		magnify: 1,
		longtouchtimer:function(){},
		touchduration: 500
	};

	// Core Zoom Logic, independent of event listeners.
	$.zoom = function(target, source, img, magnify) {
		var targetHeight,
			targetWidth,
			sourceHeight,
			sourceWidth,
			xRatio,
			yRatio,
			offset,
			position = $(target).css('position'),
			$source = $(source);

		// The parent element needs positioning so that the zoomed element can be correctly positioned within.
		target.style.position = /(absolute|fixed)/.test(position) ? position : 'relative';
		target.style.overflow = 'hidden';

		img.style.width = img.style.height = '';

		var i= $("<div class='zoomImg'><div class='zoomImgMask'></div></div>")
			.css({
				width: img.width * magnify,
				height: img.height * magnify,
			}).appendTo(target);

		$(img).appendTo(i);

		return {
			init: function() {
				targetWidth = $(target).outerWidth();
				targetHeight = $(target).outerHeight();

				if (source === target) {
					sourceWidth = targetWidth;
					sourceHeight = targetHeight;
				} else {
					sourceWidth = $source.outerWidth();
					sourceHeight = $source.outerHeight();
				}

				xRatio = (img.width - targetWidth) / sourceWidth;
				yRatio = (img.height - targetHeight) / sourceHeight;

				offset = $source.offset();




			},
			move: function (e) {


				if(offset == undefined){
					offset = {left:0,top:0}
				}
				


				

				var left = (e.pageX -  offset.left),
					top = (e.pageY - offset.top);

				top = Math.max(Math.min(top, sourceHeight), 0);
				left = Math.max(Math.min(left, sourceWidth), 0);

				$(img).parent(".zoomImg").css("left",(left * -xRatio) + 'px');
				$(img).parent(".zoomImg").css("top",(top * -yRatio) + 'px');
			}
		};
	};

	$.fn.zoom = function (options) {
		return this.each(function () {
			var
			settings = $.extend({}, defaults, options || {}),
			//target will display the zoomed image
			target = settings.target || this,
			//source will provide zoom location info (thumbnail)
			source = this,
			$source = $(source),
			img = document.createElement('img'),
			$img = $(img),
			mousemove = 'mousemove.zoom',
			clicked = false,
			touched = false,
			$urlElement;

			// If a url wasn't specified, look for an image element.
			if (!settings.url) {
				$urlElement = $source.find('img');
				if ($urlElement[0]) {
					settings.url = $urlElement.data('src') || $urlElement.attr('src');
				}
				if (!settings.url) {
					return;
				}
			}

			(function(){
				var position = target.style.position;
				var overflow = target.style.overflow;

				$source.one('zoom.destroy', function(){
					$source.off(".zoom");
					target.style.position = position;
					target.style.overflow = overflow;
					$img.remove();
				});
				
			}());

			img.onload = function () {
				var zoom = $.zoom(target, source, img, settings.magnify);


				function start(e) {

					if($.isFunction(settings.zoomEnableCallBack)){
						settings.zoomEnable =   settings.zoomEnableCallBack.call(img)
					} 

					if(!settings.zoomEnable){
						return false;
					}


					zoom.init();
					zoom.move(e);

					// Skip the fade-in for IE8 and lower since it chokes on fading-in
					// and changing position based on mousemovement at the same time.
					$(img).parent(".zoomImg").stop()
					.fadeTo($.support.opacity ? settings.duration : 0, 1, $.isFunction(settings.onZoomIn) ? settings.onZoomIn.call(img) : false);
				}

				function stop() {

					if (settings.longtouchtimer){
						clearTimeout(settings.longtouchtimer);
					}


					$(img).parent(".zoomImg").stop()
					.fadeTo(settings.duration, 0, $.isFunction(settings.onZoomOut) ? settings.onZoomOut.call(img) : false);
				}


				// Mouse events
				if (settings.on === 'grab') {
					$source
						.on('mousedown.zoom',
							function (e) {
								if (e.which === 1) {
									$(document).one('mouseup.zoom',
										function () {
											stop();

											$(document).off(mousemove, zoom.move);
										}
									);



									settings.longtouchtimer = setTimeout(function(){
										start(e);
										$(document).on(mousemove, zoom.move);
									}, settings.touchduration); 
								
									e.preventDefault();
								}
							}
						);
				} else if (settings.on === 'click') {
					$source.on('click.zoom',
						function (e) {
							if (clicked) {
								// bubble the event up to the document to trigger the unbind.
								return;
							} else {
								clicked = true;
								start(e);
								$(document).on(mousemove, zoom.move);
								$(document).one('click.zoom',
									function () {
										stop();
										clicked = false;
										$(document).off(mousemove, zoom.move);
									}
								);
								return false;
							}
						}
					);
				} else if (settings.on === 'toggle') {
					$source.on('click.zoom',
						function (e) {
							if (clicked) {
								stop();
							} else {
								start(e);
							}
							clicked = !clicked;
						}
					);
				} else if (settings.on === 'mouseover') {
					zoom.init(); // Preemptively call init because IE7 will fire the mousemove handler before the hover handler.

					$source
						.on('mouseenter.zoom', start)
						.on('mouseleave.zoom', stop)
						.on(mousemove, function(){
							if (settings.longtouchtimer){
								clearTimeout(settings.longtouchtimer);
							}
							zoom.move()
						});
				}

				// Touch fallback
				if (settings.touch) {

					touched=false
					$source
						.on('touchstart.zoom', function (e) {
							clearTimeout(settings.longtouchtimer);
							settings.longtouchtimer = setTimeout(function(){
								if (touched) {
									touched = false;
									stop();
								} else {
									touched = true;
									e.preventDefault();
									start( e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] );
								}
							}, settings.touchduration); 
						})
						.on('touchmove.zoom', function (e) {
							if(touched){
								e.preventDefault();
								zoom.move( e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] );
							}
							
						})
						.on('touchend.zoom', function (e) {
								e.preventDefault();
								if (settings.longtouchtimer){
									clearTimeout(settings.longtouchtimer);
								}
								stop();
								touched=false
						});
				}
				
				if ($.isFunction(settings.callback)) {
					settings.callback.call(img);
				}
			};

			img.src = settings.url;


		});
	};

	$.fn.zoom.defaults = defaults;
}(window.jQuery));







