(function($) {
	try {
		//Define the plugin's name here
		var __name = "step3";
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
			var dig = function(sbj) {
				return self.view.find(sbj);
			};

			var success = function() {
				var cnf = self.options.cnf;
				var data = self.options.data;
				var cartUpdate = self.options.cartUpdate;
				var eScript = $(data).filter("script");
				!eScript.length || eval(eScript.text());
				$(window).trigger("methodRequest", ["setStep", { step: 3 }]);

				$(window).trigger("methodRequest", [
					"collapseSteps",
					{
						steps: ["#step1form", "#step2form"]
					}
				]);

				//jQuery('#step2head').text('Step 2 of 3: Your payment is...')
				//jQuery('#step2head .editLink').show();
				//jQuery('#step2head span.label').hide();

				dig("#step3form")
					.htmlOverride(data)
					.css({
						position: "static",
						top: 0,
						left: 0
					})
					.slideDown(500);
				dig("#step3head")
					.removeClass("bgbottom")
					.addClass("bgcenter");

				//jQuery('.labeled:enabled:visible').showLabels();
				$("#editcart").addClass("hideThis");

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
								cnf: "moveToOrderCommit",
								form: "form#commitOrderForm"
							}
						]);
					});

				dig("#addGiftCardSubmit")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						var validGiftCardCount = $(this).attr("rel");
						$(window).trigger("methodRequest", [
							"submitForm",
							{
								obj: $(this),
								cnf: "paymentAddGiftCard",
								form:
									"form#paymentFormGiftCardsId_" +
									validGiftCardCount
							}
						]);
					});
			}

			function onCartUpdate() {
				self.view.off("cartUpdate").on("cartUpdate", function(evt) {
					var tpl = [];
					switch (base.opc.config.form.current.step) {
						case "3":
							tpl.push("tpl_order_confirmation");
							break;
					}
					!tpl.length ||
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
