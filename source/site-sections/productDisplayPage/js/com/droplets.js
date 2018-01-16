(function($) {
	try {
		//Define the plugin's name here
		var __name = "droplets";
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
				type: null,
				callback: function($el) {}
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
				type,
				$droplets,
				classes = {
					active: "activeSelection"
				};

			//-- Start
			//-- ------------------------------------------------------
			function ignite() {
				type = self.options.type;

				if (type == null) return self;

				$droplets = f('[class*="select"] a');

				bindEvents();

				return self;
			}

			function bindEvents() {
				var $current = f('span[class*="current"] > span'),
					currentChoice = $droplets
						.filter("." + classes.active)
						.attr("data-" + type);
				currentChoice = base.fn.und(currentChoice) ? "" : currentChoice;

				$droplets
					.off("click")
					.off("mouseover")
					.off("mouseleave")
					.on({
						mouseover: function() {
							$current.text($(this).attr("data-" + type));
						},
						mouseleave: function() {
							$current.text(currentChoice);
						},
						click: function(evt) {
							evt.preventDefault();

							//- Google Analytics Tracking
							try {
								var e = _gatrackr[type];
								pdpTracker(
									e[0],
									e[1],
									e[2] +
										$(this).attr("data-" + type) +
										" " +
										$(this).attr("data-sku")
								);
							} catch (e) {}

							currentChoice = $(this).attr("data-" + type);
							$(this)
								.addClass(classes.active)
								.siblings("a")
								.removeClass(classes.active);
							$current.text(currentChoice);

							self.options.callback($(this));
						}
					});
			}

			var getCurrentSku = (self.getCurrentSku = function() {
				return $droplets.filter("." + classes.active).attr("data-sku");
			});

			var activate = (self.activate = function(skuId) {
				$droplets
					.removeClass(classes.active)
					.filter('[data-sku="' + skuId + '"]')
					.addClass(classes.active);
			});

			//-
			return self.initialize();
		};
	} catch (e) {}
})(jQuery);
