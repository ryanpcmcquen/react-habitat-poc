(function($) {
	try {
		//Define the plugin's name here
		var __name = "step4_ppx";
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
				$(window).trigger("methodRequest", ["setStep", { step: 4 }]);

				jQuery("#step4load").slideUp(111);

				//jQuery('#step1form, #step2form, #step3form, #step3form').slideUp(500);
				// jQuery('#step2head, #step3head, #step3head').slideUp(500); // SLT-447

				jQuery("#step4form")
					.htmlOverride(data)
					.css({
						position: "static",
						top: 0,
						left: 0
					})
					.slideDown(500);

				//jQuery('.labeled:enabled:visible').showLabels();
				//jQuery('#editcart').addClass('hideThis');
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
					dig(".stepLoad").hide();
					dig("#step4form").show();
				});

				dig(".submitButton")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						//-
						$(".stepLoad").show();

						var fnFirstFromSubmit = function(data) {
							if (!base.fn.und(data)) {
								if (data.errors)
									return $(window).trigger("errors", [data]);
							}
							$(window).trigger("methodRequest", [
								"submitForm",
								{
									obj: $("#ssshipmethod"),
									cnf: "singleStep1p2",
									form: "#singleshipformid"
								}
							]);
						};

						//- If bad address from PayPal
						if ($("#paypalformid.paypalInvalidAddr").length) {
							var aValues = [];
							var aFormElemMap = {
								"#ssstate": "#shipAddressState"
							};

							//- get all input / select elements values
							$("#paypalformid")
								.find("input[id], select")
								.each(function() {
									var k = "#" + $(this).attr("id");
									aValues.push({
										key: base.fn.und(aFormElemMap[k])
											? k
											: aFormElemMap[k],
										val: $(this).val()
									});
								});
							$(window).trigger("methodRequest", [
								"passFormValues",
								{
									form: "#singleshipformid",
									values: aValues,
									after: fnFirstFromSubmit
								}
							]);
							return;
						}
						fnFirstFromSubmit();
					});
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
