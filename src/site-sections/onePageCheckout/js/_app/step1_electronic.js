(function($) {
	try {
		//Define the plugin's name here
		var __name = "step1_electronic";
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
			self.defaults = {};

			self.initialize = function() {
				// merging defaults with passed arguments
				self.options = $.extend({}, self.defaults, options);
				//-
				ignite();
				return self;
			};

			//-- Vars
			//-- ------------------------------------------------------
			var current = base.opc.config.form.current;
			var dig = function(sbj) {
				return self.view.find(sbj);
			};

			var success = function() {
				var cnf = self.options.cnf;
				var data = self.options.data;
				var cartUpdate = self.options.cartUpdate;
				var eScript = $(data).filter("script");
				!eScript.length || eval(eScript.text());

				//console.log(['step1_electronic data', data]);
				dig("#step1form")
					.htmlOverride(data)
					.slideDown();
				/*
			jQuery('#step1form').css({
				position: 'absolute',
				left: -9999
			});*/

				//jQuery('#shippingSubmit').click();
				//-
				bindEvents();
			};

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				//- Kill object first
				self.view[__name] = null;

				bindEvents();
			}

			function bindEvents() {
				$(window).trigger("methodRequest", [
					"formValuesRetained",
					{
						view: self.view,
						from: __name
					}
				]);

				self.view.off("stepErrors").on("stepErrors", function(evt) {
					dig(".stepLoad").fadeOut(444);
				});

				//- On sidebar cart update event
				onCartUpdate();

				dig(".submitButton")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						dig(".stepLoad").show();
						$(window).trigger("methodRequest", [
							"submitForm",
							{
								obj: $(this),
								cnf: "editHardgoodsMulti",
								form:
									"form#singleshipeditformid_" +
									$(this).attr("rel")
							}
						]);
					});
			}

			function onCartUpdate() {
				self.view.off("cartUpdate").on("cartUpdate", function(evt) {
					$(window).trigger("methodRequest", [
						"loadTemplate",
						{
							tpl: "tpl_single2_ppx",
							cartUpdate: true
						}
					]);
				});
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
