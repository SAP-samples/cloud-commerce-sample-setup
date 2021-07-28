ACC.cms = {
	loadComponent: function(id, type, target, onSuccess, onError) {
		var self = this;
		if(id) {
			$.ajax({
				url: ACC.config.contextPath +  '/cms/component?componentUid=' + encodeURIComponent(id),
				cache: false,
				type: 'GET',
                dataType: 'html',
				success: function (result) {
					reprocess = result.indexOf('js-responsive-image') > -1;
					self.insertHtml(result, target, reprocess);
					if(onSuccess) {
						onSuccess(result, id, type, target);
					}
				},
				error: function (result) {
					if(onError) {
						onError(result, id, type, target);
					}
				}
			});
		}
	},
	
	insertHtml: function(html, target, reprocess) {
		if(target) {
			$(target).html(html);
			if(reprocess) {
				ACC.global.reprocessImages();
			}
		}
	}
}
