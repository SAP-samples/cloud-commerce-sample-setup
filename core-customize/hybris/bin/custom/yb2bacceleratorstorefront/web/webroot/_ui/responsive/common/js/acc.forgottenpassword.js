ACC.forgottenpassword = {

	_autoload: [
		"bindLink"
	],

	bindLink: function(){
		$(document).on("click",".js-password-forgotten",function(e){
			e.preventDefault();

			var titleHtml = ACC.common.encodeHtml($(this).data("cboxTitle"));
			ACC.colorbox.open(
				titleHtml,
				{
					href: $(this).data("link"),
					width:"350px",
					fixed: true,
					top: 150,
					onOpen: function()
					{
						$('#validEmail').remove();
					},
					onComplete: function(){
						$('form#forgottenPwdForm').ajaxForm({
							success: function(data)
							{
								if ($(data).closest('#validEmail').length)
								{
									
									if ($('#validEmail').length === 0)
									{
										$(".forgotten-password").replaceWith(data);
										ACC.colorbox.resize();
									}
								}
								else
								{
									$("#forgottenPwdForm .control-group").replaceWith($(data).find('.control-group'));
									ACC.colorbox.resize();
								}
							}
						});
					}
				}
			);
		});
	}

};
