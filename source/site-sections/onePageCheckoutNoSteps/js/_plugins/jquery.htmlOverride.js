(function($) {
	$.fn.htmlOverride = function(val) {
		if (
			$.browser.msie &&
			(parseInt($.browser.version) == 7 ||
				parseInt($.browser.version) == 8)
		) {
			return this.each(function() {
				this.innerHTML = val;

				var scriptTagStart = 0;
				var scriptTagEnd = 0;
				var scriptEndTagStart = 0;
				while (scriptTagStart >= 0) {
					scriptTagStart = val.indexOf("<script", scriptEndTagStart);
					if (scriptTagStart >= 0) {
						scriptTagEnd = val.indexOf(">", scriptTagStart) + 1;
						scriptEndTagStart = val.indexOf(
							"</script>",
							scriptTagEnd
						);

						var scriptString = val.substring(
							scriptTagStart,
							scriptEndTagStart
						);
						var scriptSrcIndex = scriptString.indexOf('src="', 0);

						if (scriptSrcIndex >= 0) {
							loadCachedScript(
								scriptString.substring(
									scriptSrcIndex + 5,
									scriptString.indexOf(
										'"',
										scriptSrcIndex + 5
									)
								)
							);
						} else {
							eval(
								val.substring(scriptTagEnd, scriptEndTagStart)
							);
						}
						scriptString = null;
						scriptSrcIndex = null;
					}
				}

				scriptTagStart = null;
				scriptTagEnd = null;
				scriptEndTagStart = null;
				$(this).trigger("htmlOverride.done");
			});
		} else {
			return this.each(function() {
				$(this).html(val);
				$(this).trigger("htmlOverride.done");
			});
		}
	};
})(jQuery);
