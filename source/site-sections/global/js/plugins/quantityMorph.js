/* Quantity Morph
** Turn quantity selects into text inputs when the user selects the 10+ option. Used on PDPs, checkout, etc.
** 
** Requires: shoppingCart.js
*/

(function($, window, document, undefined) {
	try {
		// Create the defaults once
		var pluginName = "quantityMorph",
			defaults = {
				changeOnVal: 10
			};

		// The actual plugin constructor
		function Plugin(element, options) {
			this.element = element;
			this.el = $(element);
			this.settings = $.extend({}, defaults, options);
			this._defaults = defaults;
			this._name = pluginName;
			this.dig = function(sbj) {
				return $(this.element).find(sbj);
			};
			this.init();
		}

		/***********************************
		 * PLUGIN LOGIC GOES HERE
		 ***********************************/
		$.extend(Plugin.prototype, {
			init: function() {
				this.bindEvents();
			},
			bindEvents: function() {
				//$( this.element );
				var me = this;
				var selectInput = me.el;
				var changeOnVal = me.settings.changeOnVal;

				//morph input if => to the morph value
				if (selectInput.val() >= changeOnVal) {
					me.morphInput(false);
				}
				//handle change
				selectInput.on("change", function(event) {
					var val = this.value;
					//update the backend with the new value
					//in shoppingcart.js

					$(window).trigger("quantityMorphChange", this);
					//$("#updateItemQty").trigger('click');
					//updateItemQtyFromCart(this.id);

					//morph field when the value equals the morph val
					if (val == changeOnVal) {
						me.morphInput(true);
					}
				});
			},
			bindInputEvent: function(input) {
				var me = this;

				input.on("change", function(event) {
					//update the backend with the new value
					//in shoppingcart.js

					$(window).trigger("quantityMorphChange", this);
					//$("#updateItemQty").trigger('click');
					//updateItemQtyFromCart($(this).attr("id"));
				});
			},
			morphInput: function(focus) {
				var me = this;
				var selectInput = me.el;
				var attributes = selectInput.prop("attributes");
				var input = $(document.createElement("input"));
				var changeOnVal = me.settings.changeOnVal;

				//only work on <select> tags
				if (!selectInput.is("select")) {
					return;
				}

				// loop through <select> attributes and apply them on new input
				$.each(attributes, function() {
					input.attr(this.name, this.value);
				});

				//add type
				input.attr("type", "text");
				input.val(selectInput.val());

				//add input to the page
				selectInput.after(input);

				//Remove <select> and use .detach() in case we want to reinsert in the future
				selectInput.detach();

				//set events
				me.bindInputEvent(input);

				//focus on input field after transformation
				if (focus) {
					input.focus();
				}

				$(input).keydown(function(event) {
					if (event.keyCode == 13) {
						event.preventDefault();
						$(event.target).blur();
						return false;
					}
				});
			}
		});

		/***********************************
		 * END PLUGIN LOGIC
		 ***********************************/

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
