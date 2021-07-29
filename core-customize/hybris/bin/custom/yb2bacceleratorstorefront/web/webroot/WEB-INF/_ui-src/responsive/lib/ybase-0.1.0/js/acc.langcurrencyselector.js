ACC.langcurrency = {

	_autoload: [
		"bindLangCurrencySelector"
	],

	bindLangCurrencySelector: function (){

		$('#lang-selector').change(function(){
			$('#lang-form').submit();
		});

		$('#currency-selector').change(function(){
			$('#currency-form').submit();
		});
	}
};