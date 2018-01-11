(function($, window, document, undefined) {
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this,
				args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}
	var pluginName = "sltCarousel",
		defaults = {
			steps: "full",
			index: 0,
			scrollSpeed: 300
		};

	function Plugin(element, options) {
		this.element = element;
		var el = (this.el = $(element));

		this.settings = $.extend({}, defaults, this.settings, options);

		this._defaults = defaults;
		this._name = pluginName;
		this.dig = function(sbj) {
			return $(this.element).find(sbj);
		};
		this.init();
	}

	$.extend(Plugin.prototype, {
		init: function() {
			this.itemsContainer = this.dig(">.items");
			this.el.addClass(pluginName);

			var me = this;
			this.scroll = function() {
				var children = me.itms(),
					child,
					bound;
				for (var i = 0; i < children.length; i++) {
					child = $(children[i]);
					bound =
						child.offset().left - me.itemsContainer.offset().left;
					me.settings.index = i;
					if (bound >= 0) {
						break;
					}
				}
			};

			this.bindEvents();
			this.wrap();
			this.animate();
			setTimeout(this.checkWidth.bind(this), 0);
		},
		bindEvents: function() {
			this.dig(">.left").on("click", this.prev.bind(this));
			this.dig(">.right").on("click", this.next.bind(this));
			this.itemsContainer.on("scroll", debounce(this.scroll, 200));
			$(window).on("resize", this.checkWidth.bind(this));
		},
		checkWidth: function() {
			if (this.itms().length > 0) {
				if (!this.el.is(":visible")) {
					this.el.show();
					this.el.trigger("shown");
				}
				if (
					this.itemsContainer[0].scrollWidth ==
					this.itemsContainer[0].clientWidth
				) {
					this.el.addClass("hide-nav");
				} else {
					this.el.removeClass("hide-nav");
				}
			} else {
				this.el.hide();
				this.el.trigger("hidden");
			}
		},
		itms: function() {
			return this.itemsContainer.find(">.item");
		},
		animate: function() {
			var itms = this.itms();
			if (itms.length > 0) {
				if (!this.el.is(":visible")) {
					this.el.show();
					this.el.trigger("shown");
				}
				var pos = itms.eq(this.settings.index);
				pos = pos.offset().left - this.itemsContainer.offset().left;

				this.itemsContainer.stop(true, false);
				this.itemsContainer.animate(
					{
						scrollLeft: pos + this.itemsContainer.scrollLeft()
					},
					this.settings.scrollSpeed,
					debounce(this.scroll, 200, true)
				);
			} else {
				this.el.hide();
				this.el.trigger("hidden");
			}
		},
		wrap: function() {
			var cLen = this.itms().length;
			if (this.settings.index >= cLen) {
				this.settings.index = 0;
			}
			if (this.settings.index < 0) {
				index += cLen;
			}
		},
		next: function() {
			var R = Math.round;
			if (
				R(this.itemsContainer.scrollLeft()) +
					R(this.itemsContainer[0].clientWidth) >=
					R(this.itemsContainer[0].scrollWidth) ||
				this.settings.index + 1 >= this.itms().length
			) {
				this.settings.index = 0;
			} else {
				if (this.settings.steps == "full") {
					var children = this.itms(),
						child,
						bound;
					for (
						var i = this.settings.index + 1, l = children.length;
						i < l;
						i++
					) {
						child = $(children[i]);
						bound =
							child.offset().left -
							this.itemsContainer.offset().left +
							child.outerWidth();
						this.settings.index = i;
						if (bound > this.itemsContainer[0].clientWidth) {
							break;
						}
					}
				} else {
					this.settings.index += this.settings.steps;
				}
			}
			this.wrap();
			this.animate();
		},
		prev: function() {
			var children, bound, child, i;
			if (
				this.itemsContainer.scrollLeft() <= 0 ||
				this.settings.index <= 0
			) {
				children = this.itms();
				for (i = children.length - 1; i >= 0; i--) {
					child = $(children[i]);
					bound =
						child.offset().left -
						child.outerWidth() -
						this.itemsContainer.offset().left;
					this.settings.index = i;
					if (
						bound <
						this.itemsContainer[0].scrollWidth -
							this.itemsContainer[0].clientWidth
					) {
						break;
					}
				}
			} else {
				if (this.settings.steps == "full") {
					children = this.itms();
					for (i = this.settings.index - 1; i >= 0; i--) {
						child = $(children[i]);
						bound = child.offset().left;
						this.settings.index = i;
						if (
							bound <
							-this.itemsContainer[0].clientWidth +
								child.outerWidth()
						) {
							break;
						}
					}
				} else {
					this.settings.index -= this.settings.steps;
				}
			}
			this.wrap();
			this.animate();
		}
	});
	try {
		$.fn[pluginName] = function(options) {
			return this.each(function() {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(
						this,
						"plugin_" + pluginName,
						new Plugin(this, options)
					);
				}
			});
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery, window, document);
