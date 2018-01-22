(function($) {
	try {
		//Define the plugin's name here
		var __name = "stepPayment_common";
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
			var sCurrentCCMask = "common";

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				//- Kill object first
				self.view[__name] = null;

				self.giftCardApplied = false;
				bindEvents();
			}

			function bindEvents() {
				self.view
					.off("methodRequest")
					.on("methodRequest", function(evt, method, args) {
						//console.log('methodRequest stepPayment_common ' + method);
						if (!base.fn.und(self[method]))
							return self[method](base.fn.und(args) ? {} : args);
					});

				self.view
					.off("reGetStep2Totals")
					.on("reGetStep2Totals", function(evt) {
						reGetStep2Totals();
					});

				self.view
					.off("handleTotalSatisfied")
					.on("handleTotalSatisfied", function(evt, args) {
						handleTotalSatisfied(args);
					});

				self.view
					.off("setGiftCardEvents")
					.on("setGiftCardEvents", function(evt, data) {
						dig("div#giftcardspay").htmlOverride(data);
						setGiftCardEvents();
					});

				/*
			 * Sold to address dropdown
			 */
				dig("#soldToAddrDropdown")
					.unbind("change poke")
					.on("change poke", function() {
						dig("#saveCCaddr").hide();
						dig(".useShipAddrChk").prop("checked", false);

						var elm = dig(
							'input[type="text"], select:not(.opcTableFieldOperation)'
						);
						elm.removeClass("disabled").prop("disabled", false);

						if ($(this).val() == "") {
							return elm.val("");
						}
						$(window).trigger("methodRequest", [
							"autoFillAddress",
							{
								elm: $(this),
								isCCform: true,
								disable: false
							}
						]);
					});

				dig("#opcEmailSignup").on("click change", function(e) {
					if ($(this).is(":checked")) {
						dig("#opcEmailSignupHidden").val("true");
					} else {
						dig("#opcEmailSignupHidden").val("false");
					}
				});

				dig(".useShipAddrChk")
					.unbind("change poke")
					.on("change poke", function(e) {
						//console.log('change poke: ' + $(this).is(':checked'));
						if ($(this).is(":checked")) {
							useShippingAddress();
						} else {
							$(this).prop("checked", false);
							enableShippingCCAddrForm();
						}
					});

				dig("#creditCardAddrDropdown")
					.unbind("change poke")
					.on("change poke", function(evt) {
						var ccDDL = $(this);

						var a =
							base.opc.config.form.addresses[
								"cc" + $(this).val()
							];
						dig("#saveCCaddr .save").hide();
						dig("#saveCCaddr .new").show();

						base.fn.und(a) ||
							(function() {
								dig("#saveCCaddr .save").show();
								dig("#saveCCaddr .new").hide();
								dig("#isUseShippingAddress").prop(
									"checked",
									false
								);
								enableShippingCCAddrForm();
								//-
								$.each(a, function(k, v) {
									dig("#" + k).val(v);
								});
								//- apply mask
								bindCCMasks(); //dig('#creditCardNumberT').focus().blur();
							})();

						if (ccDDL.val() == "new") {
							dig("#saveCCaddr")
								.find("span:first")
								.text("Save new credit card");
							dig("#saveCCaddr").show();
							dig("#ccBillAddrId").val("");
						} else if (ccDDL.val() != "") {
							dig("#saveCCaddr")
								.find("span:first")
								.text("Save changes to credit card");
							dig("#saveCCaddr").show();
							dig("#ccBillAddrId").val(ccDDL.val());
						} else {
							dig("#saveCCaddr").show();
							dig("#ccBillAddrId").val("");
						}

						ccDDL = null;
					});

				dig("#ereceiptAddr2")
					.unbind("keydown keyup keypress focus blur")
					.on("keydown keyup keypress focus blur", function() {
						dig("#loginEmailAddress").val($(this).val());
					});

				dig("div.editvcardgiftmsg").hide();

				//-
				setGiftCardEvents();
				commonPaymentChecks();
				handleTotalSatisfied();
			}

			var bindCCMasks = (self.bindCCMasks = function() {
				/* @advanced masking rules 
			------------------------------------------------------------------------ */
				var eCC = dig("input.mask-cc");
				var eCCNum = dig("#creditCardNumber");
				var ePin = dig("#creditCardPin");
				var eCCLogos = dig("#sprite-cc");

				var aCommonMask = {
					cc: {
						mask: "9999-9999-9999-9999",
						placeholder: "xxxx-xxxx-xxxx-xxxx",
						translation: {
							9: {
								pattern: /[0-9-]/
							}
						}
					},
					pin: {
						mask: "999",
						placeholder: "xxx"
					}
				};
				var aMasks = {
					common: {
						cc: aCommonMask.cc,
						pin: aCommonMask.pin
					}
				};
				aMasks["visa"] = {
					cc: aMasks.common.cc,
					pin: aMasks.common.pin,
					rgx: /^4/
				};
				aMasks["mastercard"] = {
					cc: aMasks.common.cc,
					pin: aMasks.common.pin,
					rgx: /^5[1-5]/
				};
				aMasks["discover"] = {
					cc: aMasks.common.cc,
					pin: aMasks.common.pin,
					rgx: /^6/
				};
				aMasks["amex"] = {
					cc: {
						mask: "9999-999999-99999",
						placeholder: "xxxx-xxxxxx-xxxxx",
						translation: aMasks.common.cc.translation
					},
					pin: {
						mask: "9999",
						placeholder: "xxxx"
					},
					rgx: /^3[47]/
				};
				var opt = {
					placeholder: "x"
				};
				var sCCType = "";
				var fnCCType = function(val) {
					var type = "";
					$.each(aMasks, function(k, v) {
						if (!base.fn.und(v.rgx)) {
							var r = new RegExp(v.rgx);
							if (r.test(val)) type = k;
						}
					});
					return type == "" ? "common" : type;
				};
				var fnCC = function(mask) {
					var a = aMasks[mask];
					ePin.mask(a.pin.mask, {
						//placeholder : a.pin.placeholder
					});
					eCC.mask(a.cc.mask, {
						//placeholder : a.cc.placeholder,
						translation: a.cc.translation
					});
				};
				var fnOnlyDigits = function(val) {
					return base.fn.und(val)
						? ""
						: val.replace(/-/g, "").replace(/x/g, "");
				};

				var fnCCHasVal = function(val) {
					var n = fnOnlyDigits(val);
					eCCNum.val(n);
					sCCType = fnCCType(n);
					return sCCType == ""
						? false
						: (function() {
								if (sCCType != sCurrentCCMask) {
									sCurrentCCMask = sCCType;
									eCCLogos
										.removeAttr("class")
										.addClass(sCCType);
									fnCC(sCCType);
									return true;
								}
								return false;
							})();
				};

				var fnApplyXXX = function(val) {
					var sCCNumber = fnOnlyDigits(val);
					eCCNum.val(sCCNumber);
					//-
					var cc = aMasks[sCurrentCCMask].cc;
					var l = (function() {
						var a = cc.mask.split("-");
						return parseInt(a[a.length - 1].length);
					})();
					if (sCCNumber != "")
						setTimeout(function() {
							eCC.val(
								cc.placeholder.substr(
									0,
									cc.placeholder.length - l
								) + sCCNumber.substr(sCCNumber.length - l, l)
							);
						}, 111);
				};

				//- input events
				eCC.off("blur").on("blur", function(evt) {
					$(this).unmask();
					fnApplyXXX($(this).val());
				});

				eCC.off("focus").on("focus", function(evt) {
					$(this).val(eCCNum.val());
					fnCC(sCurrentCCMask);
				});

				eCC.off("keyup").on("keyup", function(evt) {
					fnCCHasVal($(this).val());
				});

				//- if CC has value, find proper mask
				if (eCCNum.val() != "") {
					fnCCHasVal(eCCNum.val());
					sCurrentCCMask = fnCCType(eCCNum.val());
					fnApplyXXX(eCCNum.val());
				}
			});

			function commonPaymentChecks() {
				var eForm = dig("#step2form");

				if (eForm.find("#ppMethodId3").is(":checked"))
					eForm.find(".ppMethodRadioContent").css("display", "block");
				if (eForm.find("#isUseShippingAddress").is(":checked"))
					useShippingAddress();
			}

			function enableShippingCCAddrForm() {
				dig(".isUseShippingAddress").val("false");
				dig("#ccAddrId").val("");
				dig(
					"#ccfirstName," +
						"#cclastName," +
						"#ccaddress1," +
						"#ccaddress2," +
						"#cccity," +
						"#ccstate," +
						"#ccpostalCode," +
						"#ccphoneNumber"
				).prop("disabled", false);
			}

			function useShippingAddress() {
				var map = {
					"#ccAddrId": "#singleshipformid .savedAddresses select",
					"#ccfirstName": "#ssfname",
					"#cclastName": "#sslname",
					"#ccaddress1": "#ssaddr1",
					"#ccaddress2": "#ssaddr2",
					"#cccity": "#sscity",
					"#ccstate": "#ssstate",
					"#ccpostalCode": "#sszip",
					"#ccphoneNumber": "#ssphone",
					"#ccfirstName2": "#ssfname",
					"#cclastName2": "#sslname",
					"#ccaddress12": "#ssaddr1",
					"#ccaddress22": "#ssaddr2",
					"#cccity2": "#sscity",
					"#ccstate2": "#ssstate",
					"#ccpostalCode2": "#sszip",
					"#ccphoneNumber2": "#ssphone"
				};

				$(".useShipAddrChk")
					.prop("checked", true)
					.parents(".addrform")
					.first()
					.find(".errMissed")
					.removeClass("errMissed");
				$(".isUseShippingAddress").val("true");

				$(
					"#ccfirstName," +
						"#cclastName," +
						"#ccaddress1," +
						"#ccaddress2," +
						"#cccity," +
						"#ccstate," +
						"#ccpostalCode," +
						"#ccphoneNumber"
				)
					.removeClass("empty")
					.prop("disabled", true);

				//- investigated deeply, still not sure why, upon cart update, this timeout is necessary for values to carry over...
				setTimeout(function() {
					$.each(map, function(k, v) {
						dig(k).val($(v).val());
					});
				}, 1);
			}

			function reGetStep2Totals() {
				//console.log('reGetStep2Totals');
				//var current = base.opc.config.form.current;
				$(window).trigger("methodRequest", [
					"loadTemplate",
					{
						tpl: "tpl_promo_sum"
					}
				]); /*
				loadTemplate('tpl_promo_sum');
			}
			if (current.step == '2') { // Normal OPC

				//console.log('reGetStep2Totals');
				/*
				loadTemplate('tpl_cart',{
					data: {
						currentStep: 2
					},
					callback: function(){
						//loadTemplate('tpl_promo_sum');
					}
				});*/ /*
				loadTemplate('tpl_promo_sum');
			}*/
				/*
			if (current.step == '1') { // PayPal Express - Made its own so can modify w/o affecting Normal OPC
				/*
				loadTemplate('tpl_cart',{
					data: {
						currentStep:  2
					},
					callback: function(){
						loadTemplate('tpl_promo_sum');
					}
				});*/
			}

			var handleTotalSatisfied = (self.handleTotalSatisfied = function(
				args
			) {
				if (base.opc.config.form.totalSatisfied == true) {
					dig("#ccFormBox").attr(
						"data-gutter-toggle",
						"soldToHoverMessage"
					);

					dig("#giftCardsModule .gcform,.ccform").hide();

					dig("#cc_form .addrform h6").hide();
					dig("#shipToShipAddr,#soldToParagraph").show();

					dig("#cc_form")
						.children("h3:first")
						.html(
							'Sold to (Enter Name &amp; Address) <a href="#" class="soldto"><span class="note inline">(Why do we need this?)</span></a>'
						);

					$("#soldto").remove();
					$("body").append(
						$(
							'<div id="soldto" class="jqmWindow jqm-init">' +
								"<h6>“Sold To” Address</h6>" +
								"<p>For technical reasons, all orders require a physical address associated with them. We won’t use it to add you to any mailing lists.</p>" +
								'<p><a href="#" class="button reverse right cartpopupclose"><span>Close</span></a></p>' +
								"</div>"
						)
					);

					soldToHandler();

					dig("#creditcardHoverMessage").addClass("noCC");

					dig("#savedSoldToAddresses").removeClass("hideThis");
					dig("#creditCardAddresses").addClass("hideThis");

					if (!dig("#ppMethodId3").prop("checked")) {
						dig("#ppMethodId3").trigger("click");
					}
					dig(".ppMethodRadio").hide(); //.addClass('hideThis');

					dig(
						"#creditcardHoverMessage1,#soldToHoverMessage"
					).removeClass("focused");
					dig(
						"#creditcardHoverMessage1,#soldToHoverMessage"
					).removeClass("hovered");
					dig("#creditcardHoverMessage1,#soldToHoverMessage").hide();

					dig("#saveCCaddr").hide();
					lastStep = 2;
				} else {
					dig("#ccFormBox").attr(
						"data-gutter-toggle",
						"creditcardHoverMessage1"
					);

					dig(".gcform,.ccform").show();
					//dig('#creditcardHoverMessage').show();

					dig("#giftCardsModule,#promoCodesModule").show();

					dig(".ppMethodRadio").show(); //.removeClass('hideThis');
					// dig('#ppMethodId3').trigger('click');

					dig("#creditcardHoverMessage").removeClass("noCC");

					dig("#cc_form .addrform h6").show();
					dig("#shipToShipAddr,#soldToParagraph").hide();

					dig("#cc_form")
						.children("h3:first")
						.html("Payment Method");

					dig("#savedSoldToAddresses").addClass("hideThis");
					dig("#creditCardAddresses").removeClass("hideThis");

					dig(
						"#creditcardHoverMessage1,#soldToHoverMessage"
					).removeClass("focused");
					dig(
						"#creditcardHoverMessage1,#soldToHoverMessage"
					).removeClass("hovered");
					dig("#creditcardHoverMessage1,#soldToHoverMessage").hide();
				}
			});

			var soldToHandler = (self.soldToHandler = function() {
				$("#soldto").jqm({
					overlay: 50,
					trigger: "a.soldto",
					closeClass: "cartpopupclose",
					modal: false,
					onShow: myOpenGIF,
					onHide: myCloseGIF
				});
				return;
				//
				// jqmodal initialization - cartpopup.htm Shopping cart
				//
				/*
			$('a.soldto').on('click', function(evt) {
				evt.preventDefault();
				//-
				$('#soldto').jqm({
					overlay: 50,
					closeClass: 'cartpopupclose',
					modal: false,
					onShow: myOpenGIF,
					onHide: myCloseGIF
				});
			});*/
			});

			var giftCardSuccess = (self.giftCardSuccess = function(args) {
				var data = args.data;
				var form = args.form;
				//console.log(['giftCardSuccess data', data]);

				if (base.fn.und(data)) return;

				//$('div#giftcardLoad').hide();

				$(window).trigger("methodRequest", [
					"collapseSteps",
					{
						steps: [base.opc.isPPX ? "#step3load" : "#step2load"]
					}
				]);

				// checks for p#ppmessage so this only fires on pay pal express for virtual orders to correct gift card data not displaying
				/*
			var checkPPMessage = jQuery('#ppmessage').length;
			if (checkPPMessage === 1) {
				$(window).trigger('methodRequest', [ 'loadTemplate', {
					tpl : 'tpl_single3_ppx_refresh'
				}]);
			}*/
				if (data.success != true) {
					$("div#giftcardspay div.giftcarddisp").show();
					if (
						"object" == typeof data.errors &&
						Object.keys(data.errors).length > 0
					) {
						$(window).trigger("errors", [data, form]);
					} else {
						alert(
							"Unknown Error Occurred. Please contact an administrator with the code: paymentAddGiftCard"
						);
					}
				} else {
					$("div#giftcardspay div.giftcarddisp").show();
					if (
						$("input[name=ppMethod]:checked").val() == "creditCard"
					) {
						$(".ppMethodRadioContent").hide();
						$("input[name=ppMethod]").selected("");
					}
					base.opc.config.form.totalSatisfied = data.totalSatisfied;
					if (!base.fn.und(base.opc.config.form.totalSatisfied)) {
						handleTotalSatisfied();
					}
					reGetStep2Totals();
				}
			});

			function setGiftCardEvents() {
				self.giftCardApplied = dig(".remove").length > 0;

				if (!dig("#cc_form").is(":visible"))
					dig("#creditcardHoverMessage").hide();

				dig("#giftCardNumberField").removeClass("errMissed");
				//-
				var fnGCNumberInputs = function(el) {
					if (!el.length) return;
					el.parents("div.gcform:first").addClass("hasPin");
				};

				dig("#giftCardNumberField")
					.off("keyup")
					.on("keyup", function(evt) {
						fnGCNumberInputs($(this));
					});
				fnGCNumberInputs(dig("#giftCardNumberField"));

				dig(".remove")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						var index = $(this).attr("rel");
						$(window).trigger("methodRequest", [
							"submitForm",
							{
								obj: $(this),
								cnf: "paymentRemoveGiftCard",
								form: "form#paymentFormGiftCardsId_" + index
							}
						]);
					});

				dig("#addGiftCardSubmit")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						var index = $(this).attr("rel");
						$(window).trigger("methodRequest", [
							"submitForm",
							{
								obj: $(this),
								cnf: "paymentAddGiftCard",
								form: "form#paymentFormGiftCardsId_" + index
							}
						]);
					});
				handleTotalSatisfied();
			}

			$(document).ready(function() {
				new $.Zebra_Tooltips($(".pintrigger"), {
					position: "right",
					background_color: "#FDFDFD",
					color: "#FF0000",
					vertical_offset: 28,
					horizontal_offset: 35,
					max_width: 315
				});
			});

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
