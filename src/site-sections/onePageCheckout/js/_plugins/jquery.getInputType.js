(function($) {
	//--
	$.fn.getInputType = function() {
		return !$(this).length
			? ""
			: this[0].tagName == "INPUT"
				? this[0].type.toLowerCase()
				: this[0].tagName.toLowerCase();
	};
})(jQuery);
