/* Extend the height of each item box in order to
   force the gutter border to be drawn full height, regardless of content */

$(function() {
	$(".themeFavorites, .themeFavoritesWide, .themeFavoritesWideFive").each(
		function() {
			var maxHeight = 0;
			$(this)
				.find(".itemBox div")
				.each(function() {
					var eachHeight = $(this).height();
					if (maxHeight < eachHeight) {
						maxHeight = eachHeight;
					}
				});
			$(this)
				.find(".itemBox div")
				.css("height", maxHeight + "px");
		}
	);
});

/* Wide Culinary Class Series By3 */
$(function() {
	$(".culclassseriesby3, .culclassseriesby3Short").each(function() {
		var maxHeight = 0;
		$(this)
			.find(".itemBox div")
			.each(function() {
				var eachHeight = $(this).height();
				if (maxHeight < eachHeight) {
					maxHeight = eachHeight;
				}
			});
		$(this)
			.find(".itemBox div")
			.css("height", maxHeight + "px");
	});
});
