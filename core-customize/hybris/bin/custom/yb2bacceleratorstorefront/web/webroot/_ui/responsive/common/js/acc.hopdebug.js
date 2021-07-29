ACC.hopdebug = {

	bindAll: function ()
	{
		this.bindShowDebugMode();
	},

	bindShowDebugMode: function ()
	{
		var debugModeEnabled = $('#hopDebugMode').data("hopDebugMode");
		
		if (!debugModeEnabled && !$('#showDebugPage').val())
		{
			$('#hostedOrderPagePostForm').submit();
		}
	}
};


$(document).ready(function ()
{
	ACC.hopdebug.bindAll();
});