// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
(function($, window, document, undefined) {
	try {
		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "footer",
			defaults = {
				propertyName: "value"
			};

		// The actual plugin constructor
		function Plugin(element, options) {
			this.element = element;
			this.el = $(element);

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend({}, defaults, options);
			this._defaults = defaults;
			this._name = pluginName;
			// create shortcut for searching faster within the element
			this.dig = function(selector) {
				return $(this.element).find(selector);
			};
			this.init();
		}

		/***********************************
		 * PLUGIN LOGIC GOES HERE
		 ***********************************/
		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
			init: function() {
				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like the example below
				this.bindEvents();
				this.yourOtherFunction();
			},
			bindEvents: function() {
				$(document).ready(function() {
					$("#footerReturnPolicyPopup").jqm({
						overlay: 50,
						trigger: "a#footerReturnPolicy",
						closeClass: "popupclose",
						modal: false,
						onShow: myOpenGIF,
						onHide: myCloseGIF
					});

					$("#footerShippingPopup").jqm({
						overlay: 50,
						trigger: "a#footerShippingInformation",
						closeClass: "popupclose",
						modal: false,
						onShow: myOpenGIF,
						onHide: myCloseGIF
					});
				});
			},
			yourOtherFunction: function() {}
		});

		/***********************************
		 * END PLUGIN LOGIC
		 ***********************************/

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
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
