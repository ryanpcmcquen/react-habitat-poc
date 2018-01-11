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
				dig("#step3form").one("htmlOverride.done", function() {
					$(window).trigger("step3FinalLoaded");
				});

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
				var fromPaypal =
					$("#opcGoToStep3").attr("data-opcGoToStep3") == "true"
						? true
						: false; //a.k.a "coming from paypal"

				if (fromPaypal) {
					$(".continue").show();
				}

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

				//set in both step1.js and step3.js
				$(".orderSubmitPlaceOrderBtn")
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

				//HANDLE CONFIRM ORDER CLICK 4/26/2016 -TF
				$("#reviewOrderBtn")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						global_showMask("Processing Order");

						//mirror email address to all fields
						if ($("#ereceiptAddr1").val() == "") {
							$("#ereceiptAddr1").val(
								$("#ereceiptAddr1Top").val()
							);
							$("#ereceiptAddr2").val(
								$("#ereceiptAddr1Top").val()
							);
						}

						$("input#ppMethodId3").click();

						//handle event when step1 is done - 4/26/2016 TF
						$(window).one("singleStep1_Finshed", function() {
							//update cart
							$("#cartsummary").trigger("cartForceUpdate");
							//TRIGGER STEP2 - Payment submit
							console.log("submit payment");
							setTimeout(function() {
								$("#paymentSubmit").click();
							}, 300);
						});

						//trigger original steps for checkout. Subsequent steps are triggered in order.
						$("#shippingSubmit").click();

						/*
                     $('html, body').animate({
				        scrollTop: $("div.toptitle").offset().top
				     }, 500);
				     */
					});

				dig("#addGiftCardSubmit")
					.unbind("click")
					.on("click", function(evt) {
						console.log("fire 1");
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
							tpl.push("tpl_order_confirmation_final");
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
