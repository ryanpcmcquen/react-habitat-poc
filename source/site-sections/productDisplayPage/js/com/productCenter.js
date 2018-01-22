(function($) {
	try {
		//Define the plugin's name here
		var __name = "productCenter";
		//--
		$.fn[__name] = function(options) {
			//-- ------------------------------------------------------
			var self = this; // prevent from loosing the scope
			self.view = $(this);
			self.view.data(__name, self); // store the plugin instance into the element
			//-- ------------------------------------------------------

			//-- init
			//-- ------------------------------------------------------
			self.defaults = {
				$videoPopover: null,
				_productRight: null
			};

			self.initialize = function() {
				// merging defaults with passed arguments
				self.options = $.extend(true, {}, self.defaults, options);
				//-
				return ignite();
			};

			//-- Vars
			//-- ------------------------------------------------------

			var f = function(s) {
					return self.view.find(s);
				},
				_gatrackr = PDPTracking.ga,
				_productRight,
				_videos,
				$videoPopover,
				$innerDivs,
				moreInfoSingleClass = "single";

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				$videoPopover = self.options.$videoPopover;
				_productRight = self.options._productRight;
				$innerDivs = self.view.find("#product-mainCenter > div");

				IE_adjustHeights();

				bindEvents();

				return self;
			}

			function bindEvents() {
				$(document).ready(function($) {
					f("#product-videos")
						.videos({
							$popover: $videoPopover
						})
						.on("novideos", function(evt) {
							f("div#product-moreInfo").addClass("novideos");
						});
				});

				_productRight.on("scroll2", function(evt, el) {
					f(el).scroll2();
				});

				/*  
            **    More Info show/hides
            */

				var $moreinfo = f("div#product-moreInfo"),
					isSingle = $moreinfo.hasClass(moreInfoSingleClass);

				isSingle ||
					$moreinfo.find("> div > h3").on("click", function(evt) {
						//- Google Analytics Tracking
						var e = _gatrackr.moreinfo.tab;
						pdpTracker(e[0], e[1], $(this).text());

						IE_resetHeights();

						$(this)
							.next("div")
							.slideToggle(222, function() {
								IE_adjustHeights();
							});
						var txt = $(this)
							.children("a")
							.text();
						if (txt === "Show") {
							$(this)
								.children("a")
								.text("Hide");
						} else if (txt === "Hide") {
							$(this)
								.children("a")
								.text("Show");
						} else if (txt === "Yes") {
							$(this)
								.children("a")
								.text("No");
						} else if (txt === "No") {
							$(this)
								.children("a")
								.text("Yes");
						}
					});
			}

			function IE_resetHeights() {
				if (!base.fn.is("ie")) return;
				$innerDivs.css("height", "auto");
			}
			function IE_adjustHeights() {
				if (!base.fn.is("ie")) return;

				var max = 0,
					h = 0,
					padding = 20;

				$innerDivs
					.each(function() {
						h = $(this).height();
						max = h > max ? h : max;
					})
					.css("height", max - padding + "px");
			}

			//-
			return self.initialize();
		};
	} catch (e) {}
})(jQuery);
