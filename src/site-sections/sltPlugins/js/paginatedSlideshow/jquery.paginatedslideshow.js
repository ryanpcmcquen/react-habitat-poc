(function($, window, document, undefined) {
	try {
		var pluginName = "paginateSlideshow",
			defaults = {
				transitionSpeed: 4000,
				delayTime: 8000 //only is here so _defaults shows it
			};

		function Plugin(element, options) {
			this.element = element;
			this.el = $(element);

			this.settings = {};
			//this already takes into account the defaults, so it can go after them.
			this.settings.transitionSpeed =
				parseFloat(this.el.attr("data-transition-speed")) ||
				defaults.transitionSpeed;
			this.settings.delayTime =
				parseFloat(this.el.attr("data-delay-time")) ||
				this.settings.transitionSpeed * 2;

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
				this.currentSlide = -1;
				this.slides = this.dig("input[type='radio'][name='slide']");
				this.current = this.next = this.timeout = null;

				this.move = this.moveThroughSlideshow.bind(this);
				this.bindEvents();
				//if no slide was checked, set the active slide to 0
				if (this.currentSlide == -1) {
					this.currentSlide = 0;
					this.slides.first().prop("checked", true);
				}
				this.timeout = setTimeout(
					this.move,
					this.settings.transitionSpeed
				); //starts later
			},
			bindEvents: function() {
				var me = this;
				me.slides.each(function(index) {
					var slide = $(this);
					//get first checked slide
					if (me.currentSlide == -1 && slide.prop("checked")) {
						//seet starting position to this slide if it's the first one checked
						me.currentSlide = index;
					}

					function setSlideshowPosition() {
						me.currentSlide = index;
						clearTimeout(me.timeout);
						//Start automated slideshow after [delayTime]
						me.timeout = setTimeout(me.move, me.settings.delayTime);
					} //dmeagher
					me
						.dig("label[for='" + slide.attr("id") + "']")
						.click(setSlideshowPosition);
					slide.click(setSlideshowPosition);
				});
			},
			moveThroughSlideshow: function() {
				this.current = $(this.slides[this.currentSlide]);
				this.current.prop("checked", false);
				//requires there be a label.next in the slideshow-item
				this.next = this.current.next().find("label.next");
				//should be a shallow dig
				this.current = this.dig(">#" + this.next.attr("for")).prop(
					"checked",
					true
				); //only look for this id in the slideshow element
				this.currentSlide = this.slides.index(this.current);
				clearTimeout(this.timeout);
				this.timeout = setTimeout(
					this.move,
					this.settings.transitionSpeed
				);
			}
		});

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
