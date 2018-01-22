(function($) {
	try {
		//Define the plugin's name here
		var __name = "step2";
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
				try {
					!eScript.length || eval(eScript.text());
				} catch (e) {
					console.error("step2 success eval error", e);
				}

				switch (cnf) {
					case "tpl_step2":
						$(window).trigger("methodRequest", [
							"setStep",
							{ step: 2 }
						]);
						$(window).trigger("methodRequest", [
							"editLinkAnimate",
							{
								step: "1",
								action: "show"
							}
						]);

						$(window).trigger("methodRequest", [
							"editLinkAnimate",
							{
								step: "2",
								action: "hide"
							}
						]);

						//- collapse steps
						var aCollapseSteps = [
							"#step3ACform",
							"#step3form",
							"#step2info"
						];
						if (!base.fn.und(_common))
							_common.giftCardApplied ||
								aCollapseSteps.push("#step2load");
						$(window).trigger("methodRequest", [
							"collapseSteps",
							{
								steps: aCollapseSteps
							}
						]);

						dig("#step2form")
							.htmlOverride(data)
							.slideDown(500, function() {
								$(this).css("height", "auto");

								/*
						if ( base.opc.config.form.totalSatisfied === true && orderTotal == 0 ) {
							jQuery('#paymentSubmit').click();
						} else {

							//jQuery('.labeled:enabled:visible').showLabels();

							if (jQuery.browser.safari) {
								jQuery('[id="ccstate"]').css('top','0px');
							} else if (jQuery.browser.mozilla) {
								jQuery('[id="ccstate"]').css({'top':'0px','padding-top':'3px'});
							} else if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 7) {
								jQuery('[id="ccstate"]').css({'top':'0px', 'height':'23px', 'font-size':'14px'});
							} else if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 8) {
								jQuery('[id="ccstate"]').css({'top':'2px','height':'23px'});
							} else if (jQuery.browser.msie) {
								jQuery('[id="ccstate"]').css('top','-1px');
							}
						}*/

								//-
								bindEvents();
							});
						//jQuery('#editcart').addClass('hideThis');
						/*
					if(!cartUpdate) {
						//console.log('tpl_step2');
					}
					else {

						var eForm = dig('#step2form').htmlOverride(data);
						dig('#step2info').slideUp();
					}*/

						self.view.scroll2();
						break;
					case "tpl_step2_sum":
						$(window).trigger("methodRequest", [
							"loadTemplate",
							{
								tpl: "tpl_step2_silent_form_load"
							}
						]);

						//jQuery('#step2head').text('Step 2 of 3: Your payment is...');

						$(window).trigger("methodRequest", [
							"editLinkAnimate",
							{
								step: "2",
								action: "show"
							}
						]);
						//jQuery('#step2head .editLink').show();
						//jQuery('#step2head span.label').hide();

						$(window).trigger("methodRequest", [
							"collapseSteps",
							{
								steps: ["#step2form", "#step2load"]
							}
						]);
						jQuery("#step3bottom").show();
						jQuery("#step2info")
							.htmlOverride(data)
							.slideDown(500);

						//jQuery('.labeled:enabled:visible').showLabels();
						jQuery("#editcart").addClass("hideThis");

						// check for existence if #ppemail which displays the paypal email for actor
						var ifppEmail = jQuery("#ppemail").length;
						// if exists check the html. if blank revert to default payment method
						if (ifppEmail > 0) {
							var checkIfCancelled = jQuery("#ppemail").html();
							if (checkIfCancelled === "") {
								jQuery("#editStep2").on("click", function() {
									if (
										jQuery(
											"input[name=ppMethod]:checked"
										).val() == "creditCard"
									) {
										jQuery(".ppMethodRadioContent").show();
										jQuery("input[name=ppMethod]").selected(
											"selected"
										);
									} else {
										$(window).trigger("methodRequest", [
											"loadTemplate",
											{ tpl: "tpl_step2" }
										]);
									}

									jQuery("#step2head").text(
										"Step two of three: Payment Method"
									);

									jQuery(
										"#step3form," +
											"#step2summary," +
											"#step3bottom"
									)
										.html("")
										.hide();

									jQuery("#step3head")
										.addClass("bgbottom")
										.removeClass("bgcenter");

									jQuery("#step2form").css({
										position: "static",
										left: "0",
										top: "0"
									});
									//jQuery('.labeled:enabled:visible').showLabels();

									jQuery("#ppErrorMessage").show();
								});

								jQuery("#editStep2").trigger("click");
							}
						}

						//-
						bindEvents();
						break;
					case "paymentSubmit":
						//-
						bindEvents();
						break;
					case "createAccountHandler":
						//console.log(['createAccountHandler data', data]);
						dig("#step2info").slideUp(666);
						dig("#step2form")
							.removeAttr("style")
							.hide()
							.stop()
							.slideDown(500, function() {
								//$('.editLink[rel="2"]').hide().siblings('.label').show();
								$(window).trigger("methodRequest", [
									"editLinkAnimate",
									{
										step: "2",
										action: "hide"
									}
								]);

								//-
								bindEvents();

								$(window).trigger("errors", [
									data,
									base.opc.config.form.current.id
								]);
								//handleErrors(data, base.opc.config.form.current.id);
							});
						break;
				}
			};

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				//- Kill object first
				self.view[__name] = null;

				self.options.success ? success() : bindEvents();
			}

			function onCartUpdate() {
				self.view.off("cartUpdate").on("cartUpdate", function(evt) {
					var tpl = [];
					switch (base.opc.config.form.current.step) {
						case "2":
							!_common.giftCardApplied ||
								(function() {
									dig("#step2load").show();
									tpl.push("paymentAddGiftCard");
								})();
							tpl.push("tpl_step2_oncartUpdate");
							break;
						case "3":
						case "3ac":
						case "4":
							tpl.push("tpl_step2_oncartUpdate");
							tpl.push("tpl_step2_sum");
							break;
					}
					!tpl.length ||
						$(window).trigger("methodRequest", [
							"retainFormValues",
							{
								callback: function() {
									$(window).trigger("methodRequest", [
										"loadTemplate",
										{
											tpl: tpl,
											cartUpdate: true
										}
									]);
								}
							}
						]);
				});
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

				//- Edit links for shipping and payment
				dig(".editLink")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();

						$(window).trigger("methodRequest", [
							"editLinkAction",
							{
								step: $(this).attr("rel"),
								tpl: "tpl_step2",
								collapseSteps: [
									"#step2info",
									"#step3load",
									"#step3form",
									"#step3ACform",
									"#step3ACinfo"
								]
							}
						]);
					});

				dig(".submitButton")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();

						var whichPaymentMethodVal = $(
							"input[name=ppMethod]:checked"
						).val();
						dig("#whichPaymentMethod").val(whichPaymentMethodVal);

						dig(".stepLoad").show();

						$(window).trigger("methodRequest", [
							"submitForm",
							{
								obj: $(this),
								cnf: "paymentSubmit",
								form: "form#paymentFormId"
							}
						]);
					});

				// Set initial array to determine which radio buttons have been clicked.
				var ppMethodClicks = new Array();
				ppMethodClicks[0] = 0;

				dig('input[name="ppMethod"]')
					.unbind("click")
					.on("click", function() {
						//		if (ppMethodClicks[ppMethodClicks.length-1] != $(this).val()) {
						var radSel = $(this).attr("id");
						paymentTypeRoutine(radSel);
						$(this).blur();
						//		}
						$(window).trigger("methodRequest", [
							"clearAllErrors",
							{}
						]);
						ppMethodClicks.push($(this).val());
					});

				// IE fix for no selection
				dig(".noselect").on("selectstart", function() {
					return false;
				});

				dig("#saveCCaddr input[type=checkbox]")
					.unbind("change")
					.on("change", function(e) {
						if ($(this).is(":checked")) {
							dig("#saveCreditInformation").val("true");
						} else {
							dig("#saveCreditInformation").val("false");
						}
						e.stopPropagation();
					});

				dig("a.editvcardgiftmsg")
					.show()
					.unbind("click")
					.on("click", function(e) {
						e.preventDefault();
						e.stopPropagation();

						dig("div.editvcardgiftmsg").toggle();

						if ($("div.editvcardgiftmsg").is(":visible")) {
							$(this).hide(); //text('save gift message');
						} else {
							$(this).text("edit gift message");
						}
					});

				dig("#opcEmailSignup").on("click change", function(e) {
					if ($(this).is(":checked")) {
						dig("#opcEmailSignupHidden").val("true");
					} else {
						dig("#opcEmailSignupHidden").val("false");
					}
				});

				if (dig(".giftoptions.left").length > 0) {
					dig(".giftoptions.left>ul>li").each(function() {
						var lineHeight = parseInt(
							$(this).css("lineHeight"),
							10
						);
						while ($(this).height() > lineHeight) {
							elem = $(this);
							while (elem.children().size() > 0) {
								elem = dig(elem).children(":first");
							}

							var txt = elem.text();
							elem.text(txt.substr(0, txt.length - 5) + " ...");
						}
					});

					dig("#giftopt1").hide();
				}

				paymentTypeRoutine(
					dig('input[name="ppMethod"]')
						.filter(function() {
							return $(this).is(":checked");
						})
						.attr("id")
				);

				self.options.cnf == "tpl_step2_sum" || _common.bindCCMasks();
			}

			function killStyle(el) {
				el.removeAttr("style");
			}

			function paymentTypeRoutine(radSel) {
				killStyle(dig("#step2form"));

				if (radSel == "ppMethodId3") {
					dig("#cc_form").removeClass("PPMethodInitial");
				} else {
					dig("#cc_form").addClass("PPMethodInitial");
				}
				dig("#paymentSubmit span").removeClass(
					"checkout-paypal-button"
				);
				if (radSel == "ppMethodId1") {
					dig("#paymentSubmit span").text(
						"Continue to Bill Me Later"
					);
				} else if (radSel == "ppMethodId2") {
					dig("#paymentSubmit span")
						.text("Continue to PayPal")
						.addClass("checkout-paypal-button");
				} else {
					dig("#paymentSubmit span").text("Preview Order");
				}
				if (radSel != "ppMethodId2") {
					dig("#" + radSel)
						.parent(".ppMethodRadio")
						.next(".ppMethodRadioContent")
						.slideDown(666);
				} else dig(".ppMethodRadioContent").slideUp("slow");
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
