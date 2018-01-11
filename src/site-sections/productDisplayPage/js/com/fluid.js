(function($) {
	try {
		//Define the plugin's name here
		var __name = "fluid";

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
				productId: 0,
				viewId: "pdp",
				css: "width: 250px; height: 250px;",
				loadCallback: function() {}
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
				pmr,
				displayMain,
				$thumbs = {},
				$arrows,
				$display,
				productId,
				customerId = "1079",
				displayId,
				_gatrackr = PDPTracking.ga;

			//-- Start
			//-- ------------------------------------------------------
			function ignite() {
				productId = self.options.productId;

				$display = f(".fluid-display");

				//-
				$arrows = arrows();

				launchFluid();

				return self;
			}

			function arrows() {
				var $a = f(".arrow");

				return $a.length
					? $a
					: self.view
							.prepend(
								[
									'<a href="#" class="arrow right" title="Next"></a>',
									'<a href="#" class="arrow left" title="Previous"></a>'
								].join("\n")
							)
							.find(".arrow");
			}

			function launchFluid(evt) {
				if (!$display.length) {
					displayId = [
						"display",
						customerId,
						productId,
						self.options.viewId
					].join(":");

					$display = $(
						'<div id="' +
							displayId +
							'" class="fluid-display" style="' +
							self.options.css +
							'" />'
					);

					self.view.append($display);
				} else displayId = $display.attr("id");

				try {
					pmr = fluid.application;

					pmr.processFluidDiv($display[0]);

					//console.log(['fluid.application', fluid.application]);

					displayMain = self.displayMain = pmr.getPresentation(
						displayId
					);

					var loadType =
						fluid.retail.display.events.DisplayEvent.LOADED;
					pmr.addEventListener(loadType, window, function(evt) {
						setTimeout(self.handleDisplayLoaded, 100);
					});

					var changeType =
						fluid.retail.display.events.DisplayEvent.CHANGE;
					displayMain.addEventListener(
						changeType,
						window,
						self.handleDisplayChanged
					);

					var loadType =
						fluid.retail.display.events.DisplayEvent.ERROR;
					pmr.addEventListener(
						loadType,
						window,
						self.handleDisplayError
					);
				} catch (e) {
					console.log("Fluid error: " + e);
				}
			}

			function bindEvents() {
				$arrows.off("click").on("click", function(evt) {
					evt.preventDefault();
					//-

					var doCount = function($arrow, i) {
						var c;

						if ($arrow.hasClass("right")) c = i + 1;
						else c = i - 1;

						c = c > $thumbs.length - 1 ? 0 : c;
						c = c < 0 ? $thumbs.length - 1 : c;

						return c;
					};

					//- Google Analytics Tracking
					var e = PDPTracking.ga.fluid.arrows;
					pdpTracker(
						e[0],
						e[1],
						e[2] +
							($(this).hasClass("right") ? "Next" : "Prev") +
							" " +
							productId
					);

					//- Get selected Fluid thumb
					var i = $thumbs
						.filter(function() {
							return $(this)
								.find("img")
								.hasClass("fluid-display-imageitem-selected");
						})
						.index();

					var counter = doCount($(this), i);

					var $thumb = $thumbs.eq(counter);

					if (!$thumb.find("img").is(":visible"))
						counter = doCount($(this), counter);

					$thumb = $thumbs.eq(counter);

					$thumb.find("img").trigger("click");
				});
			}

			function parseImageId(id) {
				var a = id.split(":");
				return a[0];
			}

			function showArrows() {
				/*
            var pos = $thumbs.parent().parent().position();

            if(!base.fn.und(pos)) {
                // sometimes, parent container is off screen from Fluid's CSS. Means it's irrelevant to show.
                if(parseInt(pos.top) < -200) return;
            }*/

				$thumbs.length <= 1 || $arrows.show();
			}

			//- Public methods

			var hasHopup = (self.hasHopup = function() {
				var s = self.getDisplayId();
				return s.indexOf(":pdp") != -1 && s.indexOf(":hopup") == -1;
			});

			var handleDisplayLoaded = (self.handleDisplayLoaded = function(
				evt
			) {
				//console.log('handleDisplayLoaded');

				$thumbs = f(
					".fluid-display-viewgroup .fluid-display-imagegroup > a"
				);

				showArrows();

				self.trigger("fluidLoaded");

				self.options.loadCallback();

				bindEvents();
			});

			var handleDisplayChanged = (self.handleDisplayChanged = function(
				evt
			) {
				//- Google Analytics Tracking
				var e = _gatrackr.fluid.thumbnails;
				pdpTracker(e[0], e[1], e[2] + evt.variationId);

				self.trigger("fluidChanged");
			});

			var handleDisplayError = (self.handleDisplayError = function(evt) {
				//console.log('handleDisplayError');
			});

			var selectView = (self.selectView = function(id) {
				self.fluidSelect(id);
			});

			var selectView2 = (self.selectView2 = function(id) {
				var id = parseImageId($thumbs.eq(counter).attr("id"));
				self.fluidSelect(id);
			});

			var fluidSelect = (self.fluidSelect = function(id, displayId) {
				var e = PDPTracking.ga.fluid.thumbnails;
				pdpTracker(e[0], e[1], e[2] + id);

				var d = fluid.application.getPresentation(displayId);
				/*
            // Commented out to prevent a reduction of thumbs to only the variation. The primary image still changes with size/color selection
            // 09/08/2015 tfritsch
            -------------------------------------
            d.selectCategory("VARIATION", id);
            -------------------------------------
            */
				d.selectCategory("VIEW", id);
			});

			var getDisplayId = (self.getDisplayId = function() {
				return displayId;
			});

			var getCurrentThumb = (self.getCurrentThumb = function() {
				return $thumbs
					.filter(function() {
						return $(this)
							.find("img")
							.hasClass("fluid-display-imageitem-selected");
					})
					.index();
			});

			var selectView = (self.selectView = function(id) {
				fluidSelect(id, displayId);
			});

			//- Keep global reference for dependent scripts
			window.selectVariation = self.selectView;

			//-
			return self.initialize();
		};
	} catch (e) {}
})(jQuery);
