(function($) {
	try {
		//Define the plugin's name here
		var __name = "step3_ppx";
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
			var _common;

			var success = function() {
				var cnf = self.options.cnf;
				var data = self.options.data;
				var cartUpdate = self.options.cartUpdate;
				var eScript = $(data).filter("script");
				!eScript.length || eval(eScript.text());
				//console.log(['step3 ppx data', data]);
				switch (cnf) {
					case "tpl_step3_ppx":
						dig("#step3form")
							.htmlOverride(data)
							.slideDown(function() {
								//$(window).trigger('methodRequest', ['InitStep2']);
								//$(window).trigger('methodRequest', ['loadTemplate', {tpl : 'getTotals'}]);
								//handleTotalSatisfied('editStep2');
							});
						break;
				}

				//-
				bindEvents();
			};

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				//- Kill object first
				self.view[__name] = null;

				self.options.success ? success() : bindEvents();
			}

			function bindEvents() {
				_common = self.view.stepPayment_common();

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
			}

			function onCartUpdate() {
				self.view.off("cartUpdate").on("cartUpdate", function(evt) {
					var tpl = [];
					tpl.push("tpl_step3_ppx");
					!_common.giftCardApplied || tpl.push("paymentAddGiftCard");
					$(window).trigger("methodRequest", [
						"loadTemplate",
						{
							tpl: tpl,
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
