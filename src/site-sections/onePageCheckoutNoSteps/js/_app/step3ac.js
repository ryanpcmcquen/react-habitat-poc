(function($) {
	try {
		//Define the plugin's name here
		var __name = "step3ac";
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

				switch (cnf) {
					case "tpl_createAccount":
						dig("#step3ACinfo").slideUp();

						dig("#step3ACform")
							.hide()
							.css("height", "auto")
							.htmlOverride(data)
							.slideDown();
						break;
					case "tpl_step3ac_info":
						dig("#step3ACinfo")
							.hide()
							.htmlOverride(data)
							.slideDown();
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

				//$('#step3form').hide();

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

				self.view.stepAccount_common();

				self.view.off("stepErrors").on("stepErrors", function(evt) {
					dig(".stepLoad").fadeOut(444);
				});

				//- On sidebar cart update events
				onCartUpdate();

				dig(".submitButton")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						dig("#createUserId #action").val("submit");
						$(window).trigger("methodRequest", [
							"submitForm",
							{
								obj: $(this),
								cnf: "createAccountHandler",
								form: "form#createUserId"
							}
						]);
					});
			}

			function killStyle(el) {
				el.removeAttr("style");
			}

			function onCartUpdate() {
				self.view.off("cartUpdate").on("cartUpdate", function(evt) {
					var tpl = [];
					switch (base.opc.config.form.current.step) {
						case "3ac":
							tpl.push("tpl_createAccount");
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
