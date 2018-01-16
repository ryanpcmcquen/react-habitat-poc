(function($) {
	try {
		//Define the plugin's name here
		var __name = "productLeft";
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
				$fluidHopup: null,
				containerWidth: 990
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
				productId,
				displayId,
				_fluid,
				hasHopup,
				_fluidHopup,
				$fluidHopup,
				$colors,
				$sizes,
				_gatrackr = PDPTracking.ga;

			//-- Start
			//-- ------------------------------------------------------
			function ignite() {
				productId = self.options.productId;
				$fluidHopup = self.options.$fluidHopup;

				_fluid = f("#product-fluid").fluid({
					productId: productId
				});
				displayId = _fluid.getDisplayId();
				hasHopup = _fluid.hasHopup();

				bindEvents();

				return self;
			}

			function bindEvents() {
				self
					.on("colorChange", function(evt, id) {
						_fluid.fluidSelect(id, displayId);
					})
					.on("sizeChange", function(evt, id) {
						_fluid.fluidSelect(id, displayId);
					});

				_fluid
					.on("fluidLoaded", function(evt) {
						self.trigger("variationRequest");
						//-
						bindFluidEvents();
					})
					.on("fluidChanged", function(evt) {
						bindFluidImgEvent();
					});
			}

			function bindFluidEvents() {
				/*  
            **    Fluid popover
            */

				var $hopuphook = f('div[id*="iconbutton"]');

				$hopuphook.off("click").on("click", function(evt) {
					launchHopup(evt);
				});

				bindFluidImgEvent();
			}

			function bindFluidImgEvent() {
				var imgHook = "#product-fluid .fluid-external-zoom";
				f(imgHook)
					.off("click")
					.on("click", function(evt) {
						evt.preventDefault();
						//-
						return hasHopup ? launchHopup() : false;
					});
			}

			function launchHopup(evt) {
				//- Google Analytics Tracking
				var e = _gatrackr.fluid.popupopen;
				pdpTracker(e[0], e[1], e[2]);

				_fluidHopup = $fluidHopup.fluidHopup({
					droplets: {
						colors: $colors,
						sizes: $sizes
					},
					productId: productId,
					containerWidth: self.options.containerWidth,
					currentThumb: _fluid.getCurrentThumb()
				});

				return false;
			}

			var adjustHeight = (self.adjustHeight = function(thisHeight) {
				//self.view.css('height', thisHeight);
			});

			var dropletsReference = (self.dropletsReference = function(
				droplets
			) {
				$colors = droplets.colors;
				$sizes = droplets.sizes;
			});

			var selectView = (self.selectView = function(id) {
				_fluid.fluidSelect(id, displayId);
			});

			//-
			return self.initialize();
		};
	} catch (e) {}
})(jQuery);
