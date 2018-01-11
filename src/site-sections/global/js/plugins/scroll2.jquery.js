(function($) {
	$.fn.scroll2 = function(options) {
		var defaults = {
			animateTime: 1000,
			callback: function() {},
			padding: 0
		};
		options = $.extend({}, defaults, options);
		if (!$(this).length) return;

		var y = Number($(this).offset().top) - Number(options.padding),
			isDone = false;
		if (typeof y == "undefined") y = 0;
		$("html, body").animate(
			{
				scrollTop: y
			},
			options.animateTime,
			function(evt) {
				isDone || options.callback();
				isDone = true;
			}
		);
	};
})(jQuery);
