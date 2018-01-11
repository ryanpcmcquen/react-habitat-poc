(function($) {
	try {
		//Define the plugin's name here
		var __name = "fluidHopup";
		//--
		$.fn[__name] = function(options) {
			//-- Plugin gymnastics - Part 1/3
			//-- ------------------------------------------------------
			var self = this; // prevent from loosing the scope
			self.view = $(this);
			self.view.data(__name, self); // store the plugin instance into the element
			//-- ------------------------------------------------------

			//-- init
			//-- ------------------------------------------------------
			self.defaults = {
				productId: 0,
				currentThumb: 0,
				droplets: {
					colors: null,
					sizes: null
				},
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
			var productId;

			var f = function(s) {
					return self.view.find(s);
				},
				_gatrackr = PDPTracking.ga,
				$app,
				currentThumb,
				_fluid,
				_color,
				_size,
				$win = $(window);

			//-- Start
			//-- ------------------------------------------------------
			function ignite() {
				productId = self.options.productId;
				currentThumb = self.options.currentThumb;

				$app = self.view.find('[data-app="' + __name + '"]');

				self.view.css({
					left:
						parseInt(
							self.options.containerWidth / 2 -
								Number(self.view.outerWidth()) / 2
						) + "px"
				});

				window.setTimeout(function() {
					self.view.show().scroll2({
						padding: 40
					});
				}, 100);

				if ($app.html().trim() != "") return selectDefault();

				setTimeout(function() {
					_fluid = $app.fluid({
						productId: productId,
						viewId: "hopup",
						loadCallback: function() {
							setTimeout(buildInterface, 100);
						},
						css: "width: auto; height: auto;"
					});
				}, 300);

				return self;
			}

			function buildInterface() {
				f('[class*="iconbutton"]').wrapAll(
					'<div id="iconbuttonContainer" class="controls"/>'
				);

				f("#iconbuttonContainer").before(
					'<div id="colorssizesContainer" class="controls"></div>'
				);

				f("#colorssizesContainer")
					.append(self.options.droplets.colors)
					.append(self.options.droplets.sizes);

				bindEvents();
				selectDefault();
			}

			function selectDefault() {
				$app
					.find(
						".fluid-display-imagegroup > a:eq(" +
							currentThumb +
							") img"
					)
					.trigger("click");
				return self;
			}

			function bindEvents() {
				f("span.product-close")
					.click(function() {
						//- Google Analytics Tracking
						var e = _gatrackr.fluid.popupclose;
						pdpTracker(e[0], e[1], e[2]);

						//$app.empty();
						self.view.hide();
					})
					.show();

				_color = f(".product-optionsColor").droplets({
					type: "color",
					callback: function($droplet) {
						var skuId = $droplet.attr("data-sku");
						activate(skuId, "size");
					}
				});

				var currentColorSkuId = _color.getCurrentSku();

				_size = f(".product-optionsSize").droplets({
					type: "size",
					callback: function($droplet) {
						var skuId = $droplet.attr("data-sku");
						activate(skuId, "color");
					}
				});

				var currentSizeSkuId = _size.getCurrentSku();
			}

			function activate(skuId, which) {
				switch (which) {
					case "size":
						_size.activate(skuId);
						break;
					case "color":
						_color.activate(skuId);
						break;
				}
				_fluid.selectView(skuId);
			}

			//-
			return self.initialize();
		};
	} catch (e) {}
})(jQuery);
