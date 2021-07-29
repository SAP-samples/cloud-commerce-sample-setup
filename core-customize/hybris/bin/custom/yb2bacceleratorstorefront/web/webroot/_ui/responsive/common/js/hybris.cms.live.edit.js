ACC.liveEdit = {

	bindAll: function ()
	{
		this.bindGlobalClick();
	},

	bindGlobalClick: function ()
	{
		// Hook click event on body element to load CMS Component editor
		$('body').click(function (event)
		{
			var cmsComponent = ACC.liveEdit.findNearestCMSComponent(event);
			if (cmsComponent.length > 0)
			{
				var cmsComponentUid = cmsComponent.data('cmsComponent');
				var cmsContentSlotUid = cmsComponent.data('cmsContentSlot');

				ACC.liveEdit.displayCMSComponentEditor(cmsComponentUid, cmsContentSlotUid);
				return false;
			}
		});
	},

	findNearestCMSComponent: function (event)
	{
		return $(event.target).closest('.yCmsComponent');
	},

	displayCMSComponentEditor: function (cmsComponentUid, cmsContentSlotUid)
	{
		if (undefined != cmsComponentUid && cmsComponentUid != "")
		{
            parent.postMessage({eventName:'notifyIframeZkComponent', data: [cmsComponentUid, cmsContentSlotUid]},'*');
		}
	}
};

$(document).ready(function ()
{
	ACC.liveEdit.bindAll();
});
