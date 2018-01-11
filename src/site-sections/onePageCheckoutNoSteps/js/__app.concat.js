(function() {
	if (typeof window.base == "undefined") return;

	window.base.opc.config.copy = {
		allowedChars: {
			title: "Note:",
			msg:
				"We can only print standard English letters, numbers, and punctuation marks. Please remove any diacritical marks, nonstandard punctuation, or characters from other languages."
		},
		confirmDelete:
			"Are you sure you want to remove this item from your cart?",
		accountCreatedStepLabel: "Step 3 of 4 : My Account",
		leavingCart: {
			title: "Wait!",
			msg:
				" Are you sure you want to leave this page? You'll have to re-enter any checkout information when you come back.\r\n\r\nIf you still want to go, click <b>OK</b>. To stay and keep your data, click <b>Cancel</b>."
		},
		ajaxError: {
			msg:
				'A server error has occured. Pressing "OK" will restart your checkout.',
			title: "Oops"
		},
		previewOrder: {
			default: "Preview order",
			createAccount: "Create account and Preview order"
		},
		noShippingAddrNeeded:
			"Virtual orders do not require a shipping address.",
		empty: ""
	};
})();
// used by "old" code
/* obj -> object within the form
 * cnf -> config to load
 * form -> form id
 * loadDiv ->
 */
function submitForm(obj, cnf, form, loadDiv, isAsync) {
	/* KEPT HERE TO PREVENT ANY INLINE USE FROM BREAKING. Ã‚ Function logic resides in opc.js (/SurLaTable/workspace/ui_sources/js/_app) */
	return $(window).trigger("methodRequest", [
		"submitForm",
		{
			obj: obj,
			cnf: cnf,
			form: form,
			loadDiv: loadDiv,
			isAsync: isAsync
		}
	]);
}
(function() {
	if (typeof window.base == "undefined") return;

	window.base.opc.config.form = {
		current: {
			id: "",
			type: "single",
			address: 1,
			step: "1",
			lastStep: 0
		},

		fillNewAddressFields: false,
		addresses: {},
		creditCards: {},
		totalSatisfied: false,
		useDummyAddress: false,
		currEditIndex: "",
		onlineClassesLoaded: 0,
		onlineClassesNumRecipients: 0,
		onlineClassTimer: 0,
		shipMethodSelected: false,
		shipFieldFocusID: false,
		selectedShippingAddress: false,
		selectedShippingMethod: false,
		useShipFirstLoad: true,
		isRegistry: false,
		eventFired_step1: false,
		eventFired_step2: false,
		eventFired_step3: false,
		eventFired_step1Multiple: false,
		eventFired_promo: false,
		GAAutocompleteShippingForm: {
			key: "ssiShippingForm",
			autocompleteBoxId: "ssaddr1",
			street_number: "ssaddr1",
			route: "ssaddr1",
			locality: "sscity",
			administrative_area_level_1: "ssstate",
			postal_code: "sszip",
			apartment: "ssaddr2"
		},
		GAAutocompleteBillingForm: {
			key: "step2InitBillingForm",
			autocompleteBoxId: "ccaddress1",
			street_number: "ccaddress1",
			route: "ccaddress1",
			locality: "cccity",
			administrative_area_level_1: "ccstate",
			postal_code: "ccpostalCode",
			apartment: "ccaddress2"
		},
		validatorRules: {
			//https://jqueryvalidation.org/validate
			errorElement: "div",
			errorPlacement: function(error, element) {
				var parent = element.closest(".form-group");
				parent.addClass("has-error").removeClass("has-success");
				error.appendTo(parent.find(".help-block"));
			},
			ignore: ":hidden, :checkbox",
			onkeyup: false,
			focusCleanup: true,
			onfocusout: function(element) {
				$(element).valid();
			},
			clearErrors: function(formId) {
				//custom method. callable to clear errors for form
				//ex: base.opc.config.form.validatorRules.clearErrors("#form");
				var form = $(formId);
				var validator = form.data("validator");
				if (validator) {
					//commented this out since it's causing the address selector to act weird.
					//form.data('validator').resetForm();
				}
				form
					.find(".form-group")
					.removeClass("has-error")
					.addClass("has-success");
				form
					.find(".form-group")
					.find(".help-block")
					.html("");
				form.find(".shippingErrorMessage").hide();
			},
			success: function(label, el) {
				//console.log('success');
				//console.log(label.closest(".form-group"));
				//console.log(label);
				//console.log(el);
				label
					.closest(".form-group")
					.removeClass("has-error")
					.addClass("has-success");
				label
					.closest(".form-group")
					.find(".help-block")
					.html("");

				//check if the address field is a success
				if (el.id == "ssaddr1") {
					//trigger Google Map API
					//$(window).trigger('initGAutocomplete', {currentForm : base.opc.config.form.GAAutocompleteShippingForm});
				}
				if (el.id == "ccaddress1") {
					//trigger Google Map API
					//$(window).trigger('initGAutocomplete', {currentForm : base.opc.config.form.GAAutocompleteBillingForm});
				}
			},
			invalidHandler: function(event, validator) {
				//console.log('found form error');
				//console.log($(".has-error").first());
				global_hideMask();

				setTimeout(function() {
					$(".has-error").removeClass("has-success");

					var firstError = $(".has-error")
						.first()
						.closest("form");
					if (firstError.length) {
						//expand accordion if error is inside an accordion
						firstError.closest(".panel-collapse").collapse("show");
						//scroll to error
						$("html, body").animate(
							{
								scrollTop: firstError.offset().top
							},
							200
						);
					}
				}, 300);
			},
			rules: {
				"/slt/commerce/order/SinglePageCheckoutFormHandler.shipContainer.currentShipGroup.shipAddress.address1": {
					noPOBox: true
				},
				"/atg/commerce/order/ShoppingCartModifier.creditCardPaymentGroups[0].creditCardNumber": {
					minlength: 16
				},
				ereceiptAddr1Top: {
					required: true,
					email: true
				},
				ssphone: {
					required: true,
					phoneUS: true
				}
			},
			messages: {
				"/slt/commerce/order/SinglePageCheckoutFormHandler.shipContainer.currentShipGroup.shipAddress.address1": {
					noPOBox: "Sorry, we can't ship to P.O. Boxes."
				},
				"/atg/commerce/order/ShoppingCartModifier.creditCardPaymentGroups[0].creditCardNumber": {
					minlength: "Valid Credit Card Required"
				},
				ereceiptAddr1Top: {
					required: "We need your email address to contact you",
					email:
						"Your email address must be in the format of name@domain.com"
				},
				ssphone: {
					required: "Enter your phone number.",
					phoneUS:
						"Please enter a valid phone number. (ex: 123-456-7890)"
				}
			}
		},

		errorMap: {
			//- CART
			//- -----------------------------------
			unabletoUpdateQuantity: {
				selector: "#", // itemId is passed along with error object in json response and appended to config
				step: "cartUpdate"
			},

			//- STEP 1
			//- -----------------------------------
			firstName0: {
				selector: "#ssfname:eq(0)",
				step: "1"
			},
			lastName0: {
				selector: "#sslname:eq(0)",
				step: "1"
			},
			address10: {
				selector: "#ssaddr1:eq(0)",
				step: "1"
			},
			city0: {
				selector: "#sscity:eq(0)",
				step: "1"
			},
			state0: {
				selector: "#ssstate:eq(0)",
				step: "1"
			},
			postalCode0: {
				selector: "#sszip:eq(0)",
				step: "1"
			},
			email0: {
				selector: "#ereceiptAddr1Top:eq(0)",
				step: "1"
			},
			phoneNumber0: {
				selector: "#ssphone:eq(0)",
				step: "1"
			},
			/*'unableToVerifyAddressNote' : {
				selector : '#fedexValidation-msg',
				step : '1'
			},

			'suggestedAddressNote' : {
				selector : '#fedexValidation-msg',
				step : '1'
			},*/
			shipmentRestriction: {
				selector: "#shipping-container",
				step: "1"
			},

			//- STEP 2
			//- -----------------------------------
			//- Gift Card
			giftCardPayment: {
				selector: "#giftCardNumberField",
				step: "2"
			},
			cardNumber: {
				selector: "#giftCardNumberField",
				step: "2"
			},
			paymentNotSelected: {
				selector: "#cc_form h3:eq(0)",
				step: "2"
			},
			//- Credit Card
			creditcardNotRecognized: {
				selector: "#creditCardNumberT",
				step: "2"
			},
			creditCardNumber: {
				selector: "#creditCardNumberT",
				step: "2"
			},

			cardVerificationNumber: {
				selector: "#creditCardPin",
				step: "2"
			},
			expirationMonth: {
				selector: "#expirationMonth",
				step: "2"
			},
			expirationYear: {
				selector: "#expirationYear",
				step: "2"
			},
			expirationDate: {
				selector: "#expirationMonth, #expirationYear",
				step: "2"
			},

			//- Billing Address
			firstName: {
				selector: "#ccfirstName",
				step: "2"
			},
			lastName: {
				selector: "#cclastName",
				step: "2"
			},
			address1: {
				selector: "#ccaddress1",
				step: "2"
			},
			city: {
				selector: "#cccity",
				step: "2"
			},
			state: {
				selector: "#ccstate",
				step: "2"
			},
			postalCode: {
				selector: "#ccpostalCode",
				step: "2"
			},
			phoneNumber: {
				selector: "#ccphoneNumber",
				step: "2"
			},

			ccfirstName0: {
				selector: "#ccfirstName",
				step: "2"
			},
			cclastName0: {
				selector: "#cclastName",
				step: "2"
			},
			ccaddress10: {
				selector: "#ccaddress1",
				step: "2"
			},
			cccity0: {
				selector: "#cccity",
				step: "2"
			},
			ccstate0: {
				selector: "#ccstate",
				step: "2"
			},
			ccpostalCode0: {
				selector: "#ccpostalCode",
				step: "2"
			},
			ccphoneNumber0: {
				selector: "#ccphoneNumber",
				step: "2"
			},
			billingAddress: {
				selector: "#cccity",
				step: "2"
			},
			//- Email Address
			email: {
				selector: "#ereceiptAddr1",
				step: "2"
			},
			receiptEmail: {
				selector: "#ereceiptAddr1",
				step: "2"
			},
			eReceiptError: {
				selector: "#ereceiptAddr2",
				step: "2"
			},
			receiptConfirmationEmail: {
				selector: "#ereceiptAddr2",
				step: "2"
			},
			//- STEP 3AC
			//- -----------------------------------
			password: {
				selector: "#cApassword",
				step: "3ac"
			},
			confirmPassword: {
				selector: "#cApasswordConf",
				step: "3ac"
			},
			//- Promo Code
			coupon0: {
				selector: "#couponCode",
				step: null
			},
			couponClaimCode: {
				selector: "#couponCode",
				step: null
			}
		},

		//- FORM HANDLERS
		//- -----------------------------------------------
		handlers: {
			/**
			 * Template Calls
			 */

			tpl_cart: {
				url: "/checkout/noSteps/includes/sidebarCart.jsp",
				type: "GET",
				async: true,
				dataType: "html",
				success: function(data) {
					jQuery("#cartsummary")
						.htmlOverride(data)
						.sidebarCart({
							updateLeftSide: false
						});
				}
			},

			tpl_cart_ppx: {
				url:
					"/checkout/noSteps/includes/sidebarCart.jsp?defaultShippingMethod=true",
				type: "GET",
				async: true,
				dataType: "html",
				success: function(data) {
					jQuery("#cartsummary")
						.htmlOverride(data)
						.sidebarCart({
							forceUpdateItem: true
						});
				}
			},

			tpl_cart_update: {
				url: "/checkout/noSteps/includes/sidebarCart.jsp",
				type: "GET",
				async: true,
				dataType: "html",
				success: function(data) {
					jQuery("#cartsummary")
						.htmlOverride(data)
						.sidebarCart({
							updateLeftSide: false
						});
				}
			},

			tpl_promo_sum: {
				url: "/checkout/noSteps/includes/promoSum.jsp",
				type: "GET",
				dataType: "html",
				success: function(data) {
					$("#cartsummary").trigger("applyPromoData", [data]);
				}
			},

			head: {
				url: "/includes/headerProfileLinks.jsp",
				type: "GET",
				async: true,
				dataType: "html",
				success: function(data) {
					//console.log(['topHeaderNav', data]);
					$("#topHeaderNav")
						.find("a:eq(0)")
						.replaceWith(data);
					//console.log('html: ' + $('#topHeaderNav').html().trim());
					$("#topHeaderNav")
						.html()
						.trim()
						.replace(/||/g, "");
				}
			},

			tpl_single: {
				url: "/checkout/noSteps/includes/singleShipInclude.jsp", //singleShipInclude.jsp',
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					// beforeSerialize
				},
				complete: function() {
					//populate dropdown with past selected
					if (jQuery("#firstAddressSelectID").val() != "") {
						jQuery(".addrform .savedAddresses select")
							.val(jQuery("#firstAddressSelectID").val())
							.trigger("change"); //make sure it "changes"
						jQuery("#firstAddressSelectID").val(""); //clear
					}
				},
				success: function(data) {
					$("#step1info").hide();
					$("#step1").step1({
						success: true,
						cnf: "tpl_single",
						data: data
					});
				}
			},

			tpl_single_silent_form_load: {
				url: "/checkout/noSteps/includes/singleShipInclude.jsp", //singleShipInclude.jsp',
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {},
				complete: function() {},
				success: function(data) {
					jQuery("#step1form")
						.hide()
						.htmlOverride(data);
					$(window).trigger("methodRequest", [
						"editLinkAnimate",
						{
							step: "1",
							action: "show"
						}
					]);
				}
			},

			tpl_single_part_2_3: {
				url: "/checkout/noSteps/includes/singleShipInclude.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					base.opc.config.form.fillNewAddressFields = true;
				},
				complete: function() {
					base.opc.config.form.fillNewAddressFields = false;
				},
				success: function(data) {
					$("#step1").step1({
						success: true,
						cnf: "tpl_single_part_2_3",
						data: data
					});
				}
			},

			tpl_step3ac_info: {
				// Email Receipt / Preview Order
				url: "/checkout/noSteps/includes/step3acSum.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					jQuery("#step3ACform")
						.stop()
						.slideUp(500);
				},
				success: function(data) {
					$("#step3ac").step3ac({
						success: true,
						data: data,
						cnf: "tpl_step3ac_info"
					});
				}
			},

			tpl_step3ac_info_ppx: {
				// Email Receipt / Preview Order
				url: "/checkout/noSteps/includes/step3acSum.jsp?ppx=1",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					jQuery("#step3ACform")
						.stop()
						.slideUp(500);
				},
				success: function(data) {
					$("#step3ac_ppx").step3ac_ppx({
						success: true,
						data: data,
						cnf: "tpl_step3ac_info_ppx",
						isSubmitted: true
					});
				}
			},

			tpl_createAccount: {
				// Email Receipt / Preview Order
				url: "/checkout/noSteps/includes/step3ac.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					jQuery("#step3ACinfo")
						.stop()
						.slideUp(500);
				},
				success: function(data) {
					base.opc.config.form.current.type = "single";
					$(window).trigger("methodRequest", [
						"setStep",
						{ step: "3ac" }
					]);
					$("#step3ac").step3ac({
						success: true,
						cnf: "tpl_createAccount",
						data: data
					});
				}
			},

			tpl_createAccount_ppx: {
				// Email Receipt / Preview Order
				url: "/checkout/noSteps/includes/step3ac.jsp?ppx=1",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					jQuery("#step3ACinfo")
						.stop()
						.slideUp(500);
				},
				success: function(data) {
					base.opc.config.form.current.type = "single";

					$("#step3ac_ppx").step3ac_ppx({
						success: true,
						cnf: "tpl_createAccount_ppx",
						data: data
					});
				}
			},

			paypalform: {
				// Email Receipt / Preview Order
				url: "/checkout/noSteps/includes/step2Initial2_ppx.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					jQuery("#step3info")
						.stop()
						.slideUp(500);
				},
				success: function(data) {
					base.opc.config.form.current.type = "single";
					//console.log('paypalform success');
					$("#step2_ppx").step2_ppx({
						success: true,
						cnf: "paypalform",
						data: data
					});
				}
			},

			noConf: {
				// Was going to be used with PayPal Express: From paypalExpress.jsp (step2Initial2_ppx.jsp), the top form does not require a configuration to be loaded
				url: "/checkout/noSteps/includes/sidebarCart.jsp",
				type: "GET",
				async: false,
				dataType: "html",
				success: function(data) {
					jQuery("#cartsummary").htmlOverride(data);
					jQuery("#editcart").addClass("hideThis");
				}
			},

			tpl_single1_pp: {
				// PayPal Address Info
				url: "/checkout/noSteps/includes/singleshipStep1Sum.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					jQuery("#step1info")
						.stop()
						.slideUp(500);
					jQuery("#step1load").show();
				},
				success: function(data) {
					base.opc.config.form.current.type = "single";
					$(window).trigger("methodRequest", [
						"setStep",
						{ step: 3 }
					]);
					$("#step1").step1({
						success: true,
						cnf: "tpl_single1_pp",
						data: data
					});
				}
			},

			tpl_single1_ppx: {
				// PayPal Address Info
				url: "/checkout/noSteps/includes/singleshipStep1Sum_ppx.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					jQuery("#step1info")
						.stop()
						.slideUp(500);
					jQuery("#step1load").show();
				},
				success: function(data) {
					base.opc.config.form.current.type = "single";
					$("#step1_ppx").step1_ppx({
						success: true,
						cnf: "tpl_single1_ppx",
						data: data
					});
				}
			},

			tpl_single1_ppx_SILENT: {
				// PayPal Address Info
				url: "/checkout/noSteps/includes/singleshipStep1Sum_ppx.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {},
				success: function(data) {
					//console.log('tpl_single1_ppx_SILENT - success');
				}
			},

			tpl_shippingMethods_ppx: {
				// Shipping Options
				url: "/checkout/noSteps/includes/singleShipInclude_ppx.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					var e = $("#step2form");
					e = !this.cartUpdate ? e.stop().slideUp(500) : e;
				},
				success: function(data) {
					//console.log('tpl_shippingMethods_ppx success');
					base.opc.config.form.current.type = "single";
					$("#step2_ppx").step2_ppx({
						success: true,
						cnf: "tpl_shippingMethods_ppx",
						data: data,
						cartUpdate: this.cartUpdate
					});
				}
			},

			tpl_giftCardPromoCode_ppx: {
				// Gift Cards / Promotion Codes
				url: "/checkout/noSteps/includes/step2Initial1_ppx.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					jQuery("#step3info")
						.stop()
						.slideUp(500);
				},
				success: function(data) {
					base.opc.config.form.current.type = "single";
					$("#step3_ppx").step3_ppx({
						success: true,
						cnf: "tpl_giftCardPromoCode_ppx",
						data: data,
						cartUpdate: this.cartUpdate
					});
				}
			},

			tpl_single3_ppx_refresh: {
				// Gift Cards / Promotion Codes PPX only refresh gift card
				url:
					"/checkout/noSteps/includes/step2Initial1_ppx.jsp#giftCardsDiv",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					jQuery("#step3info")
						.stop()
						.fadeOut();
				},
				success: function(data) {
					base.opc.config.form.current.type = "single";
					jQuery("#step3form")
						.hide()
						.htmlOverride(data)
						.fadeIn();
				}
			},

			tpl_step3_ppx: {
				// Email Receipt / Create Account / Preview Order
				url: "/checkout/noSteps/includes/step3_ppx.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					jQuery("#step3info")
						.stop()
						.slideUp(500);
				},
				success: function(data) {
					base.opc.config.form.current.type = "single";
					$("#step3_ppx").step3_ppx({
						success: true,
						cnf: "tpl_step3_ppx",
						data: data,
						cartUpdate: this.cartUpdate
					});
				}
			},

			tpl_single_electronic_ppx: {
				url: "/checkout/noSteps/includes/singleshipStep1Sum_ppx.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {},
				success: function(data) {
					base.opc.config.form.current.type = "single";
					$("#step1_ppx").step1_ppx({
						success: true,
						cnf: "tpl_single_electronic_ppx",
						data: data
					});
				}
			},

			tpl_single_electronic: {
				url: "/checkout/noSteps/includes/singleShipInclude.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					// beforeSerialize
					jQuery("#step1load").show();
				},
				complete: function() {
					jQuery("#step1load").hide();
				},
				success: function(data) {
					base.opc.config.form.current.type = "single";
					$("#step1_electronic").step1_electronic({
						success: true,
						cnf: "tpl_single_electronic",
						data: data,
						cartUpdate: this.cartUpdate
					});
				}
			},

			tpl_step1_sum_single: {
				// Single-address submit summaries
				url: "/checkout/noSteps/includes/singleshipStep1Sum.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					jQuery("#step1form").slideUp(100);
					jQuery("#step1load").show();
				},
				complete: function() {
					jQuery("#step1load").hide();
				},
				success: function(data) {
					////console.log(['tpl_step1_sum_single data',data]);
					jQuery("#step1form").hide();

					$("#step1info")
						.htmlOverride(data)
						.show()
						.slideDown(500);

					$(".sumEditBtn")
						.show()
						.unbind("click")
						.on("click", function(a) {
							$(this).hide();
							$(window).trigger("methodRequest", [
								"loadStepReset",
								{}
							]);
						});

					//set in both step1.js and step3.js
					$(".orderSubmitPlaceOrderBtn")
						.unbind("click")
						.on("click", function(evt) {
							evt.preventDefault();
							$(".stepLoad").show();
							$(window).trigger("methodRequest", [
								"submitForm",
								{
									obj: $(this),
									cnf: "moveToOrderCommit",
									form: "form#commitOrderForm"
								}
							]);
						});
				}
			},
			tpl_step1_sum_single_silent: {
				// Single-address submit summaries
				url: "/checkout/noSteps/includes/singleshipStep1Sum.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {},
				complete: function() {},
				success: function(data) {
					$(window).trigger("step1SumLoaded");
				}
			},

			tpl_step1_sum_edit_single: {
				// Multi-address submit summaries - items remaining = true
				url: "/checkout/noSteps/includes/singleShipInclude.jsp",
				type: "GET",
				dataType: "html",
				success: function(data) {
					jQuery("#step1info")
						.htmlOverride(data)
						.slideDown(500);
				}
			},

			tpl_step2: {
				url:
					"/checkout/noSteps/includes/step2Initial.jsp?w=1&currentType=single",
				type: "GET",
				dataType: "html",
				success: function(data) {
					var step2El = $("#step2");

					if (!step2El.length) {
						step2El = $("#mw_step2");
					}

					if (!step2El.length) {
						console.error("no #step2 or #mw_step2 available");
					}

					step2El.step2({
						success: true,
						cnf: "tpl_step2",
						data: data,
						cartUpdate: this.cartUpdate
					});
				}
			},

			tpl_step2_oncartUpdate: {
				url:
					"/checkout/noSteps/includes/step2Initial.jsp?w=1&currentType=single&onCartUpdate=true",
				type: "GET",
				dataType: "html",
				success: function(data) {
					$("#step2").step2({
						success: true,
						cnf: "tpl_step2_oncartUpdate",
						data: data,
						cartUpdate: this.cartUpdate
					});
				}
			},

			tpl_step2_silent_form_load: {
				url:
					"/checkout/noSteps/includes/step2Initial.jsp?w=1&currentType=single",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {},
				complete: function() {},
				success: function(data) {
					jQuery("#step2form")
						.hide()
						.htmlOverride(data);
					/*$(window).trigger('methodRequest', [ 'editLinkAnimate', {
						step : '2',
						action : 'show'
					}]);*/
				}
			},

			tpl_giftcard_sum: {
				url: "/checkout/noSteps/includes/giftCardSum.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function() {
					jQuery("div#giftcardLoad").show(); //promocodespay
				},
				success: function(data) {
					$(base.opc.isPPX ? "#step3_ppx" : "#step2").trigger(
						"setGiftCardEvents",
						[data]
					);
				}
			},

			tpl_order_confirmation: {
				url: "/checkout/noSteps/includes/step3.jsp",
				type: "GET",
				dataType: "html",
				success: function(data) {
					$(window).trigger("methodRequest", [
						"setStep",
						{ step: 3 }
					]);

					/*$(window).trigger('methodRequest', [ 'editLinkAnimate', {
						step : '2',
						action : 'show'
					}]);*/

					$("#step3").step3({
						success: true,
						cnf: "tpl_order_confirmation",
						data: data
					});
				}
			},
			tpl_order_confirmation_final: {
				url: "/checkout/noSteps/includes/step3.jsp?final=true",
				type: "GET",
				dataType: "html",
				success: function(data) {
					$(window).trigger("methodRequest", [
						"setStep",
						{ step: 3 }
					]);

					//scroll to top for summary
					window.scrollTo(0, 0);

					$("#step3").step3({
						success: true,
						cnf: "tpl_order_confirmation_final",
						data: data
					});
				}
			},

			tpl_order_confirmation_ppx: {
				url: "/checkout/noSteps/includes/step3.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {
					jQuery("#step4load").slideDown(222);
				},
				success: function(data) {
					$(window).trigger("methodRequest", [
						"setStep",
						{ step: 4 }
					]);

					$("#step4_ppx").step4_ppx({
						success: true,
						cnf: "tpl_order_confirmation_ppx",
						data: data,
						cartUpdate: this.cartUpdate
					});
				}
			},

			tpl_step2_sum: {
				url: "/checkout/noSteps/includes/step2Sum.jsp",
				type: "GET",
				dataType: "html",
				success: function(data) {
					$("#step2form").hide();
					$("#step2").step2({
						success: true,
						cnf: "tpl_step2_sum",
						data: data,
						cartUpdate: this.cartUpdate
					});
				}
			},

			tpl_step2_sum_silent: {
				url: "/checkout/noSteps/includes/step2Sum.jsp",
				type: "GET",
				dataType: "html",
				success: function(data) {
					$(window).trigger("step2SumSilentLoaded");
				}
			},

			tpl_step4_sum: {
				url: "/checkout/noSteps/includes/step4Sum.jsp",
				type: "GET",
				dataType: "html",
				success: function(data) {
					jQuery("#step3form").slideUp(500);
					jQuery("#step3form")
						.htmlOverride(data)
						.slideDown(500);
					jQuery("#editcart").addClass("hideThis");
				}
			},

			getTotals: {
				url: "/checkout/noSteps/singlePageSignIn.jsp?from=getTotals",
				type: "GET",
				async: false,
				dataType: "json",
				success: function(data) {
					orderTotal = data.orderTotal;
					base.opc.config.form.totalSatisfied = data.totalSatisfied;
				}
			},

			/**
			 * Form Submits
			 */
			singleStep1p: {
				url:
					"/checkout/noSteps/singlePageSignIn.jsp?from=singleshipform",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form, options) {
					base.opc.config.form.current.type = "single";
					base.opc.config.form.current.id = form.attr("id");
				},
				beforeSend: function(jqXHR, settings) {},
				complete: function() {
					jQuery("#step1load").hide();
				},
				success: function(data) {
					if (data.step != "1") {
						alert("ERROR: Out of sequence");
						return false;
					}
					if (data.success !== true) {
						jQuery("#step1form").css({
							position: "static",
							left: 0
						});
						$(window).trigger("errors", [
							data,
							base.opc.config.form.current.id
						]);
					} else {
						if (base.opc.config.form.current.lastStep != 2) {
							orderTotal = data.orderTotal;
							base.opc.config.form.totalSatisfied =
								data.totalSatisfied;

							base.opc.config.form.current.lastStep = 1;
						} else {
							$(window).trigger("methodRequest", [
								"setStep",
								{ step: 2 }
							]);
							$(window).trigger("methodRequest", [
								"loadStep2Success"
							]);
							jQuery("#step2info").attr(
								"style",
								"display:block;"
							);
						}
					}
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			verifyCartQuantity: {
				url: "/checkout/noSteps/singlePageSignIn.jsp?from=cartQuantity",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form, options) {},
				success: function(data) {
					if (!data.success) {
						$(window).trigger("errors", [data]);
					} else
						$(window).trigger("methodRequest", [
							"retainFormValues",
							{
								callback: function() {
									submitForm(
										$("#updateItemQty"),
										"updateItemCartQty",
										"form#shoppingCartForm"
									);
								}
							}
						]);
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			singleStep1p2: {
				url:
					"/checkout/noSteps/singlePageSignIn.jsp?from=singleshipform",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form, options) {
					base.opc.config.form.current.type = "single";
					base.opc.config.form.current.id = form.attr("id");
				},
				beforeSend: function() {
					//console.log('singleStep1p2');
				},
				success: function(data) {
					//console.log(['data', data]);
					if (data.success !== true) {
						jQuery("#step3form, #step3form").css({
							position: "static",
							left: 0
						});

						$(window).trigger("methodRequest", [
							"expandSteps",
							{
								steps: [
									"#step3ACform",
									"#step3form",
									"#step2form"
								]
							}
						]);
						$(window).trigger("errors", [
							data,
							base.opc.config.form.current.id
						]);

						return false;
					}
					$(window).trigger("methodRequest", [
						"submitForm",
						{
							obj: $(this),
							cnf: "paymentSubmit_ppx",
							form: "#paymentFormId"
						}
					]);
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			singleStep1p2_SILENT: {
				url:
					"/checkout/noSteps/singlePageSignIn.jsp?from=singleshipform",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form, options) {
					base.opc.config.form.current.type = "single";
					base.opc.config.form.current.id = form.attr("id");
				},
				success: function(data) {
					if (data.success !== true) {
						$(window).trigger("errors", [
							data,
							base.opc.config.form.current.id
						]);
						return false;
					}
					/*
					$(window).trigger('methodRequest', [ 'submitForm', {
						obj : $(this),
						cnf : 'paymentSubmit_ppx',
						form: '#paymentFormId'
					}]);*/
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			singleStep1p2_old: {
				url:
					"/checkout/noSteps/singlePageSignIn.jsp?from=singleshipform",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form, options) {
					current.type = "single";
					current.form = form.attr("id");
					var select = form.find(
						form
							.find('[id^="opcShippingFormId_Operation"]')
							.attr("id")
					);
					var selectId = form
						.find('[id^="opcShippingFormId_Operation"]')
						.attr("id");
					if (select.length > 0) {
						var selVal = jQuery(select).val();
						if (
							jQuery(selectId)
								.parents("form:first")
								.find('[id^="saveaddr"]')
								.is(":checked")
						) {
							if (selVal == "") {
								select
									.find('[id^="shippingAddressOperation"]')
									.val("new");
							} else {
								select
									.find('[id^="shippingAddressOperation"]')
									.val(selVal);
							}
						}
					}
				},
				success: function(data) {
					if (data.success !== true) {
						jQuery("#step3form, #step4form").css({
							position: "static",
							left: 0
						});

						$(window).trigger("errors", [
							data.errors,
							current.form
						]);
						return false;
					}
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			singleStep1: {
				url: "/checkout/noSteps/singlePageSignIn.jsp",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form, options) {
					//set in zipValidation.js---------
					//APO/FPO Zip validation check
					//Cancel submit if zip is invalid
					if ($("#sszip").data("valid") === false) {
						jQuery("#step1load").hide();
						$(window).trigger("singleStep1_Fail");
						return false;
					}

					//Confirm that client-side validation has passed
					var formValid = form.valid();

					if (!formValid) {
						jQuery("#step1load").hide();
						if ($(".shippingOptions").data("lastChecked")) {
							$(".shippingOptions")
								.data("lastChecked")
								.click();
						}
						//$("input.shippingMethod").attr("checked",false).parent('label').removeClass('active');
						$(window).trigger("singleStep1_Fail");
						return false;
					}
					//-------------------------------

					base.opc.config.form.current.type = "single";
					base.opc.config.form.current.id = form.attr("id");

					var select = form.find(
						form
							.find('[id^="opcShippingFormId_Operation"]')
							.attr("id")
					);
					var selectId = form
						.find('[id^="opcShippingFormId_Operation"]')
						.attr("id");
					if (select.length > 0) {
						var selVal = jQuery(select).val();
						if (
							jQuery(selectId)
								.parents("form:first")
								.find('[id^="saveaddr"]')
								.is(":checked")
						) {
							if (selVal == "") {
								select
									.find('[id^="shippingAddressOperation"]')
									.val("new");
							} else {
								select
									.find('[id^="shippingAddressOperation"]')
									.val(selVal);
							}
						}
					}

					//clear google api dropdown, for Firefox
					$(window).trigger("hideGAutocomplete");
				},
				beforeSend: function(jqXHR, settings) {},
				complete: function() {
					jQuery("#step1load").hide();
				},
				success: function(data) {
					//console.log("SUBMIT return");
					//console.log(data);
					/*if (data.step != "1") {
						alert("ERROR: Out of sequence");
						return false;
					}*/

					//if (data.success !== true && Object.keys(data.errors).length > 1 && !data.errors[unableToVerifyAddressNote]) {
					if (data.success !== true) {
						//console.log("singleStep1 error");
						$(window).trigger("errors", [
							data,
							base.opc.config.form.current.id
						]);
					} else {
						/*$(window).trigger('methodRequest', [ 'editLinkAnimate', {
							step : '1',
							action : 'show'
						}]);
*/

						orderTotal = data.orderTotal;
						base.opc.config.form.totalSatisfied =
							data.totalSatisfied;

						$(window).trigger("methodRequest", [
							"setStep",
							{ step: data.step }
						]);

						/*$(window).trigger('methodRequest', [ 'loadTemplate', {
							tpl : 'tpl_step2',
							data: {
								data : {
									currentType: base.opc.config.form.current.type
								}
							}
						}]);*/

						//Load Step 1 - Shipping summary
						//$(window).trigger('methodRequest', ['loadTemplate', {tpl : 'tpl_step1_sum_single'}]);

						//Update Cart
						$(window).trigger("methodRequest", [
							"loadTemplate",
							{
								tpl: "tpl_cart",
								data: {
									data: {
										currentStep: "2"
									}
								}
							}
						]);

						$(window).trigger("methodRequest", [
							"loadTemplate",
							{
								tpl: "tpl_single_part_2_3",
								callback: function() {}
							}
						]);
					}
				},
				error: function(data) {
					console.log("singleStep1 real error");
					console.log(data);

					$(window).trigger("ajaxError", [
						data,
						base.opc.config.form.handlers.singleStep1.success
					]);
				}
			},

			createAccountHandler: {
				// Email Receipt / Preview Order
				url: "/checkout/noSteps/singlePageSignIn.jsp",
				type: "POST",
				dataType: "json",
				beforeSend: function(jqXHR, settings) {
					jQuery("#step3ACload").show();
					jQuery("#step3ACinfo")
						.stop()
						.slideUp(500);
				},
				success: function(data) {
					////console.log(['createAccountHandler data', data]);
					if (!base.fn.und(data.errors)) {
						switch (data.step) {
							case "2":
								$("#step3ACload").hide();
								//$('.editLink[rel="2"]').trigger('click');
								$("#ereceiptAddr1").scroll2({
									scrollSpeed: 2000,
									easing: "easeInOutBack"
								});
								/**/
								$("#step3ACform")
									.stop()
									.slideUp(500, function() {
										$("#step2").step2({
											success: true,
											cnf: "createAccountHandler",
											data: data,
											cartUpdate: this.cartUpdate
										});
									}); /**/
								break;
							case "3ac":
								$("#step3ACload").hide();
								$("#step3ACform")
									.stop()
									.slideDown(500, function() {
										$(window).trigger("errors", [
											data,
											base.opc.config.form.current.id
										]);
									});
								break;
						}
						return;
					}
					if (data.success == true) {
						////console.log(['data createAccountHandler', data]);

						$(window).trigger("methodRequest", [
							"loadTemplate",
							{
								tpl:
									"tpl_order_confirmation" +
									(base.opc.isPPX ? "_ppx" : "")
							}
						]);
						$("#step3ACload").hide();
						$("#step3ACinfo")
							.stop()
							.slideUp(500);
						$("#step3ACform")
							.stop()
							.slideUp(500);

						if (data.accountCreated == true) {
							base.opc.user.isTransient = false;
							//- refresh top head
							$(window).trigger("methodRequest", [
								"loadTemplate",
								{ tpl: "head" }
							]);
						}
						$(window).trigger("methodRequest", [
							"loadTemplate",
							{
								tpl:
									"tpl_step3ac_info" +
									(base.opc.isPPX ? "_ppx" : "")
							}
						]);
					}
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			createAccountHandler_ppx: {
				// Email Receipt / Preview Order
				url: "/checkout/noSteps/singlePageSignIn.jsp",
				type: "POST",
				dataType: "json",
				beforeSend: function(jqXHR, settings) {
					//console.log('createAccountHandler_ppx');
				},
				success: function(data) {
					if (!base.fn.und(data.errors)) {
						$(window).trigger("errors", [
							data,
							base.opc.config.form.current.id
						]);
						return;
					}
					if (data.success == true) {
						$(window).trigger("methodRequest", [
							"submitForm",
							{
								obj: $("#shippingSubmit"),
								cnf: "moveToOrderCommit_ppx",
								form: "#commitOrderForm"
							}
						]);
					}
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			//form
			multiStep1: {
				url: "/checkout/noSteps/singlePageSignIn.jsp?from=addmultiship",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form, options) {
					base.opc.config.form.current.type = "multi";
					base.opc.config.form.current.id = form.attr("id");

					var select = form.find(
						form
							.find('[id^="opcShippingFormId_Operation"]')
							.attr("id")
					);
					var selectId = form
						.find('[id^="opcShippingFormId_Operation"]')
						.attr("id");

					if (select.length > 0) {
						var selVal = jQuery(select).val();
						if (
							jQuery(selectId)
								.parents("form:first")
								.find('[id^="saveaddr"]')
								.is(":checked")
						) {
							if (selVal == "") {
								select
									.find('[id^="shippingAddressOperation"]')
									.val("new");
							} else {
								select
									.find('[id^="shippingAddressOperation"]')
									.val(selVal);
							}
						}
					}
				},
				beforeSend: function(jqXHR, settings) {
					jQuery("#step1form")
						.css({
							position: "absolute",
							left: -9999
						})
						.find(".checkouttip")
						.hide();
					// Hide .checkouttip because IE loses paretal bounds and foats it on the right side of the page.

					jQuery("#step1load").show();
				},
				complete: function() {
					jQuery("#step1load").hide();
				},
				success: function(data) {
					/*if (data.step != "1") {
						alert("ERROR: Out of sequence");
						return false;
					}*/

					if (data.success !== true) {
						jQuery("#step1form").css({
							position: "static",
							left: 0
						});
						$(window).trigger("errors", [
							data,
							base.opc.config.form.current.id
						]);
					} else {
						if (data.itemsRemaining === true) {
							current.address += 1;

							jQuery("#itemsRemaining").text("true");
							$(window).trigger("methodRequest", [
								"loadTemplate",
								{
									tpl: "tpl_step1_sum_cont",
									data: data.summaries
								}
							]);
							$(window).trigger("methodRequest", [
								"loadTemplate",
								{
									tpl: "tpl_multi_addr",
									data: {
										address: current.address
									}
								}
							]);
						} else {
							$(window).trigger("methodRequest", [
								"loadTemplate",
								{
									tpl: "tpl_step1_sum"
								}
							]);

							if (base.opc.config.form.current.lastStep != 2) {
								jQuery("#itemsRemaining").text("false");

								base.opc.config.form.totalSatisfied =
									data.totalSatisfied;

								$(window).trigger("methodRequest", [
									"loadTemplate",
									{
										tpl: "tpl_step2",
										data: {
											currentType:
												base.opc.config.form.current
													.type
										}
									}
								]);

								base.opc.config.form.current.lastStep = 1;
							} else {
								$(window).trigger("methodRequest", [
									"loadStep2Success"
								]);
								$("#step2info").attr("style", "display:block;");
							}
						}
					}
					//jQuery('.labeled:enabled:visible').showLabels();
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			editVirtualGifts: {
				url:
					"/checkout/noSteps/singlePageSignIn.jsp?from=editVirtualGifts",
				type: "POST",
				dataType: "json",
				beforeSend: function(jqXHR, settings) {
					// beforeSerialize
					jQuery("#step1load").slideDown();
				},
				complete: function() {
					jQuery("#step1load").hide();
				},
				beforeSerialize: function(form, options) {
					base.opc.config.form.current.id = form.attr("id");

					var select = form.find(
						form
							.find('[id^="opcShippingFormId_Operation"]')
							.attr("id")
					);
					var selectId = form
						.find('[id^="opcShippingFormId_Operation"]')
						.attr("id");
					if (select.length > 0) {
						var selVal = jQuery(select).val();
						if (
							jQuery(selectId)
								.parents("form:first")
								.find('[id^="saveaddr"]')
								.is(":checked")
						) {
							if (selVal == "") {
								select
									.find('[id^="shippingAddressOperation"]')
									.val("new");
							} else {
								select
									.find('[id^="shippingAddressOperation"]')
									.val(selVal);
							}
						}
					}
				},
				success: function(data, statusText, xhr, form) {
					jQuery("#step1load").slideUp();

					$(window).trigger("methodRequest", [
						"setStep",
						{ step: data.step }
					]);

					if (data.success !== true) {
						$(window).trigger("errors", [
							data,
							base.opc.config.form.current.id
						]);
					} else {
						if (base.opc.config.form.current.lastStep != 2) {
							base.opc.config.form.current.lastStep = 1;
							if (base.opc.config.form.current.type == "multi") {
								$(window).trigger("methodRequest", [
									"loadTemplate",
									{
										tpl: "tpl_step1_sum_edit_multi",
										data: data.summaries
									}
								]);

								if (data.itemsRemaining === true) {
									$(window).trigger("methodRequest", [
										"loadTemplate",
										{
											tpl: "tpl_multi_addr"
										}
									]);
								} else {
									$(window).trigger("methodRequest", [
										"loadTemplate",
										{
											tpl: "tpl_step2",
											data: {
												currentType:
													base.opc.config.form.current
														.type
											}
										}
									]);
								}
							} else {
								$(window).trigger("methodRequest", [
									"loadTemplate",
									{
										tpl: "tpl_step1_sum_single"
									}
								]);
								$(window).trigger("methodRequest", [
									"loadTemplate",
									{
										tpl: "tpl_step2",
										data: {
											currentType:
												base.opc.config.form.current
													.type
										}
									}
								]);
							}
						} else {
							if (base.opc.config.form.current.type == "multi") {
								$(window).trigger("methodRequest", [
									"loadTemplate",
									{
										tpl: "tpl_step1_sum_edit_multi",
										data: data.summaries
									}
								]);
							} else {
								$(window).trigger("methodRequest", [
									"loadTemplate",
									{
										tpl: "tpl_step1_sum_single"
									}
								]);
							}
							$(window).trigger("methodRequest", [
								"loadStep2Success"
							]);
							jQuery("#step2info").attr(
								"style",
								"display:block;"
							);
						}
					}
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			editHardgoodsSingle: {
				url:
					"/checkout/noSteps/singlePageSignIn.jsp?from=editHardgoods",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form, options) {
					base.opc.config.form.current.id = form.attr("id");
					var selectId =
							"#" +
							form
								.find('[id^="opcShippingFormId_Operation"]')
								.attr("id"),
						select = form.find(selectId);
					if (select.length > 0) {
						var selVal = jQuery(select).val();
						if (form.find('[id^="saveaddr"]').is(":checked")) {
							if (selVal == "") {
								select
									.find('[id^="shippingAddressOperation"]')
									.val("new");
							} else {
								select
									.find('[id^="shippingAddressOperation"]')
									.val(selVal);
							}
						}
					}
				},
				beforeSend: function(jqXHR, settings) {
					// beforeSerialize
					jQuery("#step1load").show();
				},
				complete: function() {
					jQuery("#step1load").hide();
				},
				success: function(data, statusText, xhr, form) {
					if (data.success !== true) {
						$(window).trigger("errors", [
							data,
							base.opc.config.form.current.id
						]);
					} else {
						var addressFormEdited = jQuery(form).find(
							'[id^="addressFormEdited"]'
						);
						addressFormEdited.find("input,select").each(function() {
							var id = jQuery(this).attr("id");
							if (id) {
								jQuery(this).attr(
									"id",
									id.replace(/\_[0-9]*/, "")
								);
							}
						});

						jQuery("#step1form .addrform").replaceWith(
							addressFormEdited
						);
						jQuery("#step1form .addrform").attr(
							"id",
							"referenceAddrForm"
						);

						jQuery(".useShipAddrChk").trigger("poke");

						var formId = jQuery(form).attr("id"); // singleshipeditformid
						var listId = jQuery(form)
							.find("#editFormShipIndex")
							.val(); // 0 (0...) - Shipping Group Index
						var countId = jQuery(form)
							.find("#editListCount")
							.val(); // 2 (1...) - Item count

						$(window).trigger("methodRequest", [
							"loadTemplate",
							{
								tpl: "tpl_cart"
							}
						]);
						$(window).trigger("methodRequest", [
							"loadTemplate",
							{
								tpl: "tpl_step1_sum_edit_single",
								data: data.summaries
							}
						]);
						jQuery(form)
							.parents("div:first")
							.slideUp(500);
					}
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			editHardgoodsMulti: {
				url:
					"/checkout/noSteps/singlePageSignIn.jsp?from=editHardgoods",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form, options) {
					base.opc.config.form.current.id = form.attr("id");
					var selectId =
							"#" +
							form
								.find('[id^="opcShippingFormId_Operation"]')
								.attr("id"),
						select = form.find(selectId);
					if (select.length > 0) {
						var selVal = jQuery(select).val();
						if (form.find('[id^="saveaddr"]').is(":checked")) {
							if (selVal == "") {
								select
									.find('[id^="shippingAddressOperation"]')
									.val("new");
							} else {
								select
									.find('[id^="shippingAddressOperation"]')
									.val(selVal);
							}
						}
					}
				},
				beforeSend: function(jqXHR, settings) {
					// beforeSerialize
					jQuery("#step1info").slideUp();
					jQuery("#step1load").slideDown();
				},
				complete: function() {
					jQuery("#step1load").hide();
				},
				success: function(data, statusText, xhr, form) {
					jQuery("#step1load").slideUp();

					$(window).trigger("methodRequest", [
						"setStep",
						{ step: data.step }
					]);

					if (data.success !== true) {
						$(window).trigger("errors", [
							data,
							base.opc.config.form.current.id
						]);
					} else {
						$(window).trigger("methodRequest", [
							"loadTemplate",
							{
								tpl: "tpl_step1_sum_edit_multi",
								data: data.summaries
							}
						]);

						base.opc.config.form.current.id = "multiAddressForm";
						jQuery(form)
							.parents("div:first")
							.slideUp();

						if (base.opc.config.form.current.lastStep != 2) {
							if (data.itemsRemaining === true) {
								$(window).trigger("methodRequest", [
									"loadTemplate",
									{ tpl: "tpl_multi_addr" }
								]);
							} else {
								$(window).trigger("methodRequest", [
									"loadTemplate",
									{
										tpl: "tpl_step2",
										data: {
											currentType:
												base.opc.config.form.current
													.type
										}
									}
								]);
							}

							if (jQuery("#step2form").html().length > 0)
								jQuery("#step2form").slideDown();
							else if (jQuery("#step1form").html().length > 0)
								jQuery("#step1form").slideDown();

							base.opc.config.form.current.lastStep = 1;
						} else {
							$(window).trigger("methodRequest", [
								"loadStep2Success"
							]);
							jQuery("#step2info").attr(
								"style",
								"display:block;"
							);
						}
					}
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			/**
			 * Main Payment Config
			 */
			paymentSubmit: {
				url: "/checkout/noSteps/singlePageSignIn.jsp?from=addPayment",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form) {
					var whichPaymentMethodVal = $(
						"input[name=ppMethod]:checked"
					).val();

					//Confirm that client-side validation for CC form has passed
					if (whichPaymentMethodVal == "creditCard") {
						var formValid = form.valid();
						if (!formValid) {
							return false;
						}
					}

					base.opc.config.form.current.id = form.attr("id");

					isPPX = form.closest("div").attr("id") == "step3form";
					isPPflow =
						form
							.find("#paymentSubmit")
							.find("span")
							.text()
							.toLowerCase()
							.indexOf("paypal") >= 0;

					var a = jQuery("#ccpostalCode2");

					jQuery(
						"#ccfirstName," +
							"#cclastName," +
							"#ccaddress1," +
							"#ccaddress2," +
							"#cccity," +
							"#ccstate," +
							"#ccpostalCode," +
							"#ccphoneNumber"
					).prop("disabled", false);
					a = jQuery("#ccpostalCode2");
					jQuery("#creditCardNumberT").prop("disabled", true); // disable temporary (masked) CC field so that it is not validated on form submit
				},
				beforeSend: function(jqXHR, settings) {
					NullifyEdit = true;
				},
				success: function(data) {
					//global_hideMask();
					if (isPPX) {
						jQuery(
							"#step3" +
								(base.opc.user.isTransient ? "AC" : "") +
								"load"
						).hide();
					}

					if (!isPPX && data.step != "2") {
						alert("ERROR: Out of sequence");
						return false;
					}
					if (data.success != true) {
						if (isPPX) {
							jQuery("#step3form").css({
								position: "static",
								left: 0
							});
						} else {
							$("#step2").step2({
								success: true,
								cnf: "paymentSubmit",
								data: data,
								cartUpdate: this.cartUpdate
							});
						}
						$(window).trigger("errors", [
							data,
							base.opc.config.form.current.id
						]);
					} else {
						//send data to GTM for checkout tracking
						if (!base.opc.config.form.eventFired_step2) {
							dataLayer.push({
								event: "checkoutStep",
								checkoutStep: "Payment Info Complete"
							});
							s.events = "event22";
							base.opc.config.form.eventFired_step2 = true;
						}

						var method = "";
						if (isPPflow) {
							document.location.href =
								"../opc/paypalRedirect.jsp?opcPaypal=true";
						} else if (isPPX) {
							base.opc.config.form.current.lastStep = 2;
							method = base.opc.user.isTransient
								? "loadStep3ACSuccess"
								: "loadStep3Success";
						} else {
							//global_showMask("Loading Order Confirmation");
							base.opc.config.form.current.lastStep = 2;
							method = "loadStep2Success";
						}

						$(window).one("step3FinalLoaded", function() {
							console.log("move to commmit");

							$(window).trigger("methodRequest", [
								"submitForm",
								{
									obj: $("#reviewOrderBtn"),
									cnf: "moveToOrderCommit",
									form: "form#commitOrderForm"
								}
							]);
						});
						//$(window).trigger('methodRequest', ['loadTemplate', {tpl : 'tpl_step1_sum_single'}]);
						$(window).trigger("methodRequest", [method, {}]);

						//TRIGGER ORDER SUBMITTAL - 4/26/2016 TF
						//$("#orderSubmit").click();
					}

					NullifyEdit = false;
				},
				complete: function(data) {
					jQuery("#creditCardNumberT").prop("disabled", false); // re-enable temporary (masked) CC field in case this form is shown again
					jQuery("#step2load").hide();
				},
				error: function(data) {
					//console.log(['errrrrrror', data]);
					$(window).trigger("ajaxError", [
						data,
						base.opc.config.form.handlers.paymentSubmit.success
					]);
				}
			},

			paymentSubmit_ppx: {
				url: "/checkout/noSteps/singlePageSignIn.jsp?from=addPayment",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form) {},
				beforeSend: function(jqXHR, settings) {
					//console.log('paymentSubmit_ppx');
				},
				success: function(data) {
					if (data.errors) {
						$(window).trigger("errors", [
							data,
							base.opc.config.form.current.id
						]);
						return;
					}

					if (base.opc.user.isTransient) {
						$("#createUserId #action").val("submit");
						$(window).trigger("methodRequest", [
							"submitForm",
							{
								obj: $(this),
								cnf: "createAccountHandler_ppx",
								form: "form#createUserId"
							}
						]);
					} else {
						$(window).trigger("methodRequest", [
							"submitForm",
							{
								obj: $("#shippingSubmit"),
								cnf: "moveToOrderCommit_ppx",
								form: "#commitOrderForm"
							}
						]);
					}
				},
				complete: function(data) {
					jQuery("#step2load").hide();
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},
			/**
			 * Main Payment Config
			 */
			moveToOrderCommit: {
				url: "/checkout/noSteps/singlePageSignIn.jsp",
				carturl: "/cart/shoppingCart.jsp?orderError=true",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form) {
					base.opc.config.form.current.id = form.attr("id");
					isPPX = form.closest("div").attr("id") == "step3form";
				},
				beforeSend: function(jqXHR, settings) {},
				success: function(data) {
					if (data.success == true) {
						sessionStorage.clear();
						//send data to GTM for checkout tracking
						if (!base.opc.config.form.eventFired_step3) {
							dataLayer.push({
								event: "checkoutStep",
								checkoutStep: "Confirm Order"
							});
							s.events = "event23";
							base.opc.config.form.eventFired_step3 = true;
						}

						$(window).trigger("methodRequest", [
							"gotoPage",
							{
								page: "thankyou"
							}
						]);
					} else {
						$(window).trigger("errors", [data]);
					}
				},
				error: function(data) {
					$(window).trigger("ajaxError", [
						data,
						base.opc.config.form.handlers.moveToOrderCommit.success
					]);
				}
			},

			moveToOrderCommit_ppx: {
				url: "/checkout/noSteps/singlePageSignIn.jsp",
				carturl: "/cart/shoppingCart.jsp?orderError=true",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form) {},
				beforeSend: function(jqXHR, settings) {
					//console.log('moveToOrderCommit_ppx');
					$(window).trigger("methodRequest", [
						"collapseSteps",
						{
							steps: ["#step3ACform", "#step3form", "#step2form"]
						}
					]);
				},
				success: function(data) {
					if (data.success == true) {
						$(window).trigger("methodRequest", [
							"gotoPage",
							{
								page: "thankyou"
							}
						]);
					} else {
						base.opc.config.form.current.id = "paymentFormId";
						base.opc.config.form.current.errors = data.errors;
					}
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			/**
			 * Gift Card Configurations
			 */
			paymentAddGiftCard: {
				url:
					"/checkout/noSteps/singlePageSignIn.jsp?from=applyGiftcard",
				type: "GET",
				dataType: "json",
				beforeSerialize: function(form) {
					base.opc.config.form.current.id = form.attr("id");
				},
				beforeSend: function(jqXHR, settings) {
					jQuery("div#giftcardspay div.giftcarddisp").hide(); //promocodespay

					jQuery("div#giftcardLoad").show(); //promocodespay
					$(".giftCardError").hide();
					$("#remainingBalanceId").hide();
				},
				success: function(data) {
					/* if thereare error applying the gift card, make the error section visible */
					if (typeof data.errors == "object") {
						$(
							"form[id^=paymentFormGiftCardsId]>div.has-error>div.help-block"
						).show();
					}

					jQuery("div#giftcardLoad").hide(); //promocodespay
					$("#step2, #step3_ppx").trigger("methodRequest", [
						"giftCardSuccess",
						{
							data: data
						}
					]);

					/* Trigger Update Sidebarcart */

					$(window).trigger("methodRequest", [
						"retainFormValues",
						{
							callback: function() {
								submitForm(
									$("#updateItemQty"),
									"updateItemCartQty",
									"form#shoppingCartForm"
								);
							}
						}
					]);
					/* End Trigger Update Sidebar cart */
				},
				complete: function() {},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			paymentRemoveGiftCard: {
				url:
					"/checkout/noSteps/singlePageSignIn.jsp?from=removeGiftcard",
				type: "GET",
				dataType: "json",
				beforeSerialize: function(form) {
					base.opc.config.form.current.id = form.attr("id");
				},
				beforeSend: function(jqXHR, settings) {
					jQuery("div#giftcardspay div.giftcarddisp").hide(); //promocodespay
					jQuery("div#giftcardLoad").show(); //promocodespay
				},
				success: function(data) {
					$("#step2, #step3_ppx").trigger("methodRequest", [
						"giftCardSuccess",
						{
							data: data
						}
					]);
					submitForm(
						$("#updateItemQty"),
						"updateItemCartQty",
						"form#shoppingCartForm"
					);
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			updateItemCartQty: {
				url: "/checkout/noSteps/singleShippingGroup.jsp",
				type: "POST",
				beforeSerialize: function(form) {
					base.opc.config.form.current.id = form.attr("id");
				},
				beforeSend: function(jqXHR, settings) {},
				success: function(data) {
					/* Update gift card summary */
					if (
						$(
							'input[name="/atg/commerce/order/ShoppingCartModifier.removeGiftCardIndex"]'
						).length > 0
					) {
						$(window).trigger("methodRequest", [
							"loadTemplate",
							{
								tpl: "updateGiftCardSummary"
							}
						]);
					}

					var step = base.opc.config.form.current.step;
					if (step == "3" || step == "3ac")
						$(window).trigger("methodRequest", [
							"setStep",
							{
								step: "1"
							}
						]);
					step = base.opc.config.form.current.step;
					$(window).trigger("methodRequest", [
						"loadTemplate",
						{
							tpl: "tpl_cart_update",
							data: {
								data: {
									currentStep: step
								}
							}
						}
					]);

					$(window).trigger("methodRequest", [
						"loadTemplate",
						{
							tpl: "tpl_single_part_2_3"
						}
					]);

					/* Update item summary */
					if ($("div.shippingAddressSum").length > 0) {
						$(window).trigger("methodRequest", [
							"loadTemplate",
							{
								tpl: "tpl_step1_sum_single",
								cartUpdate: true
							}
						]);
					}
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			updateGiftCardSummary: {
				url:
					"/checkout/noSteps/singlePageSignIn.jsp?from=applyGiftcard",
				type: "GET",
				dataType: "json",
				beforeSend: function(jqXHR, settings) {
					jQuery("div#giftcardspay div.giftcarddisp").hide(); //promocodespay
					jQuery("div#giftcardLoad").show(); //promocodespay
					$(".giftCardError").hide();
					$("#remainingBalanceId").hide();
				},
				success: function(data) {
					/* if thereare error applying the gift card, make the error section visible */
					if (typeof data.errors == "object") {
						$(
							"form[id^=paymentFormGiftCardsId]>div.has-error>div.help-block"
						).show();
					}

					jQuery("div#giftcardLoad").hide(); //promocodespay
					$("#step2, #step3_ppx").trigger("methodRequest", [
						"giftCardSuccess",
						{
							data: data
						}
					]);

					/* Update Sidebarcart */

					$(window).trigger("methodRequest", [
						"loadTemplate",
						{
							tpl: "tpl_cart_update"
						}
					]);

					/* Update Payment Summary */
					if ($("#step2summary").length > 0) {
						$(window).trigger("methodRequest", [
							"loadTemplate",
							{
								tpl: "tpl_step2_sum"
							}
						]);
					}
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			/**
			 * Promotions Configurations
			 */
			paymentApplyPromo: {
				url:
					"/checkout/noSteps/singlePageSignIn.jsp?from=applyPromotion",
				type: "GET",
				dataType: "json",
				beforeSerialize: function(form) {
					base.opc.config.form.current.id = form.attr("id");
				},
				beforeSend: function(jqXHR, settings) {
					jQuery("#promoLoad")
						.show()
						.not(":eq(0)")
						.remove(); // Duplicates were popping up.  This will remove them
					jQuery("#promocodespay .giftcarddisp").hide();
				},
				success: function(data) {
					$("#cartsummary").trigger("promoSuccess", [data]);
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			paymentRemovePromo: {
				url:
					"/checkout/noSteps/singlePageSignIn.jsp?from=removePromotion",
				type: "GET",
				dataType: "json",
				beforeSerialize: function(form) {
					base.opc.config.form.current.id = form.attr("id");
				},
				beforeSend: function(jqXHR, settings) {
					jQuery("div#promocodespay div.giftcarddisp").hide();
					jQuery("div#promoLoad")
						.show()
						.not(":eq(0)")
						.remove(); // Duplicates were popping up.  This will remove them.
				},
				success: function(data) {
					$("#cartsummary").trigger("promoSuccess", [data]);
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			}

			/***
			 Unused configs. Kept as backup.
			*/
			/*

			'removeItemFromCart': {
				url: '/checkout/noSteps/singleShippingGroup.jsp?action=remove',
				type: 'POST',
				//dataType: 'json',
				beforeSerialize: function (form) {
					base.opc.config.form.current.id = form.attr('id');
				},
				beforeSend: function (jqXHR, settings){
				},
				success: function(data){
					$(window).trigger('methodRequest', 'afterCartUpdate');
				},
				error: function(a,b,c) {
					function(data) {
					$(window).trigger('ajaxError', [ data ]);
				}
				}
			},*/
			/*
			'paymentSubmit_ppx_old': {
		//		url: '/checkout/noSteps/singlePageSignIn.jsp?from=addPayment&whichPaymentMethodVal=' + $('#whichPaymentMethod').val(),
				url: '/checkout/noSteps/singlePageSignIn.jsp?from=addPayment',
				type: 'POST',
				dataType: 'json',
				beforeSerialize: function (form) {

					current.form = form.attr('id');

					base.opc.isPPX = form.closest('div').attr('id') == 'step4form';
					isPPflow = form.find('#paymentSubmit_ppx').find('span').text().toLowerCase().indexOf('paypal') >= 0;

					var a = jQuery("#ccpostalCode2");

					jQuery('#ccfirstName,'+
					'#cclastName,'+
					'#ccaddress1,'+
					'#ccaddress2,'+
					'#cccity,'+
					'#ccstate,'+
					'#ccpostalCode,'+
					'#ccphoneNumber').prop('disabled',false);
					a = jQuery("#ccpostalCode2");
					jQuery('#creditCardNumberT').prop('disabled',true); // disable temporary (masked) CC field so that it is not validated on form submit
				},
				beforeSend: function (jqXHR, settings){
					NullifyEdit = true;

					if (isPPX) {
						jQuery('#step4form').css({
							position: 'absolute',
							left: -9999
						});
						jQuery('#step4load').show();
					} else {
						jQuery('#step2form').css({
							position: 'absolute',
							left: -9999
						});
						jQuery('#step2load').show();
					}
				},
				success: function (data) {
		//alert(isPPX + '\r\n' + isPPflow);
					var isPPX = base.opc.isPPX;
					if (isPPX) {
						jQuery('#step4load').hide();
					} else {
						jQuery('#step2load').hide();
					}

					if (!isPPX && data.step != "2") {
						alert("ERROR: Out of sequence");
						return false;
					}
					if (data.success != true) {
						if (isPPX) {
							jQuery('#step4form').css({ position: 'static', left: 0 });
						} else {
							jQuery('#step2form').css({ position: 'static', left: 0 });
						}
						$(window).trigger('errors', [ data.errors, current.form ]);
					} else {
						if (isPPflow) {
							document.location.href = '../opc/paypalRedirect.jsp?opcPaypal=true';
						} else if (isPPX) {
							base.opc.config.form.current.lastStep = 2;
							loadStep4Success();
						} else {
							base.opc.config.form.current.lastStep = 2;
							loadStep2Success();
						}
					}
					jQuery('.labeled:enabled:visible').showLabels();

					NullifyEdit = false;
				},
				complete: function (data) {
					jQuery('#creditCardNumberT').prop('disabled',false); // re-enable temporary (masked) CC field in case this form is shown again
				},
				error: function(data) {
					////console.log(data);
							$(window).trigger('ajaxError', [ data ]);
				}
			},*/
			/*
			'tpl_step1_sum': { // Multi-address submit summaries - items remaining = false
				url: "/checkout/noSteps/includes/multishipStep1Sum.jsp",
				type: 'GET',
				dataType: 'html',
				beforeSend: function (jqXHR, settings){
					jQuery('#step1form').slideUp(100);
					jQuery('#step1load').show();
				},
				complete: function (){
					jQuery('#step1load').hide();
				},
				success: function (data){
					////console.log(['data', data]);
					jQuery('#step1form').hide();

					jQuery('#step1info').htmlOverride(data).slideDown(500,function (){
						//jQuery('.labeled:enabled:visible').showLabels();
					});
				}
			},

			'tpl_step1_sum_cont': { // Multi-address submit summaries - items remaining = true
				url: "/checkout/noSteps/includes/multishipStep1Sum.jsp",
				type: 'GET',
				dataType: 'html',
				beforeSend: function (jqXHR, settings){
					jQuery('#step1form').slideUp(100);
					jQuery('#step1load').show();
				},
				complete: function (){
					jQuery('#step1load').hide();
				},
				success: function (data){
					////console.log([data]);
					jQuery('#step1form').hide();

					jQuery('#step1info').htmlOverride(data).slideDown(500,function (){
						//jQuery('.labeled:enabled:visible').showLabels();
					});
				}
			},

			'tpl_step1_sum_edit_multi': { // Multi-address submit summaries - items remaining = true
				url: "/checkout/noSteps/includes/multishipStep1Sum.jsp",
				type: 'GET',
				dataType: 'html',
				success: function (data){
					//jQuery('#step1form').slideDown(500);
					jQuery('#step1info').htmlOverride(data).slideDown(500,function (){
						//jQuery('.labeled:enabled:visible').showLabels();
					});
				}
			},
			*/
			/*

			'tpl_multi': {
				url: "/checkout/noSteps/includes/multishipStep1Initial.jsp",
				type: 'GET',
				dataType: 'html',
				beforeSend: function (jqXHR, settings){
					jQuery('#step1form, #step1info').slideUp(500);
					jQuery('#step1load').show();
				},
				complete: function (){
					jQuery('#step1load').hide();
				},
				success: function (data){
					base.opc.config.form.current.type = 'multi';

					jQuery('#step1form').css({ position: 'static', left: 0 });

					jQuery('#step1form').hide().htmlOverride(data).slideDown(500,function (){
						//jQuery('.labeled:enabled:visible').showLabels();

						if (jQuery.browser.safari) {
							jQuery('[id^="opc"][id$="_state"]').css('top','0px');
						} else if (jQuery.browser.mozilla) {
							jQuery('[id^="opc"][id$="_state"]').css({'top':'0px','padding-top':'3px'});
						} else if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 7) {
							jQuery('[id^="opc"][id$="_state"]').css({'top':'0px', 'height':'23px', 'font-size':'14px'});
						} else if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 8) {
							jQuery('[id^="opc"][id$="_state"]').css({'top':'2px','height':'23px'});
						} else if (jQuery.browser.msie) {
							jQuery('[id^="opc"][id$="_state"]').css('top','-1px');
						}
					});
				},
				error: function (data) {
					var objName = data;
					var tempvar = "";
					for (var vname in objName) { tempvar = tempvar + vname + ':' + objName[vname] + '\r\n'; }
					//prompt("tempvar",tempvar);
				}
			},*/
			/*
			'tpl_multi_addr': {
				url: "/checkout/noSteps/includes/multishipAddressWithForm.jsp",
				type: 'GET',
				dataType: 'html',
				beforeSend: function (jqXHR, settings){
					jQuery('#step1form, #step1info').slideUp(500);
					jQuery('#step1load').show();
				},
		//		complete: function (){
		//			setTimeout( function () {
		//				clearErrMissed();
		//			}, 100);
		//		},
				complete: function (){
					jQuery('#step1load').hide();
				},
				success: function (data){
					base.opc.config.form.current.type = 'multi';

					jQuery('#step1form').css({ position: 'static', left: 0 });
					jQuery('#step1form').hide().htmlOverride(data);
					jQuery('#step1form, #step1info').slideDown(500,function (){
						if (jQuery('#step1form').find('[id^="opcShippingFormId_Operation"]').length > 0) {
							jQuery('#step1form').find('[id^="shippingAddressOperation"]').val(jQuery(this).val());
							
							$(window).trigger('methodRequest', [ 'autoFillAddress', {
								selObj : jQuery('#step1form').find('[id^="opcShippingFormId_Operation"]')
							}]);

							if (jQuery.browser.safari) {
								jQuery('[id^="opc"][id$="_state"]').css('top','0px');
							} else if (jQuery.browser.mozilla) {
								jQuery('[id^="opc"][id$="_state"]').css({'top':'0px','padding-top':'3px'});
							} else if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 7) {
								jQuery('[id^="opc"][id$="_state"]').css({'top':'0px', 'height':'23px', 'font-size':'14px'});
							} else if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 8) {
								jQuery('[id^="opc"][id$="_state"]').css({'top':'2px','height':'23px'});
							} else if (jQuery.browser.msie) {
								jQuery('[id^="opc"][id$="_state"]').css('top','-1px');
							}
						}

						//jQuery('.labeled:enabled:visible').showLabels();
					});
				}
			},*/
		}
	};
})();
(function() {
	if (typeof window.base == "undefined") return;

	window.base.opc.config.modals = {
		shipping: "/checkout/include/shippingRates.jsp",
		taxes: "/images/html/estimatedTaxes.htm",
		empty: ""
	};
})();
(function() {
	if (typeof window.base == "undefined") return;

	window.base.opc.config.pages = {
		thankyou: "/checkout/thankYou.jsp",
		emptycart: "/cart/shoppingCart.jsp",
		editcart: "/cart/shoppingCart.jsp",
		root: "/"
	};
})();
(function($) {
	try {
		//Define the plugin's name here

		var __name = "opc";
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
			self.defaults = {
				scrollToErrors: true
			};

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
			var addresses = base.opc.config.form.addresses;
			var handlers = base.opc.config.form.handlers;
			var submitFormTimer = {};

			var aForms = {};
			var eSteps;

			var aZebraTooltips = {};

			var dig = function(sbj) {
				return self.view.find(sbj);
			};

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				//-

				eSteps = dig(".step-container");
				eSidebarCart = dig("#cartsummary");

				//- Load Cart init

				loadTemplate({
					tpl: "tpl_cart" + (base.opc.isPPX ? "_ppx" : "")
				});

				bindEvents();

				//loadTemplates();

				//- Live events
				bindLiveEvents();
			}

			function bindEvents() {
				$(window)
					.on("methodRequest", function(evt, method, args) {
						//console.log('log-methodRequest');
						if (!base.fn.und(self[method]))
							return self[method](args);
						if (!base.fn.und(window[method]))
							return window[method](args);
						//console.log('methodRequest ERROR: ' + method);
					})
					.on("errors", function(evt, data, form) {
						errorHandler(data, form);
					})
					.on("ajaxError", function(evt, data, success) {
						dig(".stepLoad").fadeOut(222);

						//check if response is JSON
						try {
							jQuery.parseJSON(data);
							redirectOnError(data);
							console.log("error data is original json");
						} catch (error) {
							// its not json
							//check if data is being messed up by moovweb
							var dom = $(document.createElement("div"));
							dom.html(data.responseText);
							var domText = dom
								.text()
								.replace(/(\r\n|\n|\r)/gm, "")
								.trim();

							if (
								!domText ||
								domText == "" ||
								domText.length < 1
							) {
								//console.warn("singleStep1 is not JSON");
								//console.warn(data);
								redirectOnError(data);
								return;
							}

							try {
								var response = jQuery.parseJSON(domText);
								if (response != "undefined") {
									if (response.success) {
										success(response);
									} else {
										//console.warn("singleStep1 is JSON, but has success:false");
										redirectOnError(response);
									}
								} else {
									//console.warn("singleStep1 is not JSON");
									//console.warn(data);
									redirectOnError(data);
								}
							} catch (error) {
								console.error("malformed error");
								console.error(data);
							}
						}

						/*
				warn({
					msg : base.opc.config.copy.ajaxError.msg,
					title : base.opc.config.copy.ajaxError.title,
					callback : function() {
						redirectOnError(data);
					},
					model: 'confirm',
					btn_ok: 'OK'
				});*/
					})
					.on("cartUpdated", function(evt) {
						eSteps.trigger("cartUpdate");
					})
					.on("clearErrors", function() {
						clearAllErrors();
					});

				//- on ajax success event
				$(document).on("ajaxSuccess", function(evt, xhr, s) {
					bindViewEvents();
				});

				//INIT STEP TEMPLATES---------------------------------------------
				$(document).ready(function() {
					defineFormErrorRules();
					paypalExpressTemplate();
					singleShippingGroupTemplate();
				});

				dig("#restartCheckout")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						var href = $(this).attr("href");
						$(window).trigger("methodRequest", [
							"warn",
							{
								msg: base.opc.config.copy.leavingCart.msg,
								title: base.opc.config.copy.leavingCart.title,
								callback: function() {
									document.location.href = href;
								},
								model: "confirm",
								btn_ok: "OK"
							}
						]);
					});
			}

			function bindViewEvents() {
				bindCommonMasks();

				//- "Why" tooltips
				$(".gwwhyLink")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();

						var id = $(this).attr("id"),
							msgElem = $(
								"span#giftNotEligibleMessage" +
									id.replace(/[^0-9\_]+/, "")
							);

						//$('*').qtip('destroy');
						var self = $(this),
							msg = $(msgElem).text();
						killTooltip(self, function() {
							doTooltip(self, msg, "black");
						});
					});

				// - handle question mark on step 2 checkout for GiftCard
				$(".pintriggerHelpClass")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();

						var id = $(this).attr("id"),
							msgElem = $("span#pintriggerHelpSpan");

						//$('*').qtip('destroy');
						var self = $(this),
							msg = $(msgElem).html();
						doTooltip(self, msg, "black");
					});

				$(".CVVHelp")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();

						msgElem = $("span.CVVHelpInfo");

						killTooltip($(this), null);

						//$('*').qtip('destroy');
						var self = $(this),
							msg = $(msgElem).html();
						doTooltip(self, msg, "black");
					});
			}

			/***
		 @bindLiveEvents
		 Events copied from "old" checkout code. Unaltered.
		*/
			function bindLiveEvents() {
				// IE fix for no selection
				$(".noselect").on("selectstart", function() {
					return false;
				});

				$("a.editvcardgiftmsg")
					.show()
					.on("click", function(e) {
						var thisId = $(this).attr("id");
						thisId = thisId.split("_")[1];
						e.preventDefault();

						$("#vcardGiftMsgId_" + thisId).toggle();

						if ($("#vcardGiftMsgId_" + thisId).is(":visible")) {
							$(this).hide(); //text('save gift message');
						} else {
							$(this).text("edit gift message");
							submitForm(
								$(this),
								"tpl_single_part_2_3",
								"form#singleshipformid"
							);
						}
					});

				$("div.editvcardgiftmsg").hide();

				if ($(".giftoptions.left").length > 0) {
					$("#giftopt1").show();

					$(".giftoptions.left>ul>li").each(function() {
						if ($.browser.msie) {
							var lineHeight = parseInt(
								$(this).css("lineHeight"),
								10
							);
							while ($(this).height() > lineHeight) {
								elem = $(this);
								while (elem.children().size() > 0) {
									elem = $(elem).children(":first");
								}

								var txt = elem.text();
								txt = txt.replace(/^\s+|\s+$/g, "");

								elem.text(
									txt.substr(0, txt.length - 5) + " ..."
								);
								if (txt.indexOf(" ") > -1) {
									elem.text(
										txt.substring(0, txt.lastIndexOf(" ")) +
											"..."
									);
								} else {
									elem.text(
										txt.substr(0, txt.length - 4) + "..."
									);
								}
							}
						} else {
							var properWidth = $(this).outerWidth() - 16,
								child = $(this).find("span");

							while ($(child).outerWidth() > properWidth) {
								var txt = $(child).text();
								txt = txt.replace(/^\s+|\s+$/g, "");
								if (txt.indexOf(" ") > -1) {
									$(child).text(
										txt.substring(0, txt.lastIndexOf(" ")) +
											"..."
									);
								} else {
									$(child).text(
										txt.substr(0, txt.length - 4) + "..."
									);
								}
							}
						}
					});

					$("#giftopt1").hide();
				}

				/***************************/
				/* SLT HARDGOOD ITEM SPLIT */
				/***************************/
				$(".regItemChk").on("change", function(e) {
					// e.preventDefault();
					var thisFrom = $(this)
						.attr("id")
						.split("_")[0]
						.substring(0, 3);
					var thisIndex = $(this)
						.attr("id")
						.split("_")[1];
					var thisSku = $(this)
						.attr("id")
						.split("_")[2];

					if ($(this).prop("checked")) {
						var qtyVal = $(
							"#regItemTotQty_" + thisIndex + "_" + thisSku
						).text();
						$("#regItemSelect_" + thisIndex + "_" + thisSku).val(
							qtyVal
						);
						$("#regItemHiddenQty_" + thisIndex + "_" + thisSku).val(
							qtyVal
						);

						$(
							'[id^="giftWrapProd_"][id$="' + thisSku + '"]'
						).removeClass("hideThis");
					} else {
						$("#regItemHiddenQty_" + thisIndex + "_" + thisSku).val(
							"0"
						);

						$("#regItemAllQty_" + thisIndex + "_" + thisSku).show();
						$(
							"#regItemSelectQty_" + thisIndex + "_" + thisSku
						).hide();
						$("#regItemQtyP_" + thisIndex + "_" + thisSku).hide();

						$(
							'[id^="giftWrapProd_"][id$="' + thisSku + '"]'
						).addClass("hideThis");
					}

					if (
						$('[id^="giftWrapProd_"]:not([class~="hideThis"])')
							.length > 0
					) {
						if (
							$(
								'.giftWrapEligible[id^="giftWrapProd_"]:not([class~="hideThis"])'
							).length ==
							$(
								'.giftWrapEligible.giftWrapGiftCardItem[id^="giftWrapProd_"]:not([class~="hideThis"])'
							).length
						) {
							$(".orderLevelGiftMessageForm").addClass(
								"hideThis"
							);
						} else {
							$(".orderLevelGiftMessageForm").removeClass(
								"hideThis"
							);
						}

						$(".multishipNoneSelected").addClass("hideThis");
					} else {
						$(".multishipNoneSelected").removeClass("hideThis");

						$(".orderLevelGiftMessageForm").removeClass("hideThis");
					}

					//$('#putTextHere').html( $('#putTextHere').html() + '2:<br />' + 'thisFrom: ' + thisFrom + '<br />thisIndex: ' + thisIndex + '<br />thisSku: ' + thisSku + '<br />regItemHiddenQty: ' + $(this).parents('li').find('[id^="regItemHiddenQty_"]').val() + '<br /><br />' );
					showTotal();
				});

				$(".regItemSelect").on("change", function(e) {
					var thisIndex = $(this)
						.attr("id")
						.split("_")[1];
					var thisSku = $(this)
						.attr("id")
						.split("_")[2];

					var qtyVal = $(
							"#regItemSelect_" + thisIndex + "_" + thisSku
						).val(),
						qtyTot = $(
							"#regItemTotQty_" + thisIndex + "_" + thisSku
						).text();
					$("#regItemHiddenQty_" + thisIndex + "_" + thisSku).val(
						qtyVal
					);

					$("#regItemQtyP_" + thisIndex + "_" + thisSku).show();

					if (qtyTot - qtyVal == 1) {
						$("#regItemQty_" + thisIndex + "_" + thisSku).text(
							"1 unit"
						);
					} else {
						$("#regItemQty_" + thisIndex + "_" + thisSku).text(
							qtyTot - qtyVal + " units"
						);
					}

					if (e.type == "change") {
						var countSkus = 1;
						var showSkusList = "";
						$(
							'[id^="giftWrapProd_"][id$="' + thisSku + '"]'
						).addClass("hideThis");
						$('[id^="giftWrapProd_"][id$="' + thisSku + '"]').each(
							function() {
								if (countSkus <= qtyVal) {
									showSkusList =
										showSkusList +
										$(this)
											.attr("id")
											.split("_")[1] +
										",";
								}
								countSkus++;
							}
						);
						showSkusList = showSkusList.substring(
							0,
							showSkusList.length - 1
						);
						showSkusArray = showSkusList.split(",");
						for (var x = 0; x < showSkusArray.length; x++) {
							$(
								"#giftWrapProd_" +
									showSkusArray[x] +
									"_" +
									thisSku
							).removeClass("hideThis");
						}
						showTotal();
					}

					$(".multishipNoneSelected").addClass("hideThis");
				});

				$(".regItemSplit").on("click", function(e) {
					e.preventDefault();

					var thisIndex = $(this)
						.attr("id")
						.split("_")[1];
					var thisSku = $(this)
						.attr("id")
						.split("_")[2];

					//$('[id^="regItemChk_'+nItem+'"]').prop('checked',true);
					$("#regItemChk_" + thisIndex + "_" + thisSku).prop(
						"checked",
						true
					);

					$("#regItemAllQty_" + thisIndex + "_" + thisSku).hide();
					$("#regItemSelectQty_" + thisIndex + "_" + thisSku).show();

					var qtyVal = $(
						"#regItemTotQty_" + thisIndex + "_" + thisSku
					).text();
					$("#regItemSelect_" + thisIndex + "_" + thisSku).val(
						qtyVal
					);
					$("#regItemHiddenQty_" + thisIndex + "_" + thisSku).val(
						qtyVal
					);

					$(
						'[id^="giftWrapProd_"][id$="' + thisSku + '"]'
					).removeClass("hideThis");

					$(".multishipNoneSelected").addClass("hideThis");

					showTotal();
				});

				/***********************/
				/* DROPSHIP ITEM SPLIT */
				/***********************/
				$(".vendItemChk").on("change", function(e) {
					// e.preventDefault();

					var thisFrom = $(this)
						.attr("id")
						.split("_")[0]
						.substring(0, 3);
					var thisIndex = $(this)
						.attr("id")
						.split("_")[1];
					var thisSku = $(this)
						.attr("id")
						.split("_")[2];

					if ($(this).prop("checked")) {
						var qtyVal = $(
							"#vendItemTotQty_" + thisIndex + "_" + thisSku
						).text();
						$("#vendItemSelect_" + thisIndex + "_" + thisSku).val(
							qtyVal
						);
						$(
							"#vendItemHiddenQty_" + thisIndex + "_" + thisSku
						).val(qtyVal);

						$(
							'[id^="giftWrapProd_"][id$="' + thisSku + '"]'
						).removeClass("hideThis");
					} else {
						$(
							"#vendItemHiddenQty_" + thisIndex + "_" + thisSku
						).val("0");

						$(
							"#vendItemAllQty_" + thisIndex + "_" + thisSku
						).show();
						$(
							"#vendItemSelectQty_" + thisIndex + "_" + thisSku
						).hide();
						$("#vendItemQtyP_" + thisIndex + "_" + thisSku).hide();

						$(
							'[id^="giftWrapProd_"][id$="' + thisSku + '"]'
						).addClass("hideThis");
					}

					if (
						$('[id^="giftWrapProd_"]:not([class~="hideThis"])')
							.length > 0
					) {
						$(".multishipNoneSelected").addClass("hideThis");
					} else {
						$(".multishipNoneSelected").removeClass("hideThis");
					}

					showTotal();
				});

				$(".vendItemSelect").on("focus blur change", function(e) {
					var thisIndex = $(this)
						.attr("id")
						.split("_")[1];
					var thisSku = $(this)
						.attr("id")
						.split("_")[2];

					var qtyVal = $(
							"#vendItemSelect_" + thisIndex + "_" + thisSku
						).val(),
						qtyTot = $(
							"#vendItemTotQty_" + thisIndex + "_" + thisSku
						).text();
					$("#vendItemHiddenQty_" + thisIndex + "_" + thisSku).val(
						qtyVal
					);

					$("#vendItemQtyP_" + thisIndex + "_" + thisSku).show();

					if (qtyTot - qtyVal == 1) {
						$("#vendItemQty_" + thisIndex + "_" + thisSku).text(
							"1 unit"
						);
					} else {
						$("#vendItemQty_" + thisIndex + "_" + thisSku).text(
							qtyTot - qtyVal + " units"
						);
					}

					if (e.type == "change") {
						var countSkus = 1;
						var showSkusList = "";
						$(
							'[id^="giftWrapProd_"][id$="' + thisSku + '"]'
						).addClass("hideThis");
						$('[id^="giftWrapProd_"][id$="' + thisSku + '"]').each(
							function() {
								if (countSkus <= qtyVal) {
									showSkusList =
										showSkusList +
										$(this)
											.attr("id")
											.split("_")[1] +
										",";
								}
								countSkus++;
							}
						);
						showSkusList = showSkusList.substring(
							0,
							showSkusList.length - 1
						);
						showSkusArray = showSkusList.split(",");
						for (var x = 0; x < showSkusArray.length; x++) {
							$(
								"#giftWrapProd_" +
									showSkusArray[x] +
									"_" +
									thisSku
							).removeClass("hideThis");
						}
						showTotal();
					}
				});

				$(".vendItemSplit").on("click", function(e) {
					e.preventDefault();

					var thisIndex = $(this)
						.attr("id")
						.split("_")[1];
					var thisSku = $(this)
						.attr("id")
						.split("_")[2];

					//$('[id^="vendItemChk_'+nItem+'"]').prop('checked',true);
					$("#vendItemChk_" + thisIndex + "_" + thisSku).prop(
						"checked",
						true
					);

					$("#vendItemAllQty_" + thisIndex + "_" + thisSku).hide();
					$("#vendItemSelectQty_" + thisIndex + "_" + thisSku).show();

					var qtyVal = $(
						"#vendItemTotQty_" + thisIndex + "_" + thisSku
					).text();
					$("#vendItemSelect_" + thisIndex + "_" + thisSku).val(
						qtyVal
					);
					$("#vendItemHiddenQty_" + thisIndex + "_" + thisSku).val(
						qtyVal
					);

					$(
						'[id^="giftWrapProd_"][id$="' + thisSku + '"]'
					).removeClass("hideThis");

					$(".multishipNoneSelected").addClass("hideThis");

					showTotal();
				});
			}

			/*
                ** Defines Custom jQuery Validator rules used in base.opc.config.form.js
                **
                */
			function defineFormErrorRules() {
				//define validator rules
				jQuery.validator.addMethod(
					"noPOBox",
					function(value, element) {
						var poBox = /^ *((#\d+)|((box|bin)[-. \/\\]?\d+)|(.*p[ \.]? ?(o|0)[-. \/\\]? *-?((box|bin)|b|(#|num)?\d+))|(p(ost)? *(o(ff(ice)?)?)? *((box|bin)|b)? *\d+)|(p *-?\/?(o)? *-?box)|post office box|((box|bin)|b) *(number|num|#)? *\d+|(num|number|#) *\d+)/i;

						return this.optional(element) || !poBox.test(value);

						/*
                        var matches = [ //"box" can be substituted for "bin" 
                            "#123", 
                            "Box 123", 
                            "Box-122", 
                            "Box122", 
                            "HC73 P.O. Box 217", 
                            "P O Box125", 
                            "P. O. Box", 
                            "P.O 123", 
                            "P.O. Box 123", 
                            "P.O. Box", 
                            "P.O.B 123",
                            "P.O.B. 123", 
                            "P.O.B.", 
                            "P0 Box", 
                            "PO 123", 
                            "PO Box N", 
                            "PO Box", 
                            "PO-Box", 
                            "POB 123", 
                            "POB", 
                            "POBOX123",
                            "Po Box", 
                            "Post 123", 
                            "Post Box 123", 
                            "Post Office Box 123", 
                            "Post Office Box", 
                            "box #123", 
                            "box 122", 
                            "box 123", 
                            "number 123", 
                            "p box", 
                            "p-o box", 
                            "p-o-box", 
                            "p.o box", 
                            "p.o. box", 
                            "p.o.-box", 
                            "p.o.b. #123", 
                            "p.o.b.", 
                            "p/o box", 
                            "po #123", 
                            "po box 123", 
                            "po box", 
                            "po num123", 
                            "po-box", 
                            "pobox", 
                            "pobox123", 
                            "post office box" 
                        ];

                        var nonMatches = [ 
                            "The Postal Road", 
                            "Box Hill", 
                            "123 Some Street", 
                            "Controller's Office", 
                            "pollo St.", 
                            "123 box canyon rd", 
                            "777 Post Oak Blvd", 
                            "PSC 477 Box 396", 
                            "RR 1 Box 1020" 
                        ]; */
					},
					"* Amount must be greater than zero"
				);
			}

			function showTotal() {
				var itemCurrentFrom = "";
				var itemCurrentIndex = "";
				var itemCurrentId = "";

				setTimeout(function() {
					var allItems = 0;
					$(".checkboxSelected:checkbox").each(function() {
						itemAllFrom = $(this)
							.attr("id")
							.split("_")[0]
							.substring(0, 3);
						itemAllIndex = $(this)
							.attr("id")
							.split("_")[1];
						itemAllId = $(this)
							.attr("id")
							.split("_")[2];
						if (itemAllFrom == "reg") {
							allItems =
								allItems +
								$(
									"#regItemHiddenQtyAll_" +
										itemAllIndex +
										"_" +
										itemAllId
								).val() *
									1;
						} else if (itemAllFrom == "ven") {
							allItems =
								allItems +
								$(
									"#vendItemHiddenQtyAll_" +
										itemAllIndex +
										"_" +
										itemAllId
								).val() *
									1;
						}
					});
					//alert('allItems: ' + allItems);

					var itemsLeft = 0;
					$(".checkboxSelected:checkbox").each(function() {
						itemCurrentFrom = $(this)
							.attr("id")
							.split("_")[0]
							.substring(0, 3);
						itemCurrentIndex = $(this)
							.attr("id")
							.split("_")[1];
						itemCurrentId = $(this)
							.attr("id")
							.split("_")[2];
						if ($(this).is(":checked")) {
							if (itemCurrentFrom == "reg") {
								itemsLeft =
									itemsLeft +
									$(
										"#regItemHiddenQty_" +
											itemCurrentIndex +
											"_" +
											itemCurrentId
									).val() *
										1;
							} else if (itemCurrentFrom == "ven") {
								// itemCurrentFrom == 'ven' --> vendor
								itemsLeft =
									itemsLeft +
									$(
										"#vendItemHiddenQty_" +
											itemCurrentIndex +
											"_" +
											itemCurrentId
									).val() *
										1;
							}
						}
					});
					//alert('itemsLeft: ' + itemsLeft);

					if (allItems - itemsLeft == 0) {
						$("#itemsToSelect1more").addClass("hideThis");
						$("#itemsToSelect1continue").removeClass("hideThis");
						$("#itemsToSelect2more").addClass("hideThis");
						$("#itemsToSelect2continue").removeClass("hideThis");
						$("#totalQtyRem").text(allItems - itemsLeft);
					} else {
						$("#itemsToSelect1more").removeClass("hideThis");
						$("#itemsToSelect1continue").addClass("hideThis");
						$("#itemsToSelect2more").removeClass("hideThis");
						$("#itemsToSelect2continue").addClass("hideThis");
						$("#totalQtyRem").text(allItems - itemsLeft);
					}
					if (allItems - itemsLeft == 1) {
						$("#totalQtyRemSing").addClass("hideThis");
					} else {
						$("#totalQtyRemSing").removeClass("hideThis");
					}
				}, 250);
			}

			function errortip(el, msg, color) {
				var nZT = parseInt(
					new Date().getUTCMilliseconds() * Math.random(10000)
				);
				el.attr("data-zebra-ref", nZT);

				el
					.siblings("div.help-block")
					.first()
					.html(msg);
			}

			function doTooltip(el, msg, color) {
				var nZT = parseInt(
					new Date().getUTCMilliseconds() * Math.random(10000)
				);
				el.attr("data-zebra-ref", nZT);

				aZebraTooltips[nZT] = new $.Zebra_Tooltips(el, {
					position: "right",
					max_width: 315,
					color: base.fn.und(color) ? "#FF0000" : color,
					background_color: "#FDFDFD",
					content: msg,
					vertical_offset: 28, //el.parent().hasClass('ccnum') ? 56 : 28, //- weird offset on CC fields, HACK
					horizontal_offset: 35
				});
				aZebraTooltips[nZT].show(el, true);
			}

			function killTooltip(el, callback) {
				var nZT = parseInt(el.attr("data-zebra-ref"));
				base.fn.und(aZebraTooltips[nZT]) ||
					(function() {
						el.removeAttr("data-zebra-ref");
						aZebraTooltips[nZT].hide(el, true);
						aZebraTooltips[nZT] = null;
						delete aZebraTooltips[nZT];
					})();

				base.fn.und(callback) || callback();
			}

			function errorHandler(data, form) {
				global_hideMask();
				clearAllErrors();

				//- notify steps of error event
				eSteps.trigger("stepErrors");

				console.log(["errorHandler", data]);

				var step = getStep();
				var opts = {
					padding: 50,
					scrollSpeed: 222,
					callback: function() {
						setTimeout(function() {
							$.each(aTooltips, function(k, v) {
								errortip(v.el, v.msg);
							});
						}, 400);
					}
				};
				var map = base.opc.config.form.errorMap;
				var aTooltips = [];

				if (
					typeof data.errors == "object" &&
					typeof data.errors.shipmentRestriction == "string"
				) {
					$(
						"div.checkoutbox[data-gutter-toggle=shipMethHoverMessage]>div.shippingErrorMessage"
					)
						.html(data.errors.shipmentRestriction)
						.show();
					var selectedMethod = $("input[id^=shipping-][checked]");
					if (selectedMethod.length == 1) {
						selectedMethod.attr("checked", false);
					}
					$(
						"div.checkoutbox[data-gutter-toggle=shipMethHoverMessage] label[for^=shipping-]"
					).removeClass("active");
				}

				//console.log(['errorHandler data: ', data]);
				//- address validation
				if (
					step == "1" &&
					!base.opc.isPPX &&
					typeof data.actualAddress == "object"
				) {
					$(window).trigger("fedexAddressValidationCheck", [data]);
					return;
				}

				//- some json don't have the errors object. If any json key is part of the errorMap config, add it to the errors object.
				if (base.fn.und(data.errors)) data.errors = {};
				$.each(data, function(k, v) {
					if (!base.fn.und(map[k])) {
						data.errors[k] = v;
						data.step = map[k]["step"];
					}
				});

				//assign listener to everything with 'err' class
				//trigger assigning tooltips via opts.callback()
				var fn = function() {
					var eErr = dig(".err");
					!eErr.eq(0).length || !self.options.scrollToErrors
						? opts.callback()
						: eErr.eq(0).scroll2(opts);

					eErr.off("focus").on("focus", function(evt) {
						$(this)
							.removeClass("errRedBorder")
							.off("focus");
						killTooltip($(this));
					});

					data.step == "cartUpdate" ||
						setStep({
							step: base.opc.isPPX ? "4" : data.step //- always use step 4 for PPX
						});
				};

				if (!base.fn.und(data.itemId))
					eSidebarCart.trigger("quantityError", [
						data.itemId,
						data.previousQty
					]);

				if (!base.fn.und(data.itemId)) {
					var errorContainer = $("#errorContainer_" + data.itemId);
					var errorLabel = $("#errorLabel_" + data.itemId);
					if (errorContainer) {
						$(errorContainer).css("display", "block");
						var errorMessage = "";
						$.each(data.errors, function(k, v) {
							errorMessage = errorMessage + " " + v;
						});

						$(errorLabel).html(errorMessage);
						$("#" + data.itemId).addClass("errorHighlight");
					}
				}

				//iterate over errors and assign 'err' class
				$.each(data.errors, function(k, v) {
					if (!base.fn.und(map[k])) {
						var el = dig(
							map[k]["selector"] +
								(base.fn.und(data.itemId) ? "" : data.itemId)
						); // itemId special case for cart quantity

						if (
							String(data.step) == map[k]["step"] ||
							map[k]["step"] == null
						) {
							aTooltips.push({
								el: el,
								msg: v
							});
						}
						el.closest(".form-group").addClass("has-error"); //bootstrap
						el.addClass("err");
						switch (el.getInputType()) {
							case "text":
							case "textarea":
							case "select":
								//case 'radio':
								//case 'checkbox':
								//el.addClass('errRedBorder');
								break;
							default:
								break;
						}
					}
				});

				//SCROLL TO FIRST ERROR
				var firstError = $(".has-error").first();

				if (firstError.length) {
					//expand accordion if error is inside an accordion
					firstError.closest(".panel-collapse").collapse("show");
					//scroll to error
					$("html, body").animate(
						{
							scrollTop: firstError.offset().top
						},
						200
					);
				}

				//- Special error attentions
				/*
			if(!base.fn.und(data.errors['shipmentRestriction'])) {
				$('#step1form form').slideDown(666, function() {
					fn();
				});
				return;
			}*/
				fn();
			}

			function bindCommonMasks() {
				//- Phone mask
				dig("input.mask-phone")
					.unmask()
					.mask("999-999-9999", {
						//placeholder: '___-___-____',
						translation: {
							9: {
								pattern: /[0-9-]/
							}
						}
					});
				//- Zip mask
				/*dig('input.mask-zip').unmask().mask("99999", {
				//placeholder: '_____'
			});*/

				//Trigger zip validation
				//Will override the zip mask if zip is APO
				$("#singleshipformid").zipValidation({
					zipField: "#sszip"
				});
			}

			function redirectOnError(data) {
				console.log("redirectOnError");
				console.log(data);

				var pageName = $("#opcPageName").attr("data-opcPageName");
				if (
					!pageName ||
					pageName == "undefined" ||
					pageName.length == 0
				) {
					pageName = "singleShippingGroup.jsp";
				}

				window.location =
					"/checkout/opc/" +
					pageName +
					"?errorRedirect=" +
					data.state();
			}
			//- Public callbacks
			//- ---------------------------------------------------------

			var warn = (self.warn = function(args) {
				var opt = {
					msg: "",
					title: "",
					btn: "OK",
					callback: function() {},
					model: "alert"
				};

				opt = $.extend({}, opt, args);

				$.fn
					.SimpleModal({
						btn_ok: opt.btn,
						title: opt.title,
						model: opt.model,
						contents: opt.msg,
						overlayClick: false,
						callback: opt.callback,
						hideHeader: opt.title == ""
					})
					.showModal();
			});

			var templateLoaded = (self.templateLoaded = function() {
				bindViewEvents();
			});

			var clearError = (self.clearError = function(args) {
				var el = dig(
					base.opc.config.form.errorMap[args.key]["selector"]
				);
				if (!el.length) return;

				nZF = parseInt(el.attr("data-zebra-ref"));
				aZebraTooltips[nZF].hide(el, true);

				el
					.attr("title", el.attr("data-label-text"))
					.removeClass("errMissed")
					.removeClass("errRedBorder")
					.removeClass("err");
			});

			var clearAllErrors = (self.clearAllErrors = function(args) {
				dig("[data-zebra-ref]").each(function() {
					killTooltip($(this));
				});

				dig(".Zebra_Tooltip").fadeOut(666, function() {
					$(this).hide();
				});

				dig(".errMissed").each(function() {
					$(this).attr("title", $(this).attr("data-label-text"));
					$(this).removeClass("errMissed");
				});
				dig(".errRedBorder").each(function() {
					$(this).attr("title", $(this).attr("data-label-text"));
					$(this)
						.removeClass("errRedBorder")
						.removeClass("err");
				});

				window.base.opc.config.form.validatorRules.clearErrors(
					"#singleshipformid"
				);
			});

			var updateStepsAfterAccountCreation = (self.updateStepsAfterAccountCreation = function() {
				var step = 1,
					max = 3,
					aRemove = [
						"#step3AChead",
						"#step3ACinfo",
						"#step3ACform",
						"#step3ACload"
					];

				if (!base.opc.user.isTransient)
					dig("#step3AChead .label").text(
						base.opc.config.copy.accountCreatedStepLabel
					);
				//- remove step3AC sections
				$.each(aRemove, function(k, v) {
					//dig(v).remove();
				});
			});

			var editLinkAnimate = (self.editLinkAnimate = function(args) {
				var step = args.step;
				action = args.action;
				//console.log('step: ' + step);
				switch (action) {
					case "show":
						dig("#step" + step + "head .editLink")
							.show()
							.animate(
								{
									right: "18px",
									opacity: 1
								},
								666,
								function() {}
							);
						/*
					dig('#step' + step + 'head span.label')
					.show()
					.animate({
						left : '-100%',
						opacity : 0
					}, 666, function() {});*/
						break;
					case "hide":
						dig("#step" + step + "head .editLink")
							.show()
							.animate(
								{
									right: "200px",
									opacity: 0
								},
								666,
								function() {
									$(this).hide();
								}
							);
						/*
					dig('#step' + step + 'head span.label')
					.show()
					.animate({
						left : '18px',
						opacity : 1
					}, 666, function() {});*/
						break;
				}
			});

			var setStep = (self.setStep = function(args) {
				window.base.opc.config.form.current.step = String(args.step);
			});

			var getStep = (self.getStep = function() {
				return String(base.opc.config.form.current.step);
			});

			var editLinkAction = (self.editLinkAction = function(args) {
				var sStep = args.step;
				var bHideOthers = base.fn.und(args.hideOthers)
					? false
					: args.hideOthers;
				var aCollapseSteps = base.fn.und(args.collapseSteps)
					? []
					: args.collapseSteps;
				var tpl = base.fn.und(args.tpl) ? "" : args.tpl;

				clearAllErrors();

				setStep({
					step: sStep
				});

				collapseSteps({
					steps: aCollapseSteps
				});

				loadTemplate({
					tpl: tpl
				});

				setMode("edit");

				//- Hide edit link, show label
				editLinkAnimate({
					action: "hide",
					step: sStep
				});

				!bHideOthers ||
					dig(".editLink")
						.not('[rel="' + sStep + '"]')
						.each(function() {
							editLinkAnimate({
								action: "hide",
								step: $(this).attr("rel")
							});
						});
			});

			var setMode = (self.setMode = function(mode) {
				base.opc.mode = mode;
			});

			var loadTemplate = (self.loadTemplate = function(args) {
				//console.log('loadTemplate: ' + args.tpl);

				//-
				args =
					typeof args == "object"
						? args
						: {
								tpl: args,
								data: {},
								submit: "",
								cartUpdate: false,
								clearErrors: true,
								callback: function() {}
							};

				var tpl = args.tpl;
				var data = args.data;
				var submit = args.submit;
				var cartUpdate = args.cartUpdate;
				var clearErrors = args.clearErrors;
				var callback = args.callback;
				//console.log('cartUpdate: ' + cartUpdate);

				$.each(tpl instanceof Array ? tpl : [tpl], function(k, t) {
					//- From cart update ?
					handlers[t].cartUpdate = base.fn.und(cartUpdate)
						? false
						: cartUpdate;

					t != "tpl_cart" ||
						(function() {
							handlers[t].data = {
								currentStep:
									window.base.opc.config.form.current.step
							};
						})();
					//console.log(t + ' : ' + handlers[t].cartUpdate);

					if (!base.fn.und(handlers[t])) {
						var d = $.extend(true, handlers[t], {
							ifModified: false,
							async: true,
							data: {
								_rand: Math.random()
							}
						});

						if (!base.fn.und(data)) d = $.extend({}, d, data);
						//- merge success function and callback together
						if (!base.fn.und(callback)) {
							var success = d.success;
							d.success = function(data) {
								success(data);
								callback();
							};
						}
						!base.fn.und(submit)
							? $("<form/>").ajaxSubmit(d)
							: $.ajax(d);
					} else {
						alert(
							"Error Loading Form Template: Invalid Configuration Type. Please contact administrator with code: " +
								t
						);
					}

					if (data && data.showErrors === true) {
						dig(".formLevelError").show();
					} else {
						!clearErrors || clearAllErrors();
						dig(".generatedError").remove();
						dig(".formLevelError").hide();
					}
				});
			});

			var submitForm = (self.submitForm = function(args) {
				//console.log('log-submitForm');
				var obj, cnf, form, loadDiv, isAsync;

				obj = args.obj;
				cnf = args.cnf;
				form = args.form;
				loadDiv = args.loadDiv;
				isAsync = args.isAsync;
				callback = args.callback;

				console.trace("log-obj : ");
				console.log(obj);
				console.log("log-cnf : ");
				console.log(cnf);
				console.log("log-form : ");
				console.log(form);
				//console.log(submitFormTimer);
				//console.log(submitFormTimer[cnf]);

				if (base.fn.und(cnf)) return;

				if (obj.hasClass("disabled")) return false;

				setMode("");

				dig(".generatedError").remove();
				dig(".formLevelError").hide();

				if (base.fn.und(form) || form == "") {
					// Don't believe this should ever get hit?
					// alert('function.js -> submitForm -> typeof form == undefined');
					var form =
						"form#" +
						$(obj)
							.parents("div.step:first>form")
							.attr("id");
				}
				dig(form)
					.find(".errRedBorder")
					.each(function() {
						var thisElemId = $(this).attr("id");
						var thisElem = dig("#" + thisElemId);

						if (typeof thisElem.attr("errtitle") != "undefined") {
							thisElem.prop("errtitle", null);
						}
						if (typeof thisElem.data("temptitle") != "undefined") {
							thisElem.attr("title", thisElem.data("temptitle"));
							thisElem.removeData("temptitle");
						}
					});
				clearAllErrors();

				//alert(base.opc.config.form.handlers.hasOwnProperty(cnf) +'|'+ $(form).length);
				if (!base.fn.und(handlers[cnf]) && $(form).length > 0) {
					if (typeof isAsync == "undefined") {
						var isAsync = "";
					}
					var asyncState =
						isAsync.toLowerCase() == "no" ? false : true;
					var d = $.extend(true, base.opc.config.form.handlers[cnf], {
						ifModified: false,
						async: asyncState,
						data: {
							_rand: Math.random()
						}
					});

					if (cnf.substr(0, 4) == "tpl_") {
						currEditIndex = dig(obj)
							.children("em")
							.text();
						if (typeof loadDiv == "undefined" || loadDiv == "") {
							dig(form).ajaxSubmit(d);
						} else {
							dig("#" + loadDiv).ajaxSubmit(d);
						}
						return false;
					}

					if (cnf.toLowerCase() == "noconf") {
						// Was going to be used with PayPal Express: From paypalExpress.jsp (step2Initial2_ppx.jsp), the top form does not require a configuration to be loaded
						dig(form).ajaxSubmit(d);
						return false;
					}

					base.fn.und(callback) ||
						(function() {
							d.success = callback;
						})();

					dig(form).ajaxSubmit(d);
				} else if (
					typeof loadDiv != "undefined" &&
					loadDiv != "" &&
					!base.fn.und(handlers[cnf]) &&
					cnf.substr(0, 4) == "tpl_"
				) {
					currEditIndex = dig(obj)
						.children("em")
						.text();

					dig("#" + loadDiv).ajaxSubmit(
						base.opc.config.form.handlers[cnf]
					);

					return false;
				} else {
					alert(
						"Error Submitting Form: Invalid Configuration Type. Please contact administrator with code: " +
							cnf
					);
				}
			});

			var retainFormValues = (self.retainFormValues = function(args) {
				dig("form[id]").each(function() {
					var id = $(this).attr("id");
					aForms[id] = {}; //:not([type="hidden"])

					$(this)
						.find("input, select, textarea, checkbox, radio")
						.each(function() {
							switch ($(this).getInputType()) {
								case "checkbox":
									if ($(this).is(":checked"))
										aForms[id][$(this).attr("name")] = true;
									else
										aForms[id][
											$(this).attr("name")
										] = false;
									break;
								case "radio":
									if ($(this).is(":checked"))
										aForms[id][$(this).attr("name")] = $(
											this
										).val();
									break;
								default:
									aForms[id][$(this).attr("name")] = $(
										this
									).val();
									break;
							}
						});
				});

				//force retain shipping email address & gift message fields
				var emailVal =
					dig("form#singleshipformid #ereceiptAddr1Top").length > 0
						? dig("form#singleshipformid #ereceiptAddr1Top").val()
						: "";
				aForms["singleshipformidForce"] = {};
				if (emailVal.length > 0) {
					aForms["singleshipformidForce"]["ereceiptAddr1Top"] = dig(
						"form#singleshipformid #ereceiptAddr1Top"
					).val();
				}
				aForms["singleshipformidForce"]["giftWrapMessageLine1"] = dig(
					"form#singleshipformid .giftWrapMessageLine1"
				).val();
				aForms["singleshipformidForce"]["giftWrapMessageLine2"] = dig(
					"form#singleshipformid .giftWrapMessageLine2"
				).val();
				aForms["singleshipformidForce"]["giftWrapMessageLine3"] = dig(
					"form#singleshipformid .giftWrapMessageLine3"
				).val();
				aForms["singleshipformidForce"]["giftWrapMessageLine4"] = dig(
					"form#singleshipformid .giftWrapMessageLine4"
				).val();
				aForms["singleshipformidForce"]["ssgift"] = dig(
					"form#singleshipformid #ssgift"
				).prop("checked");

				//sessionStorage.setItem("aForms",JSON.stringify(aForms));

				base.fn.und(args.callback) || args.callback();
			});

			var formValuesRetained = (self.formValuesRetained = function(args) {
				//console.log(['formValuesRetained args', args]);
				//console.log(['formValuesRetained aForms', aForms]);
				//console.dir(aForms);
				//console.log(Object.keys(aForms).length);
				//-
				/*var storedAForms = JSON.parse(sessionStorage.getItem("aForms"));

                    if(storedAForms && !Object.keys(aForms).length){
                        aForms=storedAForms;
                    }*/

				if (aForms["singleshipformidForce"]) {
					dig("form#singleshipformid .giftWrapMessageLine1").val(
						aForms["singleshipformidForce"]["giftWrapMessageLine1"]
					);
					dig("form#singleshipformid .giftWrapMessageLine2").val(
						aForms["singleshipformidForce"]["giftWrapMessageLine2"]
					);
					dig("form#singleshipformid .giftWrapMessageLine3").val(
						aForms["singleshipformidForce"]["giftWrapMessageLine3"]
					);
					dig("form#singleshipformid .giftWrapMessageLine4").val(
						aForms["singleshipformidForce"]["giftWrapMessageLine4"]
					);
					if (aForms["singleshipformidForce"]["ssgift"]) {
						dig("form#singleshipformid #ssgift").prop(
							"checked",
							true
						);
						dig(".giftMessage").toggle(true);
					}
				}

				if (args.hasOwnProperty("emailOnly") && args.emailOnly) {
					//force set shipping email address
					if (aForms["singleshipformidForce"]) {
						dig("form#singleshipformid #ereceiptAddr1Top").val(
							aForms["singleshipformidForce"]["ereceiptAddr1Top"]
						);
					}
					return;
				}

				$.each(aForms, function(k, v) {
					var eForm = args.view.find("#" + k);
					if (!base.fn.und(eForm) && eForm.length) {
						$.each(v, function(kk, vv) {
							var el = eForm.find('[name="' + kk + '"]');

							if (!base.fn.und(el) && el.length) {
								//-
								switch (el.getInputType()) {
									case "checkbox":
										el.each(function() {
											if (vv) {
												el.prop("checked", true);
											} else {
												el.prop("checked", false);
											}
										});

										break;
									case "radio":
										el.each(function() {
											if ($(this).val() == vv)
												$(this).attr(
													"checked",
													"checked"
												);
										});
										break;
									default:
										el.each(function() {
											$(this).val(vv);
										});
										break;
								}
							}
						});
						//- remove any saved values
						aForms[k] = null;
						delete aForms[k];
					}
				});

				//safety net for missing email
				if (
					dig("form#singleshipformid #ereceiptAddr1Top").length > 0 &&
					dig("form#singleshipformid #ereceiptAddr1Top").val()
						.length == 0
				) {
					//force set shipping email address
					if (aForms["singleshipformidForce"]) {
						dig("form#singleshipformid #ereceiptAddr1Top").val(
							aForms["singleshipformidForce"]["ereceiptAddr1Top"]
						);
					}
				}
			});

			var collapseSteps = (self.collapseSteps = function(args) {
				return; //added 4/21/16 TF
				var i = 0;
				$.each(args.steps, function(k, v) {
					dig(v)[v.indexOf("load") != -1 ? "fadeOut" : "slideUp"](
						500,
						function() {
							++i != args.steps.length ||
								(function() {
									base.fn.und(args.callback)
										? ""
										: args.callback();
								})();
						}
					);
				});
			});

			var expandSteps = (self.expandSteps = function(args) {
				var i = 0;
				$.each(args.steps, function(k, v) {
					dig(v)[v.indexOf("load") != -1 ? "fadeIn" : "slideDown"](
						500,
						function() {
							++i != args.steps.length ||
								(function() {
									base.fn.und(args.callback)
										? ""
										: args.callback();
								})();
						}
					);
				});
			});

			var gotoPage = (self.gotoPage = function(args) {
				base.fn.und(args.page) ||
					(function() {
						var page = base.opc.config.pages[args.page];
						base.fn.und(page) ||
							(function() {
								document.location.href = page;
							})();
					})();
			});

			var cartForceUpdate = (self.cartForceUpdate = function(args) {
				dig("#cartsummary").trigger("cartForceUpdate");
			});

			var autoFillAddress = (self.autoFillAddress = function(args) {
				console.log("autoFillAddress");

				if (addresses.length < 1) {
					return false;
				}

				var selObj = args.elm;
				var isCCform = args.isCCform;
				var disable = base.fn.und(args.disable) ? false : args.disable;
				var addrForm = $(selObj).parents(".addrform"),
					aid = $(selObj).val(),
					address;

				//-

				if (aid == "new") aid = "";

				if (isCCform != undefined) {
					addrForm = $(selObj)
						.parents("div:first")
						.siblings(".addrform,.ccform");

					if (aid != "" && aid != "none" && aid != "new") {
						aid = "cc" + aid;
					}
				}

				if (aid != "none" && aid != "" && aid != "new") {
					if (
						typeof addresses == "undefined" ||
						typeof addresses[aid] == "undefined"
					) {
						return false;
					}
					//GIFT REGISTRY CATCH
					if (
						typeof addresses[aid].hidden != "undefined" &&
						addresses[aid].hidden == true
					) {
						var grArr = aid.split("-"),
							giftRegistryId = grArr[0];

						dig(addrForm)
							.find('[id^="shippingAddressOperation"]')
							.val("registry");
						dig(addrForm)
							.find('[id^="registryId"]')
							.val(giftRegistryId);

						dig(addrForm)
							.children()
							.each(function() {
								if (
									!$(this).hasClass("savedAddresses") &&
									!$(this).hasClass("savedRegistryAddress")
								) {
									//$(this).hide();
								}
								if ($(this).hasClass("savedRegistryAddress")) {
									$(this).removeClass("hideThis");
								}
							});

						$(window).trigger("afterAutofillAddress");
						return true;
					} else if (base.fn.und(isCCform)) {
						dig(addrForm)
							.find('[id^="shippingAddressOperation"]')
							.val(aid);
						dig(addrForm)
							.find('[id^="registryId"]')
							.val("");
					}

					if (base.fn.und(isCCform)) {
						dig(addrForm)
							.children()
							.each(function() {
								if ($(this).hasClass("savedRegistryAddress")) {
									$(this).addClass("hideThis");
								} else {
									$(this).show();
								}
							});
					}

					address = addresses[aid];
				} else {
					if (base.fn.und(isCCform)) {
						dig(addrForm)
							.find('[id^="shippingAddressOperation"]')
							.val(aid);
						dig(addrForm)
							.children()
							.each(function() {
								if ($(this).attr("id") != "shipToShipAddr") {
									if (
										$(this).hasClass("savedRegistryAddress")
									) {
										$(this).addClass("hideThis");
									} else {
										$(this).show();
									}
								}
							});
					}
				}

				if ($.browser.msie && parseInt($.browser.version) < 9) {
					var addrFormFindVar =
						"input[id^='creditCardNumber'],input:enabled,select:enabled:not(.opcTableFieldOperation)"; // IE8 considers :enabled == (!disabled && !type='hidden')
				} else {
					var addrFormFindVar =
						"input:enabled,select:enabled:not(.opcTableFieldOperation)"; // Leaving this as-is 'cause other browsers are fine with it and no need to unnecessarily insert additional conditions
				}

				$(addrForm)
					.find(addrFormFindVar)
					.each(function() {
						if (aid == "none" || aid == "") {
							if (
								selObj[0] != this &&
								$(this).attr("id") != "saveaddr" &&
								$(this).attr("id") != "isFrontEndAsAnonymous"
							) {
								if (
									!base.opc.config.form.fillNewAddressFields
								) {
									$(this).val("");
									$(this).blur();
								} else {
									$(this).blur();
								}
							}
						} else {
							var name = $(this).attr("name");

							if (name !== undefined && name != "") {
								if (!!~name.indexOf("_D:/")) {
									return;
								}
								if (!!~name.indexOf("firstName")) {
									$(this).val(address.fname);
								} else if (!!~name.indexOf("lastName")) {
									$(this).val(address.lname);
								} else if (!!~name.indexOf("address1")) {
									$(this).val(address.address1);
								} else if (!!~name.indexOf("address2")) {
									$(this).val(address.address2);
								} else if (!!~name.indexOf("city")) {
									$(this).val(address.city);
								} else if (!!~name.indexOf("state")) {
									$(this).val(address.state);
								} else if (!!~name.indexOf("postalCode")) {
									$(this).val(address.postalCode);
									$(this).change();
								} else if (!!~name.indexOf("phone")) {
									$(this).val(address.phone);
								} else {
									for (x in address) {
										if (!!~name.indexOf(x)) {
											$(this).val(address[x]);
											$(this).removeClass("empty");
											break;
										}
									}
									return;
								}

								$(this).blur();
							}
							$(this).removeClass("empty");
						}
					});

				dig(addrForm)
					.find("div")
					.each(function() {
						$(this)
							.find("select")
							.each(function() {
								if (aid != "none" && aid != "") {
									if (
										~$(this)
											.attr("id")
											.indexOf("state")
									) {
										$(this).val(address.state);
										$(this).change();
									}
								}
							});
					});

				clearAllErrors();

				$(addrForm)
					.find(addrFormFindVar)
					.prop("disabled", disable);

				$(window).trigger("afterAutofillAddress");

				return true;
			});

			var loadStepReset = (self.loadStepReset = function(args) {
				loadTemplate({
					tpl: "tpl_single"
				});

				loadTemplate({
					tpl: "tpl_step2"
				});
				/*!base.opc.user.isTransient || loadTemplate({
                        tpl: 'tpl_createAccount'
                    });
                if(!goToStep2 && !goToStep3){
                        
                        base.opc.tpl.push({
                            tpl: 'tpl_single'
                        },
                        {
                            tpl: 'tpl_step2'
                        },
                        {
                            tpl: 'tpl_createAccount'
                        },
                        {
                            tpl: 'tpl_order_confirmation'
                        }
                        );
                    }
                    */

				loadTemplate({
					tpl: "tpl_order_confirmation"
				});
				loadTemplate({
					tpl: "tpl_cart"
				});
				//cartHideThis();
			});

			var loadStep2Success = (self.loadStep2Success = function(args) {
				loadTemplate({
					tpl: "tpl_step1_sum_single"
				});

				loadTemplate({
					tpl: "tpl_step2_sum",
					callback: function() {
						loadTemplate({
							tpl: "tpl_order_confirmation_final"
						});
					}
				});
				/*!base.opc.user.isTransient || loadTemplate({
                        tpl: 'tpl_createAccount'
                    });*/

				loadTemplate({
					tpl: "tpl_cart"
				});
				//cartHideThis();
			});

			var loadStep3Success = (self.loadStep3Success = function(args) {
				//	loadTemplate('tpl_step4_sum'); // This isn't needed - tpl_order_confirmation_ppx does all the work
				loadTemplate({
					tpl: "tpl_order_confirmation_ppx"
				});
				loadTemplate({
					tpl: "tpl_cart"
				});
				//cartHideThis();
			});

			var loadStep3ACSuccess = (self.loadStep3ACSuccess = function(args) {
				loadTemplate({
					tpl: "tpl_createAccount"
				});
			});

			var passFormValues = (self.passFormValues = function(args) {
				if (base.fn.und(args.form) || base.fn.und(args.values)) return;
				var eForm = dig(args.form);

				base.fn.und(args.before) || args.before();

				$.each(args.values, function(k, v) {
					var el = eForm.find(v.key);
					base.fn.und(el) || el.val(v.val);
				});

				base.fn.und(args.after) || args.after();
			});

			function cartHideThis() {
				dig("#editcart").addClass("hideThis");
			}

			function loadTemplates() {
				//- Load all initial templates defined inline and apply callback if exists. eg.: singleShippingGroup.jsp, paypalExpress.jsp
				$.each(base.opc.tpl, function(k, v) {
					var tpl = v.tpl;
					var opt = base.fn.und(v.opt) ? {} : v.opt;
					var callback = base.fn.und(v.callback)
						? function() {}
						: v.callback;
					//-
					loadTemplate({
						tpl: tpl,
						data: opt,
						callback: callback
					});
					base.opc.tpl[k] = null;
					delete base.opc.tpl[k];
				});
			}

			function paypalExpressTemplate() {
				var opcPageName = $("#opcPageName").attr("data-opcPageName");

				//only fire function if on paypalExpress.jsp
				if (opcPageName != "paypalExpress.jsp") {
					return;
				}

				//- is user logged in?
				var isTransientUser =
					$("#opcUserIsTransient").attr("data-opcUserIsTransient") ==
					"true"
						? true
						: false;
				var isElectronicOnly =
					$("#opcUserIsElectronicOnly").attr(
						"data-opcUserIsElectronicOnly"
					) == "true"
						? true
						: false;

				base.opc.isPPX = true;
				base.opc.user.isTransient = isTransientUser;
				base.opc.isElectronicOnly = isElectronicOnly;

				if (!isElectronicOnly) {
					base.opc.tpl.push({
						tpl: "tpl_single1_ppx",
						callback: function() {
							//- Force a cart update to display payment method on cart.
							$(window).trigger("methodRequest", [
								"cartForceUpdate"
							]);
						}
					});
				} else {
					base.opc.tpl.push({
						tpl: "tpl_single_electronic_ppx",
						callback: function() {
							//- Force a cart update to display payment method on cart.
							$(window).trigger("methodRequest", [
								"cartForceUpdate"
							]);
						}
					});
				}

				base.opc.tpl.push({
					tpl: "tpl_shippingMethods_ppx"
				});
				base.opc.tpl.push({
					tpl: "tpl_step3_ppx"
				});

				if (isTransientUser) {
					base.opc.tpl.push({
						tpl: "tpl_createAccount_ppx"
					});
				}

				base.opc.tpl.push({
					tpl: "tpl_order_confirmation_ppx"
				});
				setExpressVar("no");

				//load Templates
				loadTemplates();
			}

			function singleShippingGroupTemplate() {
				var opcPageName = $("#opcPageName").attr("data-opcPageName");

				//only fire function if on singleShippingGroup.jsp
				if (opcPageName != "singleShippingGroup.jsp") {
					return;
				}

				//- is user logged in?
				var isTransientUser =
					$("#opcUserIsTransient").attr("data-opcUserIsTransient") ==
					"true"
						? true
						: false;
				var isElectronicOnly =
					$("#opcUserIsElectronicOnly").attr(
						"data-opcUserIsElectronicOnly"
					) == "true"
						? true
						: false;
				var goToStep2 =
					$("#opcGoToStep2").attr("data-opcGoToStep2") == "true"
						? true
						: false;
				var goToStep3 =
					$("#opcGoToStep3").attr("data-opcGoToStep3") == "true"
						? true
						: false; //a.k.a "coming from paypal"
				var sizeVar = $("#opcSizeVar").attr("data-opcSizeVar");

				base.opc.user.isTransient = isTransientUser ? true : false;
				base.opc.isElectronicOnly = isElectronicOnly;

				//- Necessary conditions if user comes from Paypal
				if (goToStep2) {
					var callback = function() {
						lastStep = 2;
						var n = 420;
						switch (true) {
							case $.browser.mozilla:
								n = 390;
								break;
							case $.browser.msie:
								n = 350;
								break;
						}
						/*
                            $('html, body').animate({
                                scrollTop: n
                            }, 'slow');
                            */
					};
					/*
                        base.opc.tpl.push({
                            tpl: 'tpl_single_silent_form_load'
                        });*/
					base.opc.tpl.push({
						tpl: "tpl_single1_pp"
					});
					base.opc.tpl.push({
						tpl: "tpl_step2",
						opt: {
							data: {
								currentType: current.type
							}
						},
						callback: callback
					});
				}

				if (goToStep3) {
					console.log("step3 - paypal");

					var callback = function() {
						lastStep = 2;
						$(window).trigger("methodRequest", [
							"loadStep2Success",
							{}
						]);
					};

					if (sizeVar == 1) {
						base.opc.tpl.push({
							tpl: "tpl_single1_pp",
							callback: callback
						});
					} else {
						base.opc.tpl.push({
							tpl: "tpl_step1_sum",
							callback: callback
						});
					}
				}

				if (!goToStep2 && !goToStep3) {
					base.opc.tpl.push(
						{
							tpl: "tpl_single"
						},
						{
							tpl: "tpl_step2"
						},
						{
							tpl: "tpl_createAccount"
						},
						{
							tpl: "tpl_order_confirmation"
						}
					);
				}

				//load Templates
				loadTemplates();
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
(function($) {
	try {
		//Define the plugin's name here
		var __name = "thankyou";
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

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				//- Kill object first
				self.view[__name] = null;

				bindEvents();
			}

			function bindEvents() {
				dig(".acctmanagementshippinginfotrigger").on("click", function(
					evt
				) {
					evt.preventDefault();
					//-
					var url = base.opc.config.modals[$(this).attr("rel")];
					self.loadPage(url);
					/*
				base.fn.und(url) || modal({
					param : {
						url : url
					}
				});*/
				});
			}

			//- Function taken from previous js code which was present in many pages. Ideally, we would use a different modal system (Simple Modal!) Styles are already implemented. Leaving as is for now...

			var loadPage = (self.loadPage = function(url) {
				$.get(url, function(data) {
					dig("#xyz").html(data);
				});
			});

			/*
		function modal(args) {

			var opt = {
				model : 'modal-ajax',
				param : {
					url : url
				}
			};

			opt = $.extend({}, opt, args);

			$.fn.SimpleModal({
				model: opt.model,
				param : opt.param
			}).showModal();
		}*/

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
(function($) {
	try {
		//Define the plugin's name here
		var __name = "sidebarCart";
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
			self.defaults = {
				updateLeftSide: false,
				forceUpdateItem: false
			};

			self.initialize = function() {
				// merging defaults with passed arguments
				self.options = $.extend({}, self.defaults, options);
				//-
				ignite();
				console.log("log-after-ignite-sidebarCart");
				$(".sidebarCartUpdate").quantityMorph();

				return self;
			};

			//-- Vars
			//-- ------------------------------------------------------
			var dig = function(sbj) {
				return self.view.find(sbj);
			};

			var forceUpdateItem = (self.forceUpdateItem = function(args) {
				$(window).trigger("methodRequest", [
					"retainFormValues",
					{
						callback: function() {
							submitForm(
								dig("#updateItemQty"),
								"updateItemCartQty",
								"form#shoppingCartForm"
							);
						}
					}
				]);
			});

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				$(window).unbind("quantityMorphChange");
				$(window).on("quantityMorphChange", function(event, element) {
					//console.log('log-on-quantityMorphChange');
					//since the select element is morphed into input
					//it loses its onchange binding, so we call it here
					if ($(element).is("input[type=text]")) {
						updateItem($(element), $(element).attr("rel"));
					}
				});

				if (!isCartEmpty()) {
					bindEvents();
					!self.options.updateLeftSide ||
						$(window).trigger("cartUpdated");
					!self.options.forceUpdateItem || forceUpdateItem();
				} else {
					$(window).trigger("methodRequest", [
						"gotoPage",
						{
							page: "emptycart"
						}
					]);
				}
			}

			function bindEvents() {
				//sticky total
				$(".orderSumTotalRow").sticky({ topSpacing: 5, zIndex: 999 });

				self.view
					.off("forceUpdateItem")
					.on("forceUpdateItem", function(evt, args) {
						forceUpdateItem(base.fn.und(args) ? {} : args);
					});

				self.view
					.off("applyPromoData")
					.on("applyPromoData", function(evt, data) {
						applyPromoData(base.fn.und(data) ? {} : data);
					});

				self.view
					.off("promoSuccess")
					.on("promoSuccess", function(evt, data) {
						promoSuccess(base.fn.und(data) ? {} : data);
					});

				//- Update/remove from sidebar cart
				dig("a.sidebarCartUpdate")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						updateItem($(this), $(this).attr("rel"));
					});

				dig("select.sidebarCartUpdate, input.sidebarCartUpdate")
					.unbind("change")
					.change(function(evt) {
						updateItem($(this), $(this).attr("rel"));
					});

				dig(".sidebarCartRemove")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						removeItem($(this).attr("rel"));
					});

				dig(".editcart2")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						$(window).trigger("methodRequest", [
							"warn",
							{
								msg: base.opc.config.copy.leavingCart.msg,
								title: base.opc.config.copy.leavingCart.title,
								callback: function() {
									$(window).trigger("methodRequest", [
										"gotoPage",
										{
											page: "editcart"
										}
									]);
								},
								model: "confirm",
								btn_ok: "OK"
							}
						]);
					});

				promoButtonAction();

				//-
				self.view
					.off("cartForceUpdate")
					.on("cartForceUpdate", function(evt) {
						forceUpdateItem();
					})
					.off("quantityError")
					.on("quantityError", function(evt, itemId, qty) {
						dig("#" + itemId).val(qty);
					});

				$(document).ready(function() {
					$("#cartShippingDetails").css("display", "none");
				});
			}

			var promoButtonAction = (promoButtonAction = function() {
				var fnSubmit = function() {
					$(window).trigger("methodRequest", [
						"submitForm",
						{
							obj: $(this),
							cnf: "paymentApplyPromo",
							form: "#paymentAddPromoCodeForm"
						}
					]);
				};

				dig("#paymentAddPromoCodeForm")
					.unbind("submit")
					.on("submit", function(evt) {
						evt.preventDefault();
						//-
						fnSubmit();
					});

				dig("#paymentAddPromoCodeForm .paymentAddPromoCodeBtn")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						//-
						fnSubmit();
					});
			});

			var applyPromoData = (self.applyPromoData = function(data) {
				dig("div#promocodespay")
					.htmlOverride(data)
					.find(".labeled:enabled")
					.blur();

				promoButtonAction();

				$(window).trigger("methodRequest", [
					"loadTemplate",
					{
						tpl: "tpl_giftcard_sum"
					}
				]);
				$("#step2, #step3_ppx").trigger("handleTotalSatisfied", [
					{
						key: "promoCodesDiv"
					}
				]);
			});

			/**
			 * Success functions for gift cards and promotions
			 */
			var promoSuccess = (self.promoSuccess = function(data) {
				dig("div#promoLoad").hide();

				if (data.success != true) {
					dig("div#promocodespay div.giftcarddisp").show();

					if (
						"object" == typeof data.errors &&
						Object.keys(data.errors).length > 0
					) {
						$(".promoErrorMsg").css("display", "block");
						$(".promoErrorMsg").html(
							data.errors[Object.keys(data.errors)[0]]
						);
						$("#couponCode").addClass("promoError");

						//$(window).trigger('errors', [data]);
					} else if (
						typeof data.sessionExpired == "string" &&
						data.sessionExpired == "true"
					) {
						//redirect to self, that should bring the login window
						window.location.href = window.location.href;
					} else {
						alert(
							"Unknown Error Occurred. Please contact an administrator with the code: paymentApplyPromo"
						);
					}
				} else {
					totalSatisfied = data.totalSatisfied;

					//send event when promo is applied
					var couponCodeFieldEl = $(
						"form#paymentAddPromoCodeForm #couponCode"
					);
					if (
						couponCodeFieldEl.length > 0 &&
						(couponCodeFieldEl.data("fired") == undefined ||
							!couponCodeFieldEl.data("fired")) &&
						!base.opc.config.form.eventFired_promo
					) {
						base.opc.config.form.eventFired_promo = false;
						dataLayer.push({
							event: "checkoutStep",
							checkoutStep: "Promo Applied",
							eventLabel: couponCodeFieldEl.val()
						});
						couponCodeFieldEl.data("fired", "true");
					}

					//update shipping options toggle
					$(window).trigger("methodRequest", [
						"loadTemplate",
						{
							tpl: "tpl_single_part_2_3"
						}
					]);

					//$('#step2, #step3_ppx').trigger('reGetStep2Totals');
					$(window).trigger("methodRequest", [
						"loadTemplate",
						{
							tpl: "tpl_cart_update",
							data: {
								data: {
									currentStep:
										base.opc.config.form.current.step
								}
							}
						}
					]);
					/*
				$('#step2, #step3_ppx').trigger('reGetStep2Totals');

				if (dig('input#couponCode').not(':visible')) {
					$(window).trigger('methodRequest', [ 'loadTemplate', {
						tpl : 'tpl_promo_sum'
					}]);
				}*/
				}
				//jQuery('.labeled:enabled:visible').showLabels();
			});

			function updateItem(el, sIds) {
				/*
			if(base.fn.und(el) && base.fn.und(sIds)) {
				$(window).trigger('methodRequest', [ 'retainFormValues' , {
					callback : function() {
						submitForm(dig("#updateItemQty"), 'updateItemCartQty', 'form#shoppingCartForm');
					}
				}]);
				return;
			}*/

				var aIds = sIds.split(","),
					productId,
					skuId,
					itemId;
				itemId = aIds[0];
				productId = aIds[1];
				skuId = aIds[2];

				var eForm = dig("form#shoppingCartForm");
				eForm.find('[name="updateQuantityForItemId"]').val(itemId);
				eForm.find('[name="updateQuantityForSkuId"]').val(skuId);
				eForm
					.find('[name="updateQuantityForProductId"]')
					.val(productId);

				$(window).trigger("methodRequest", [
					"submitForm",
					{
						obj: dig("#updateItemQty"),
						cnf: "verifyCartQuantity",
						form: "#shoppingCartForm"
					}
				]);
			}

			function removeItem(sIds) {
				var aIds = sIds.split(","),
					productId,
					skuId,
					itemId;
				itemId = aIds[0];
				productId = aIds[1];
				skuId = aIds[2];
				//if(window.confirm(base.opc.config.copy.confirmDelete)) {
				//add scOpen & scAdd omniture event here
				try {
					OmnitureCenter.removeShoppingCartEvent(productId, skuId);
				} catch (e) {
					//alert(e);
				}
				//*******************************
				dig("#removalCommerceIds").val(itemId);
				//$("#removeItem").click();
				dig("form#shoppingCartForm #action").val("remove");

				$(window).trigger("methodRequest", [
					"retainFormValues",
					{
						callback: function() {
							//console.log('log-submitForm');
							submitForm(
								dig("#updateItemQty"),
								"updateItemCartQty",
								"form#shoppingCartForm"
							);
						}
					}
				]);
				//}
			}

			function isCartEmpty() {
				//- *** Should target a cart value. Looking for cart table#cartitems tr length for now.
				//console.log($('#storeItems').val());
				//console.log($('#culinaryItems').val());
				//console.log('log-isCartEmpty called');
				return dig("div.item.row").length == 0;
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
(function($) {
	try {
		//Define the plugin's name here
		var __name = "step1";
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
			self.defaults = {
				success: false,
				cnf: "",
				data: null
			};

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
			var timer = false;
			var zipChanged = false;

			var success = function() {
				var cnf = self.options.cnf;
				var data = self.options.data;
				var cartUpdate = self.options.cartUpdate;
				var eScript = $(data).filter("script");
				!eScript.length || eval(eScript.text());

				//console.log(['step1 data', data]);

				switch (cnf) {
					case "tpl_single":
						base.opc.config.form.current.type = "single";
						$(window).trigger("methodRequest", [
							"setStep",
							{ step: 1 }
						]);

						$(window).trigger("methodRequest", [
							"collapseSteps",
							{
								steps: ["#step2form", "#step2load"]
							}
						]);

						dig("#step1form").css({ position: "static", left: 0 });

						dig("#step1form")
							.hide()
							.htmlOverride(data)
							.slideDown(500, function() {
								//force disable shipping Method
								/*if(!base.opc.config.form.shippingMethodSelected){
							$("input.shippingMethod").attr("checked",false).closest('label').removeClass('active');
						}*/

								//jQuery('.labeled:enabled:visible').showLabels();

								if ($.browser.safari) {
									$('[id^="opc"][id$="_state"]').css(
										"top",
										"0px"
									);
								} else if ($.browser.mozilla) {
									$('[id^="opc"][id$="_state"]').css({
										top: "0px",
										"padding-top": "3px"
									});
								} else if (
									$.browser.msie &&
									parseInt($.browser.version) == 7
								) {
									$('[id^="opc"][id$="_state"]').css({
										top: "0px",
										height: "23px",
										"font-size": "14px"
									});
								} else if (
									$.browser.msie &&
									parseInt($.browser.version) == 8
								) {
									$('[id^="opc"][id$="_state"]').css({
										top: "2px",
										height: "23px"
									});
								} else if ($.browser.msie) {
									$('[id^="opc"][id$="_state"]').css(
										"top",
										"-1px"
									);
								}
							});
						break;
					case "tpl_single_part_2_3":
						var eStep1Form = dig("#step1form");
						var eRadios = eStep1Form.find(
							'#shipping-container input[type="radio"]'
						);
						var nCheckedRadio = (i = 0);
						eRadios.each(function() {
							if ($(this).is(":checked")) nCheckedRadio = i;
							i++;
						});

						//Uncheck the "save address" box so new addresses don't keep getting added to the account
						eStep1Form.one("htmlOverride.done", function() {
							//console.log("kill address");
							eStep1Form.find("#saveaddr").prop("checked", false);
							$(window).trigger("methodRequest", [
								"formValuesRetained",
								{
									view: self.view,
									/*emailOnly: true,*/
									from: __name
								}
							]);

							$(window).trigger("singleStep1_Finshed");
						});

						$(window).trigger("methodRequest", [
							"retainFormValues",
							{
								callback: function() {
									eStep1Form
										.htmlOverride(data)
										.find('input[type="radio"]')
										.prop("checked", false)
										.eq(nCheckedRadio)
										.prop("checked", true);
								}
							}
						]);

						//force disable shipping Method
						/*if(!base.opc.config.form.shippingMethodSelected){
							$("input.shippingMethod").attr("checked",false).closest('label').removeClass('active');
						}*/
						break;
					case "tpl_single1_pp":
						//console.log(['tpl_single1_pp', data]);
						dig("#step1load, #step1form").hide();

						$(window).trigger("methodRequest", [
							"loadTemplate",
							{
								tpl: "tpl_single_silent_form_load"
							}
						]);

						$(window).trigger("methodRequest", [
							"loadTemplate",
							{
								tpl: "tpl_cart",
								data: {
									data: {
										currentStep: "3"
									}
								}
							}
						]);

						dig("#step1info")
							.hide()
							.htmlOverride(data)
							.slideDown(function() {
								//trigger GA autocomplete on the address field in the billing form
								$(window).trigger("initGAutocomplete", {
									currentForm:
										base.opc.config.form
											.GAAutocompleteShippingForm
								});

								$(window).trigger("methodRequest", [
									"editLinkAnimate",
									{
										step: "1",
										action: "show"
									}
								]);
							});
						break;
				}

				bindEvents();
			};
			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				//- Kill object first
				self.view[__name] = null;

				//console.log('----------- step1 ignite');

				self.options.success ? success() : bindEvents();
			}

			function bindEvents() {
				//console.log('bind events');

				$(document).ready(function() {
					var addrType = $("#opcShippingFormId_Operation :selected")
						.parent()
						.attr("label");
					if (addrType == "Gift Registry Addresses") {
						$("label[for=isUseShippingAddress]").css(
							"display",
							"none"
						);
					}

					isStandardShippingOnly(true);
					//trigger GA autocomplete on the address field in the billing form
					$(window).trigger("initGAutocomplete", {
						currentForm:
							base.opc.config.form.GAAutocompleteShippingForm
					});
					//trigger GA autocomplete on the address field in the billing form
					$(window).trigger("initGAutocomplete", {
						currentForm:
							base.opc.config.form.GAAutocompleteBillingForm
					});

					//hideShipMethodDisplay();
				});

				//set event handler for various GA events
				if (!base.opc.config.form.eventFired_step1Multiple) {
					analyticsEventHandler();
				}

				dig(".btnAddGiftMessage")
					.off("click")
					.on("click", function(evt) {
						var index = $(this).attr("data-index");
						dig(
							".onlineClassFormRow.freemsg[data-index='" +
								index +
								"']"
						).css("display", "block");
						$(this).css("display", "none");
					});

				dig(".tmpUiMessage")
					.off("change")
					.on("change", function(evt) {
						var index = $(this).attr("data-index");
						dig("#giftMessage_" + index).val($(this).val());
					});

				$("a.editvcardgiftmsg")
					.off("click")
					.on("click", function(e) {
						var thisId = $(this).attr("id");
						thisId = thisId.split("_")[1];
						e.preventDefault();
						$("#vcardGiftMsgId_" + thisId).toggle();
					});

				$(window).trigger("methodRequest", [
					"formValuesRetained",
					{
						view: self.view,
						/*emailOnly: true,*/
						from: __name
					}
				]);

				self.view.off("stepErrors").on("stepErrors", function(evt) {
					dig(".stepLoad").fadeOut(444);
				});

				//- On sidebar cart update event
				onCartUpdate();

				//Handle shipping submittal
				dig(".submitButton")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						//reset global var
						zipChanged = false;
						//dig('.stepLoad').show();
						$(window).trigger("methodRequest", [
							"submitForm",
							{
								obj: $(this),
								cnf: "singleStep1",
								form: "form#singleshipformid"
							}
						]);
					});

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

				//Watch all shipping inputs for focus
				$("form#singleshipformid input").on("focus", function(e, t) {
					$(this).addClass("valid");
				});

				//Handle Shipping Method selection
				dig(".shippingOptions .btn").on("mouseup", function() {
					dig(".shippingOptions").data(
						"lastChecked",
						$("input.shippingMethod:checked")
					);
				});
				dig(".shippingOptions input.shippingMethod").on(
					"change",
					function() {
						//console.log('handle shipping method listener');
						//handle event when step1 is done
						var myVal = $(this).val();

						//prevent crazy browser behavior
						if (
							myVal &&
							base.opc.config.form.selectedShippingMethod == myVal
						) {
							return;
						}

						base.opc.config.form.selectedShippingMethod = myVal;
						base.opc.config.form.shippingMethodSelected = true;

						var shipOptionEl = $(this);
						var elVal = shipOptionEl.val();

						$(window).one("singleStep1_Fail", function() {
							//$("input.shippingMethod").attr("checked",false).closest('label').removeClass('active');

							//send event when ship method fails
							dataLayer.push({
								event: "checkoutStep",
								checkoutStep: "Shipping Method Fail",
								eventLabel: elVal
							});
						});

						$(window).one("singleStep1_Finshed", function() {
							//send event when ship method succeeds
							dataLayer.push({
								event: "checkoutStep",
								checkoutStep: "Shipping Method Success",
								eventLabel: elVal
							});
						});

						$(window).trigger("methodRequest", [
							"retainFormValues",
							{
								callback: function() {
									$("#shippingSubmit").click();
								}
							}
						]);
					}
				);

				//listener for showing all shipping options
				dig(".shippingOptions .checkoutbox .showShippingOptions").on(
					"click",
					function() {
						showShipMethodDisplay();
					}
				);

				//Handle gift option selection
				dig(".giftoptions input").on("change", function() {
					$(window).trigger("methodRequest", [
						"retainFormValues",
						{
							callback: function() {
								$("#shippingSubmit").click();
							}
						}
					]);
				});

				//disable ground for certain states
				dig("#ssstate")
					.off("click")
					.on("click", function() {
						//clear zip field to prepare to re-pull pricing
						dig("#sszip").val("");
						//check if we need to reduce shipping options
						isStandardShippingOnly(true);
					});

				dig("#sszip").on("change", function() {
					zipChanged = true;
				});

				//firefox loses focus when ajax refreshes shipping form, keep focus
				dig("form#singleshipformid input:not([type=checkbox])").on(
					"focus",
					function(e) {
						//console.log('capture focus');
						//save the focused field after tab
						base.opc.config.form.shipFieldFocusID = $(this)[0].id;
					}
				);

				//submit form if all fields are valid (helps to refresh shipping price changes)
				dig("form#singleshipformid input:not([type=checkbox])").on(
					"blur",
					function(e) {
						//console.log('blur');
						//console.log(isFormValid());
						//console.log(zipChanged);
						//console.log(dig("#opcShippingFormId_Operation").val());

						//only proceed if the form is valid and logged-in customer didn't choose "new shipping address"
						if (isFormValid() && zipChanged) {
							//Stop if it's a logged in user but entering a new address
							if (
								!base.opc.user.isTransient &&
								!dig("#opcShippingFormId_Operation").val()
							) {
								//console.log('return');
								return;
							}

							//handle zip/state for shipping options
							isStandardShippingOnly(false);
							$(window).one("singleStep1_Finshed", function() {
								//console.log('focus');
								//console.log(base.opc.config.form.shipFieldFocusID);
								if (base.opc.config.form.shipFieldFocusID) {
									$(
										"#" +
											base.opc.config.form
												.shipFieldFocusID
									)
										.focus()
										.select();
								}
								base.opc.config.form.shipFieldFocusID = false;
							});

							updateShipping();
						} else {
							//console.log("form invalid");
						}
					}
				);

				//CLIENT-SIDE FORM VALIDATION
				//https://jqueryvalidation.org/validate
				dig("form#singleshipformid").validate(
					base.opc.config.form.validatorRules
				);

				$(window).on("fedexAddressValidationCheck", function(
					evt,
					data
				) {
					if (fedexAddressValidationError(data))
						$("#singleshipformid").slideUp();
				});

				//- Edit links for shipping and payment
				dig(".editLink")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						//- Switch action of step 1 from `add` to `edit`
						dig("#singleshipformid-action").val("editShippingForm");

						$(window).trigger("methodRequest", [
							"editLinkAction",
							{
								step: $(this).attr("rel"),
								hideOthers: true,
								tpl: "tpl_single",
								collapseSteps: [
									"#step1info",
									"#step2load",
									"#step2form",
									"#step3load",
									"#step3form",
									"#step3ACform"
								]
							}
						]);
					});

				//- FedEx validation service action links
				dig(".validationLink")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						var eForm = dig("#singleshipformid");
						var eFedx = dig("#fedexValidation");
						var sChoice = $(this).attr("rel");
						//-
						eForm.find("#userValidationChoice").val(sChoice);
						switch (sChoice) {
							case "edit":
								eFedx.slideUp(500);
								eForm.show().slideDown(500); //.scroll2();
								break;
							case "entered":
								//- flag system to use entered address anyways
								$(window).trigger("methodRequest", [
									"submitForm",
									{
										obj: dig("#shippingSubmit"),
										cnf: "singleStep1",
										form: "form#singleshipformid"
									}
								]);
								break;
							case "suggested":
								//-
								eForm
									.find("#ssaddr1")
									.val(eFedx.find(".saddressLine1").text());
								eForm
									.find("#ssaddr2")
									.val(eFedx.find(".saddressLine2").text());
								eForm
									.find("#sscity")
									.val(eFedx.find(".scity").text());
								eForm
									.find("#sszip")
									.val(eFedx.find(".spostalCode").text());
								eForm
									.find("#ssstate")
									.val(eFedx.find(".sstate").text());
								//eForm.slideDown().scroll2();

								$(window).trigger("methodRequest", [
									"submitForm",
									{
										obj: dig("#shippingSubmit"),
										cnf: "singleStep1",
										form: "form#singleshipformid"
									}
								]);
								break;
						}
					});

				//Set listener for "Make this a gift" toggle
				dig("#ssgift").change(function() {
					$(".giftMessage").slideToggle({
						duration: 400,
						easing: "swing"
					});
				});

				dig("a.showMessage")
					.unbind("click")
					.on("click", function(a) {
						a.preventDefault(),
							dig("#" + $(this).attr("rel"))
								.removeClass("hideThis")
								.show(),
							$(this).hide();
					});

				dig("a.editvcardgiftmsg")
					.show()
					.unbind("click")
					.on("click", function(e) {
						e.preventDefault();
						e.stopPropagation();

						var id = $(this).data("index");
						dig("div#vcardGiftMsgId_" + id).slideToggle({
							duration: 400,
							easing: "swing"
						});
						//$(this).hide();
					});
				//openShowGiftOptLink();

				//- Gift card allowed chars
				//$('.giftmsgform input[type="text"]').giftCardValidation();

				addressEvents();
			}

			function updateShipping() {
				clearTimeout(timer);
				timer = setTimeout(function() {
					//console.log('gooooooooo');
					//firefox loses focus when ajax refreshes shipping form, keep focus

					console.trace("form validated");
					$(window).trigger("methodRequest", [
						"retainFormValues",
						{
							callback: function() {
								$("#shippingSubmit").click();
							}
						}
					]);
				}, 200);
			}
			function checkForRegistryValue(val) {
				return parseInt(val) > 9999999999;
			}

			function addressEvents() {
				//console.log("addressEvents");
				var eDD = dig("#opcShippingFormId_Operation");
				var nShippingSelectionVal = dig("#shippingSelection").val()
					? dig("#shippingSelection").val()
					: eDD.val();

				//- Existing address dropdown
				eDD.unbind("change").on("change", function(evt) {
					var myVal = $(this).val();

					$(window).trigger("methodRequest", ["clearAllErrors", {}]);
					base.opc.config.form.validatorRules.clearErrors(
						eDD.closest("form")
					);
					$(this)
						.parents(".addrform")
						.find('[id^="shippingAddressOperation"]')
						.val(myVal);

					//save selection so we don't keep firing. Due to browser behavior on ajax/html call from submit
					if (
						window.base.opc.config.form.selectedShippingAddress !=
						myVal
					) {
						window.base.opc.config.form.selectedShippingAddress = myVal;

						$(window).one("afterAutofillAddress", function() {
							//submit form to handle AK, HI pricing etc.
							//handle zip/state for shipping options
							isStandardShippingOnly(false);

							if (isFormValid()) {
								//console.log('form validated');
								updateShipping();
							}
						});

						//console.log('auto');
						//fill address data if NOT a registry address
						$(window).trigger("methodRequest", [
							"autoFillAddress",
							{
								elm: $(this)
							}
						]);
					}

					//handle registry message
					fnShowHideForm(checkForRegistryValue(myVal));

					//allow updated to first on the first multi-address
					if (dig("#firstMultiStep").length > 0) {
						dig("#firstAddressSelectID").val(myVal);
					}

					if (myVal && myVal.length < 1) {
						dig("#saveAddressPanel label")
							.hide()
							.eq(1)
							.show();
					} else {
						dig("#saveAddressPanel label")
							.hide()
							.eq(0)
							.show();
					}

					//set value for hidden input so the correct address is edited
					dig("#shippingSelection")
						.val(eDD.val())
						.change();
				});

				var val = eDD.val();
				var fnShowHideForm = function(isRegistry) {
					window.base.opc.config.form.isRegistry = isRegistry;
					console.log("isRegistry");
					console.log(isRegistry);

					dig(".email").show();
					$("label[for=isUseShippingAddress]").css(
						"display",
						isRegistry ? "none" : "block"
					);
					dig(".name, .address, .citystatezip, .phone")[
						isRegistry ? "hide" : "show"
					]();
					dig(".savedRegistryAddress")[
						isRegistry ? "removeClass" : "addClass"
					]("hideThis");
					dig("#saveAddressPanel")[
						isRegistry ? "addClass" : "removeClass"
					]("hideThis");
					dig("#saveAddressPanel")[isRegistry ? "hide" : "show"]();
					if (isRegistry) {
						$(window).trigger("unselectUseShippingAddress");
						//fill address data if NOT a registry address
						$(window).trigger("methodRequest", [
							"autoFillAddress",
							{
								elm: eDD
							}
						]);
					} else {
						if (window.base.opc.config.form.useShipFirstLoad) {
							//window.base.opc.config.form.useShipFirstLoad is set to false in stepPayment_common.js
							$(window).trigger("selectUseShippingAddress");
						}
					}
				};

				/*
			switch(base.opc.mode) {
				case 'edit':
					eDD.val(nShippingSelectionVal);
					fnShowHideForm(checkForRegistryValue(nShippingSelectionVal));
					break;
				default:

					fnShowHideForm(checkForRegistryValue(val));
					checkForRegistryValue(val); /*|| $(window).trigger('methodRequest', [ 'autoFillAddress', {
						elm : eDD
					}]);
					break;
			}
*/

				//if there's a pre-selected option, load it up!
				if (nShippingSelectionVal) {
					//console.log('preselected');
					//console.log(eDD.data('init'));

					//check if this is the first load up. If so, make sure the address is autofilled
					if (eDD.data("init") == undefined) {
						//console.log('init');
						eDD.val(nShippingSelectionVal).change();
					} else {
						//console.log('inited');
						eDD.data("init", "true");
						eDD.val(nShippingSelectionVal);
					}

					fnShowHideForm(
						checkForRegistryValue(nShippingSelectionVal)
					);
				} else if (!$.isEmptyObject(base.opc.config.form.addresses)) {
					//console.log("hunt");
					//look for a matching address, this will be the case when a new address is added.
					var address1Val = dig("#ssaddr1").val();
					var addrObj = base.opc.config.form.addresses;
					var foundAddr = false;

					$.each(addrObj, function(key, value) {
						if (
							addrObj[key].hasOwnProperty("address1") &&
							addrObj[key].address1.indexOf("cc_st") == -1 &&
							addrObj[key].address1 == address1Val
						) {
							//console.log("found");
							eDD.val(key).change();
							fnShowHideForm(checkForRegistryValue(key));
							foundAddr = true;
							return false;
						}
					});

					//Default, fallback to "add new address"
					if (!foundAddr) {
						//default to adding new address
						eDD.find("option:last").prop("selected", true);
						fnShowHideForm(checkForRegistryValue(0));
					}
				} else {
					//console.log('default address');
					fnShowHideForm(checkForRegistryValue(0));
				}

				//-
				//oldCode();
			}
			/*
		function openShowGiftOptLink() {
			var hasData = false;
			dig('#giftopt1').find('input[type="text"], input[type="checkbox"]').each(function() {
				if(hasData) return;
				switch($(this).getInputType()) {
					case 'text':
						hasData = $(this).val() != '';
						break;
					case 'checkbox':
						hasData = $(this).prop('checked') == true;
						break;
				}
			});
			hasData ? dig('#showGiftOptLink').trigger('click') : '';
		}*/

			function onCartUpdate() {
				self.view.off("cartUpdate").on("cartUpdate", function(evt) {
					var tpl = [];
					switch (base.opc.config.form.current.step) {
						case "1":
							tpl.push("tpl_single_part_2_3");
							break;
						default:
							tpl.push("tpl_single_part_2_3");
							tpl.push("tpl_step1_sum_single");
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

			function fedexAddressValidationError(data) {
				//- flag system to use entered address anyways
				console.log("fedexValidation");

				//FEDEX ADDRESS VALIDATION REMOVED/BYPASSED 4/22/2016 TF

				//console.log(['fedexAddressValidationError data', data]);
				var b = false;
				var eFedx = dig("#fedexValidation");
				var eValidationLinks = $(".validationLink").hide();
				var fnPopulate = function(a) {
					var s = "";
					$.each(a, function(k, v) {
						s = v;
						//- AA, AE, AP fix
						if (k == "state")
							s = (function(s) {
								var a = dig("#ssstate")
									.find('option[value="' + s + '"]')
									.text();
								a = a.split(" - ");
								return a[0] == "" ? s : a[0];
							})(s);
						//if(typeof s == 'string') s = k.indexOf('name') != -1 ? s : s.toUpperCase();
						eFedx.find("." + k).html(s);
					});
					eFedx.show();
					return true;
				};
				//- show edit link
				eValidationLinks.filter('[rel="edit"]').show();
				//- entered address
				if (typeof data.actualAddress == "object") {
					eValidationLinks.filter('[rel="entered"]').show();
					data.actualAddress.name =
						dig("#ssfname").val() + " " + dig("#sslname").val();
					b = fnPopulate(data.actualAddress);
					dig("#fedexValidation-msg h6").text(
						data.errors["unableToVerifyAddressNote"]
					);

					console.log("fedexValidation2");
				}
				//- suggested address
				/*if(typeof data.suggestedAddress == 'object') {
				eFedx.find('tr th:eq(2)').show();
				eValidationLinks.filter('[rel="suggested"]').show();
				data.suggestedAddress.sname = dig('#ssfname').val() + ' ' + dig('#sslname').val();
				b = fnPopulate(data.suggestedAddress);
				dig('#fedexValidation-msg h6').text(data.errors['suggestedAddressNote']);
			}
			else {
				eFedx.find('tr th:eq(2)').hide();
			}*/
				return b;
			}

			function oldCode() {
				var PrevShippingAddressID = $(
					"#shippingAddressOperation"
				).val();
				var SavedAddressesDDL = $(".addrform .savedAddresses select");

				if (SavedAddressesDDL.length < 1) return;

				autoFillAddress({
					elm: SavedAddressesDDL
				});

				if (PrevShippingAddressID && PrevShippingAddressID.length > 0) {
					SavedAddressesDDL.val(PrevShippingAddressID);
					autoFillAddress(SavedAddressesDDL);
					current.skipAutoFillAddr = true;
				}

				if (current && current.skipAutoFillAddr) {
					current.skipAutoFillAddr = null;
				}
				var populateAddress = $("#populateAddress").val();
				if (populateAddress == "true") {
					if (
						SavedAddressesDDL.find(
							"optgroup[value=RegAddrGrp] option"
						).length > 0
					) {
						SavedAddressesDDL.val(
							SavedAddressesDDL.find(
								"optgroup[value=RegAddrGrp] option"
							)
								.first()
								.val()
						)
							.parents(".addrform")
							.find('[id^="shippingAddressOperation"]')
							.val(SavedAddressesDDL.val());
						autoFillAddress({
							elm: SavedAddressesDDL
						});
					} else if (
						SavedAddressesDDL.find(
							"optgroup[value=SavedAddrGrp] option[isdefault=true]"
						).length > 0
					) {
						SavedAddressesDDL.val(
							SavedAddressesDDL.find(
								"optgroup[value=SavedAddrGrp] option[isdefault=true]"
							)
								.first()
								.val()
						)
							.parents(".addrform")
							.find('[id^="shippingAddressOperation"]')
							.val(SavedAddressesDDL.val());
						autoFillAddress({
							elm: SavedAddressesDDL
						});
					}
				}
				var EditRegId = $("#editRegId");
				if (EditRegId.length > 0 && EditRegId.val().length > 0) {
					SavedAddressesDDL.val(EditRegId.val()).change();
				}

				if (SavedAddressesDDL.val().length < 1) {
					$("#saveAddressPanel label")
						.hide()
						.eq(1)
						.show();
				} else {
					$("#saveAddressPanel label")
						.hide()
						.eq(0)
						.show();
				}

				EditRegId = null;
				SavedAddressesDDL = null;

				$("#saveaddr,#savenewaddr").on("click change", function() {
					// Set value
					var That = $(this);
					That.prop("value", That.is(":checked") ? "true" : "")
						.siblings("input[type=hidden]")
						.val(That.is(":checked") ? "true" : "");
					That = null;
				});

				if (jQuery("#firstMultiStep").length > 0) {
					jQuery("#firstAddressSelectID").val(
						jQuery(".addrform .savedAddresses select").val()
					);
				}
			}
			function autoFillAddress(args) {
				$(window).trigger("methodRequest", [
					"autoFillAddress",
					{
						elm: args.elm
					}
				]);
			}

			function isFormValid() {
				return dig("form#singleshipformid")
					.data("validator")
					.checkForm(); //dig("form#singleshipformid").data('validator').valid();
			}

			function getStandardStates() {
				var states = $("#onlyStandardShipStatesOptionVals")
					.val()
					.split(",");

				return states;
			}

			function isStandardShippingOnly(doClick) {
				var myVal = dig("#ssstate").val();
				var standardStates = getStandardStates();
				//console.log(myVal);
				//console.log("ssssstttaaate: " + standardStates);

				if (
					standardStates.length > 1 &&
					standardStates.indexOf(myVal) != -1 &&
					!window.base.opc.config.form.isRegistry
				) {
					dig("input.shippingMethod")
						.attr("checked", false)
						.attr("disabled", "true")
						.closest("label")
						.removeClass("active")
						.addClass("disabled")
						.css("pointer-events", "none");
					var firstInputLabel = dig("input.shippingMethod")
						.first()
						.attr("checked", true)
						.removeAttr("disabled")
						.closest("label")
						.addClass("active")
						.removeClass("disabled")
						.css("pointer-events", "auto");
					if (doClick) {
						firstInputLabel.click();
					}
					dig(".shippingInfoMessage")
						.html(
							"Only standard shipping is available for your chosen State."
						)
						.show();
					return true;
				} else {
					dig("input.shippingMethod")
						.removeAttr("disabled")
						.closest("label")
						.removeClass("disabled")
						.css("pointer-events", "auto");
					dig(".shippingInfoMessage")
						.html("")
						.hide();
					return false;
				}
			}

			function analyticsEventHandler() {
				base.opc.config.form.eventFired_step1Multiple = true;
				//send event if the order contains a hardgood
				var electronicOnlyEl = $("input#isElectronicOnly");

				if (
					electronicOnlyEl.length > 0 &&
					(electronicOnlyEl.data("fired") == undefined ||
						!electronicOnlyEl.data("fired"))
				) {
					var containsHardgood =
						electronicOnlyEl.val() == "true" ? false : true;
					//console.log('containsHardgood '+containsHardgood);
					dataLayer.push({
						event: "checkoutStep",
						checkoutStep: "Contains Hardgood",
						eventLabel: containsHardgood
					});
					electronicOnlyEl.data("fired", "true");
				}

				//send event if the order is prefilled
				var firstFormEl = $("form#singleshipformid input#ssfname");
				if (
					firstFormEl.length > 0 &&
					(firstFormEl.data("fired") == undefined ||
						!firstFormEl.data("fired"))
				) {
					var firstFormVal =
						firstFormEl.val().length > 0 ? true : false;

					dataLayer.push({
						event: "checkoutStep",
						checkoutStep: "Prefilled Shipping Form",
						eventLabel: firstFormVal
					});
					firstFormEl.data("fired", "true");
				}

				//Watch all shipping inputs for focus
				$(
					"form#singleshipformid input, form#singleshipformid select"
				).one("focus", function(e, t) {
					var formEl = $("#singleshipformid");
					if (
						formEl.length > 0 &&
						(formEl.data("fired") == undefined ||
							!formEl.data("fired"))
					) {
						dataLayer.push({
							event: "checkoutStep",
							checkoutStep: "Start Shipping",
							eventLabel: this.id
						});
						formEl.data("fired", "true");
					}
				});
			}

			function hideShipMethodDisplay() {
				var standardInput = dig("input.shippingMethod").first();

				if (standardInput.is(":checked")) {
					//console.log("hideShipMethodDisplay");
					//console.log(standardInput.closest(".btn"));

					standardInput.closest(".btn").addClass("soloBtn");
					dig(".shippingOptions .btn:gt(0)").hide();
					dig(
						".shippingOptions .checkoutbox .showShippingOptions"
					).show();
				}
			}

			function showShipMethodDisplay() {
				//console.log("showShipMethodDisplay");

				dig(".shippingOptions .btn:eq(0)").removeClass("soloBtn");
				dig(".shippingOptions .btn:gt(0)").show();
				dig(
					".shippingOptions .checkoutbox .showShippingOptions"
				).hide();
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
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
(function($) {
	try {
		//Define the plugin's name here
		var __name = "step1_ppx";
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
				self.step = "1";
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
			var isPayPalInvalidAddr = false;

			var success = function() {
				var cnf = self.options.cnf;
				var data = self.options.data;
				var cartUpdate = self.options.cartUpdate;
				var eScript = $(data).filter("script");
				!eScript.length || eval(eScript.text());

				dig("#step1load, #step1form").hide();

				//console.log(data);
				dig("#step1info")
					.hide()
					.on("htmlOverride.done", function(evt) {
						var showForm = dig("#step1info")
							.slideDown(444)
							.find("form#paypalformid")
							.hasClass("paypalInvalidAddr");
						isPayPalInvalidAddr = showForm;

						switch (cnf) {
							case "tpl_single_electronic_ppx":
								!base.opc.isElectronicOnly ||
									dig("#step2head").hide(); // hide the shipping options heading and step2form
								//dig('.stepInfoPPX table tr:nth-child(2)').children('td').html('<p id="ppmessage">' + base.opc.config.copy.noShippingAddrNeeded + '</p>');
								break;
						}

						//-
						bindEvents(!showForm);
					})
					.htmlOverride(data);
			};

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				//- Kill object first
				self.view[__name] = null;

				self.options.success ? success() : bindEvents(false);
			}

			function checkForRegistryValue(val) {
				return parseInt(val) > 9999999999;
			}

			function bindEvents(hideForm) {
				self.view.off("stepErrors").on("stepErrors", function(evt) {
					dig(".stepLoad").hide();
					$(window).trigger("methodRequest", [
						"retainFormValues",
						{
							callback: function() {
								$(window).trigger("methodRequest", [
									"loadTemplate",
									{
										tpl: "tpl_single1_ppx_SILENT",
										clearErrors: false
									}
								]);
							}
						}
					]);
				});
				$(window)
					.off("stepLoaded")
					.on("stepLoaded", function(evt, step) {
						//console.log('stepLoaded');
						if (step == "step2_ppx") bindEvents(hideForm);
					});

				//- REGISTRY AND SAVED ADDRESS
				//- saved address keys are different than destination form's element names:
				var aFormElmMap = {
					fname: "ssfname",
					lname: "sslname",
					address1: "ssaddr1",
					address2: "ssaddr2",
					city: "sscity",
					state: "shipAddressState",
					postalCode: "sszip",
					phone: "ssphone",
					country: "sscountry"
				};
				var eShippingFormId_Operation = dig(
					"#opcShippingFormId_Operation"
				);
				var eUseGiftRegistryAddr = dig("#useGiftRegistryAddr");

				eUseGiftRegistryAddr.unbind("click").on("click", function(evt) {
					var isChecked = $(this).is(":checked");
					var aValues = [];
					var sKeyPrefix = "ss";
					var sDDVal = eShippingFormId_Operation.val(),
						isRegistry = checkForRegistryValue(sDDVal);

					eShippingFormId_Operation.prop("disabled", !isChecked);

					!isRegistry ||
						(function() {
							aValues.push({
								key: "#registryId",
								val: isChecked ? sDDVal : ""
							});
							aValues.push({
								key: "#shippingAddressOperation",
								val: "registry"
							});
						})();

					fnShowHideForm(
						isChecked ? checkForRegistryValue(sDDVal) : false
					);

					isRegistry ||
						aValues.push({
							key: "#shippingAddressOperation",
							val: isChecked
								? dig("#opcShippingFormId_Operation").val()
								: ""
						});

					var aAddresses =
						base.opc.config.form.addresses[
							isChecked
								? dig("#opcShippingFormId_Operation").val()
								: "init"
						];

					if (!base.fn.und(aAddresses)) {
						$.each(aAddresses, function(k, v) {
							aValues.push({
								key: "#" + (isChecked ? aFormElmMap[k] : k),
								val: isRegistry ? "" : v
							});
						});
					}
					//console.log(['base.opc.config.form.addresses', base.opc.config.form.addresses]);
					//console.log(['aValues', aValues]);

					//- Padding values to #singleshipformid form
					$(window).trigger("methodRequest", [
						"passFormValues",
						{
							form: "#singleshipformid",
							values: aValues
						}
					]);
				});

				//- Existing address dropdown

				var fnShowHideForm = function(hide) {
					var s = eShippingFormId_Operation.val();
					s = base.fn.und(s) ? "" : s;

					dig(".name, .address, .citystatezip, .phone")[
						hide || checkForRegistryValue(s)
							? "addClass"
							: "removeClass"
					]("hideThis");
					dig(".savedRegistryAddress")[
						hide ? "removeClass" : "addClass"
					]("hideThis");
				};

				fnShowHideForm(
					!!hideForm ||
						checkForRegistryValue(eShippingFormId_Operation.val())
				);

				eShippingFormId_Operation
					.unbind("change")
					.on("change", function(evt) {
						//var a = base.opc.config.form.addresses[$(this).val()];
						var sDDVal = $(this).val(),
							isRegistry = checkForRegistryValue(sDDVal),
							aAddresses = {},
							aValues = [],
							sKeyPrefix = "ss";
						//-
						if (sDDVal == "" || isRegistry)
							fnShowHideForm(isRegistry);
						if (base.fn.und(sDDVal)) return;

						//- Enter new address
						if (sDDVal == "") {
							$.each(aFormElmMap, function(k, v) {
								aValues.push({
									key: "#" + v,
									val: ""
								});
							});
							$(window).trigger("methodRequest", [
								"passFormValues",
								{
									form: "#paypalformid",
									values: aValues
								}
							]);
							return;
						}

						aValues.push({
							key: "#shippingAddressOperation",
							val: isRegistry ? "registry" : sDDVal
						});

						//console.log(['base.opc.config.form.addresses', base.opc.config.form.addresses[$(this).val()]]);return;
						!isRegistry || dig("#saveAddressPanel").hide();
						isRegistry
							? aValues.push({
									key: "#registryId",
									val: sDDVal
								})
							: (function() {
									if (sDDVal == "") return;
									var aAddresses =
										base.opc.config.form.addresses[sDDVal];
									if (base.fn.und(aAddresses)) return;

									//- Prepare new values
									$.each(aAddresses, function(k, v) {
										aValues.push({
											key: "#" + aFormElmMap[k],
											val: v
										});
									});
								})();

						fnShowHideForm(checkForRegistryValue(sDDVal));

						$(window).trigger("methodRequest", [
							"passFormValues",
							{
								form: "#singleshipformid",
								values: aValues,
								before: function() {
									if (
										base.fn.und(
											base.opc.config.form.addresses.init
										)
									)
										$("#step2_ppx").trigger(
											"saveInitFormAddress"
										);
								}
							}
						]);

						if (base.fn.und(base.opc.config.form.addresses[sDDVal]))
							return;

						aValues.push({
							key: "#ssstate",
							val: base.opc.config.form.addresses[sDDVal]["state"]
						});

						$(window).trigger("methodRequest", [
							"passFormValues",
							{
								form: "#paypalformid",
								values: aValues
							}
						]);

						//$(this).parents('.addrform').find('[id^="shippingAddressOperation"]').val($(this).val());

						/*
				$(window).trigger('methodRequest', [ 'autoFillAddress', {
					elm : $(this)
				}]);*/

						if ($(this).val() && $(this).val().length < 1)
							dig("#saveAddressPanel label")
								.hide()
								.eq(1)
								.show();
						else
							dig("#saveAddressPanel label")
								.hide()
								.eq(0)
								.show();

						$(window).trigger("methodRequest", [
							"clearAllErrors",
							{}
						]);
					});

				if (isPayPalInvalidAddr) {
					var sDDVal = eShippingFormId_Operation
						.prop("disabled", false)
						.val();
					var aValues = [];
					var aKeyMatch = {
						address1: "addr1",
						address2: "addr2",
						postalCode: "zip"
					};

					if (checkForRegistryValue(sDDVal)) {
						dig("#saveAddressPanel").hide();
						dig("#registryId").val(sDDVal);
						dig("#shippingAddressOperation").val("registry");
					} else {
						if (
							!base.fn.und(base.opc.config.form.addresses[sDDVal])
						) {
							$.each(
								base.opc.config.form.addresses[sDDVal],
								function(k, v) {
									aValues.push({
										key:
											"#ss" +
											(base.fn.und(aKeyMatch[k])
												? k
												: aKeyMatch[k]),
										val: v
									});
								}
							);

							$(window).trigger("methodRequest", [
								"passFormValues",
								{
									form: "#paypalformid",
									values: aValues
								}
							]);
						}
					}
				}

				$(window).trigger("methodRequest", [
					"formValuesRetained",
					{
						view: self.view,
						from: __name
					}
				]);
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
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
				!eScript.length || eval(eScript.text());

				switch (cnf) {
					case "tpl_step2":
						/*$(window).trigger('methodRequest', [ 'setStep', { step : 2 } ]);
					$(window).trigger('methodRequest', [ 'editLinkAnimate', {
						step : '1',
						action : 'show'
					}]);

					$(window).trigger('methodRequest', [ 'editLinkAnimate', {
						step : '2',
						action : 'hide'
					}]);


					//- collapse steps
					var aCollapseSteps = [
						'#step3ACform',
						'#step3form',
						'#step2info'
					];
					if(!base.fn.und(_common)) _common.giftCardApplied || aCollapseSteps.push('#step2load');
					$(window).trigger('methodRequest', [ 'collapseSteps', {
						steps : aCollapseSteps
					}]);
*/

						dig("#step2info").hide();
						dig("#step2form")
							.htmlOverride(data)
							.slideDown(500, function() {
								$(this).css("height", "auto");

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

						//self.view.scroll2();
						break;
					case "tpl_step2_sum":
						console.log("step2 sum");
						/*$(window).trigger('methodRequest', [ 'loadTemplate', {
						tpl : 'tpl_step2_silent_form_load'
					}]);
*/
						//jQuery('#step2head').text('Step 2 of 3: Your payment is...');

						/*$(window).trigger('methodRequest', [ 'editLinkAnimate', {
						step : '2',
						action : 'show'
					}]);*/
						//jQuery('#step2head .editLink').show();
						//jQuery('#step2head span.label').hide();

						$(window).trigger("methodRequest", [
							"collapseSteps",
							{
								steps: ["#step2form", "#step2load"]
							}
						]);
						dig("#step3bottom").show();
						dig("#step2info")
							.htmlOverride(data)
							.slideDown(500, function() {
								$(window).trigger("step2SumLoaded");
							});
						dig("#step2form").hide();

						//jQuery('.labeled:enabled:visible').showLabels();
						dig("#editcart").addClass("hideThis");

						//hide "sold to" if it's a giftcard payment method that covers the total
						if (base.opc.config.form.useDummyAddress) {
							dig(".billingAddress").hide();
						}

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

				//Watch all payment inputs for focus
				$(".paymentOptions input, .paymentOptions select").one(
					"focus",
					function(e, t) {
						sendPaymentStartAnalytics(getPaymentType(this));
					}
				);

				//Watch paypal button
				$("#PPpaymentSubmit").one("click", function(e, t) {
					sendPaymentStartAnalytics("PayPal");
				});

				//console.log('GMAPS on step2');
				//trigger GA autocomplete on the address field in the billing form
				$(window).trigger("initGAutocomplete", {
					currentForm: base.opc.config.form.GAAutocompleteBillingForm
				});

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

				//Handle Payment submittal
				dig(".submitButton")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						var me = $(this);

						var whichPaymentMethodVal = $(
							"input[name=ppMethod]:checked"
						).val();
						dig("#whichPaymentMethod").val(whichPaymentMethodVal);

						//dig('.stepLoad').show();

						//if Use Shipping Address is checked then make sure the values are updated before proceeding
						if (
							$(".useShipAddrChk").is(":checked") &&
							!window.base.opc.config.form.isRegistry
						) {
							$(window).one(
								"afterUseShippingAddress",
								function() {
									$(window).trigger("methodRequest", [
										"submitForm",
										{
											obj: me,
											cnf: "paymentSubmit",
											form: "form#paymentFormId"
										}
									]);
								}
							);

							$(window).trigger("useShippingAddress");
						} else {
							console.log("no useShippingAddress");
							$(window).trigger("methodRequest", [
								"submitForm",
								{
									obj: me,
									cnf: "paymentSubmit",
									form: "form#paymentFormId"
								}
							]);
						}
					});

				//CLIENT-SIDE FORM VALIDATION
				//https://jqueryvalidation.org/validate
				dig("form#paymentFormId").validate(
					base.opc.config.form.validatorRules
				);

				//Handle PayPal payment option
				dig(".PPsubmitButton")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();

						$("input#ppMethodId2").click();

						var whichPaymentMethodVal = $(
							"input[name=ppMethod]:checked"
						).val();
						dig("#whichPaymentMethod").val(whichPaymentMethodVal);

						//dig('.stepLoad').show();

						//handle event when step1 is done
						$(window).one("singleStep1_Finshed", function() {
							//TRIGGER STEP2 - Payment submit - 4/26/2016 TF
							$(window).trigger("methodRequest", [
								"submitForm",
								{
									obj: $(this),
									cnf: "paymentSubmit",
									form: "form#paymentFormId"
								}
							]);
						});

						//trigger original steps for checkout. Subsequent steps are triggered in order.
						$("#shippingSubmit").click();
					});

				//Databind email fields

				//If the receipt field is blank - databind it to email field in address section.
				if (
					$("#ereceiptAddr1Top").is(":visible") &&
					($("#ereceiptAddr1").val() == "" ||
						!$("#ereceiptAddr1").is(":visible"))
				) {
					$("#ereceiptAddr1Top").on("keyup change", function() {
						$("#ereceiptAddr1").val($("#ereceiptAddr1Top").val());
						$("#ereceiptAddr2").val($("#ereceiptAddr1Top").val());
					});
				}

				//If the confirm field is hidden - databind it to original input field (essentially allowing to remove the confirm field.
				if ($("#ereceiptAddr1").is(":visible")) {
					$("#ereceiptAddr1").on("keyup change", function() {
						$("#ereceiptAddr2").val($("#ereceiptAddr1").val());
					});
				}

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

			function sendPaymentStartAnalytics(paymentType) {
				//send data to GTM for checkout tracking
				if (!base.opc.config.form.eventFired_step1) {
					dataLayer.push({
						event: "checkoutStep",
						checkoutStep: "Payment Info Start",
						eventLabel: paymentType
					});
					s.events = "event21";
					s.evar24 = paymentType;
					base.opc.config.form.eventFired_step1 = true;
				}
			}

			function getPaymentType(el) {
				if (
					$(el).closest('form[id^="paymentFormGiftCardsId"]').length >
					0
				) {
					return "Gift Card";
				} else if ($(el).closest("form#paymentFormId").length > 0) {
					return "Credit Card";
				} else {
					return "unknown";
				}
			}

			function paymentTypeRoutine(radSel) {
				//killStyle(dig('#step2form'));

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
					//dig('#' + radSel).parent('.ppMethodRadio').next('.ppMethodRadioContent').slideDown(666);
				} else {
					//dig('.ppMethodRadioContent').slideUp('slow');
				}
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);

(function($) {
	try {
		//Define the plugin's name here
		var __name = "step2_ppx";
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

				var e = dig("#step2form");
				var f = function() {
					//console.log('stepLoaded b4');
					$(window).trigger("stepLoaded", ["step2_ppx"]);
				};
				dig("#step2head").show();
				e.hide().removeAttr("style");

				e = base.fn.und(cartUpdate)
					? e
							.hide()
							.htmlOverride(data)
							.slideDown()
							.on("htmlOverride.done", f)
					: e.htmlOverride(data).on("htmlOverride.done", f);
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

				self.view
					.off("saveInitFormAddress")
					.on("saveInitFormAddress", function(evt) {
						saveInitFormAddress();
					});

				saveInitFormAddress();

				self.view.off("stepErrors").on("stepErrors", function(evt) {
					dig(".stepLoad").fadeOut(444);
				});
				//console.log(['bindEvents', self.view]);

				//- On sidebar cart update event
				onCartUpdate();

				dig("#showGiftOptLink")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						//$('*').qtip('destroy');

						//$(this).toggleClass('active');
						dig("#giftopt1").toggle();
						dig("#gobbot1").toggleClass("gobbotcorner");
						dig("#gobbot1").toggleClass("cobbotcorner");
					});
				openShowGiftOptLink();

				//- Gift card allowed chars
				//$('.giftmsgform input[type="text"]').giftCardValidation();

				var eDD = dig("#opcShippingFormId_Operation");
				if (eDD.length) {
					eDD.val(eDD.find("optgroup option:first").val());
					dig(".addrform")
						.find('[id^="shippingAddressOperation"]')
						.val(eDD.val());
					$(window).trigger("methodRequest", [
						"autoFillAddress",
						{
							elm: eDD
						}
					]);
				}

				dig(".goptitem, .shippingMethod")
					.unbind("click")
					.on("click", function(evt) {
						$(window).trigger("methodRequest", [
							"retainFormValues",
							{
								callback: function() {
									$(window).trigger("methodRequest", [
										"submitForm",
										{
											obj: $("#shippingSubmit"),
											cnf: "singleStep1p2_SILENT",
											form: "#singleshipformid",
											callback: function(data) {
												if (data.success !== true) {
													$(window).trigger(
														"errors",
														[
															data,
															base.opc.config.form
																.current.id
														]
													);
													return false;
												}
												$("#cartsummary").trigger(
													"forceUpdateItem",
													[{}]
												);
											}
										}
									]);
								}
							}
						]);
					});
			}

			function saveInitFormAddress() {
				//- retain init address
				base.opc.config.form.addresses["init"] = {};
				dig('#singleshipformid input[type="hidden"]')
					.filter(function() {
						if (base.fn.und($(this).attr("id"))) return false;
						return (
							$(this)
								.attr("id")
								.indexOf("ss") != -1
						);
					})
					.each(function() {
						//- retain previous val
						base.opc.config.form.addresses["init"][
							$(this).attr("id")
						] = $(this).val();
					});
			}

			function openShowGiftOptLink() {
				var hasData = false;
				dig("#giftopt1")
					.find('input[type="text"], input[type="checkbox"]')
					.each(function() {
						if (hasData) return;
						switch ($(this).getInputType()) {
							case "text":
								hasData = $(this).val() != "";
								break;
							case "checkbox":
								hasData = $(this).prop("checked") == true;
								break;
						}
					});
				hasData ? dig("#showGiftOptLink").trigger("click") : "";
			}

			function onCartUpdate() {
				self.view.off("cartUpdate").on("cartUpdate", function(evt) {
					var tpl = [];
					tpl.push("tpl_shippingMethods_ppx");

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
(function($) {
	try {
		//Define the plugin's name here
		var __name = "step3ac_ppx";
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
			self.defaults = {
				data: null,
				cnf: "",
				success: false,
				isSubmitted: false
			};

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
			var isSubmitted = false;
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
					case "tpl_createAccount_ppx":
						dig("#step3ACinfo").slideUp();

						dig("#step3ACform")
							.hide()
							.css("height", "auto")
							.htmlOverride(data)
							.slideDown();
						break;
					case "tpl_step3ac_info_ppx":
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
				//console.log('step3ac_ppx');
				isSubmitted = self.options.isSubmitted;
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
			}

			function onCartUpdate() {
				self.view.off("cartUpdate").on("cartUpdate", function(evt) {
					var tpl = [];
					switch (base.opc.config.form.current.step) {
						case "3ac":
							tpl.push(
								isSubmitted
									? "tpl_step3ac_info_ppx"
									: "tpl_createAccount_ppx"
							);
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
(function($) {
	try {
		//Define the plugin's name here
		var __name = "stepAccount_common";
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

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				bindEvents();
			}

			function bindEvents() {
				//- Create my account link

				var eCreateAccount = dig('[name="createaccount"]');
				var eACwrapper = dig("#cAwrapper");

				dig("#aclink, #aclinkCancel")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						//-
						$(window).trigger("methodRequest", [
							"clearAllErrors",
							{}
						]);

						killStyle(dig("#step3ACform"));
						eCreateAccount.val(
							eCreateAccount.val() == "false" ? "true" : "false"
						);
						eACwrapper.slideToggle(250);
						return false;
					});

				//- create account checkbox
				/*
			var eCheckbox = dig('input[name="createaccount"]');
			eCheckbox
			.unbind('click')
			.on('click', function(evt) {
				killStyle(dig('#step3ACform'));
				eACwrapper[$(this).is(':checked') ? 'slideDown' : 'slideUp'](250);
			});
			eACwrapper[eCheckbox.is(':checked') ? 'slideDown' : 'slideUp'](250);*/

				//- Create account link
				dig(".editLink")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						isSubmitted = false;
						$(window).trigger("methodRequest", [
							"collapseSteps",
							{
								steps: [
									base.opc.isPPX ? "#step4form" : "#step3form"
								]
							}
						]);
						dig("#step3ACinfo").slideUp(500);
						dig("#step3ACform").slideDown(500, function() {
							killStyle($(this));
							//eCheckbox.prop('checked', true);
							eCreateAccount.val("true");
							eACwrapper.slideDown(250);
						});
					});
			}

			function killStyle(el) {
				el.removeAttr("style");
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
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

				if (
					base.opc.user.isTransient &&
					window.base.opc.config.form.useShipFirstLoad
				) {
					//window.base.opc.config.form.useShipFirstLoad is set to false in stepPayment_common.js
					$(window).trigger("selectUseShippingAddress");
				}
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

				$(window).on("selectUseShippingAddress", function() {
					//console.log('select event');
					selectUseShippingAddress();
				});
				$(window).on("useShippingAddress", function() {
					useShippingAddress();
				});
				$(window).on("unselectUseShippingAddress", function() {
					unselectUseShippingAddress();
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
							hideBillingAddress();
						} else {
							$(this).prop("checked", false);
							enableShippingCCAddrForm();
							showBillingAddress();
						}
					});

				dig("#creditCardAddrDropdown")
					.unbind("change poke")
					.on("change poke", function(evt) {
						var ccDDL = $(this);

						//unselect checkbox by default
						unselectUseShippingAddress();

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
								dig("#isUseShippingAddress")
									.prop("checked", false)
									.change();
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
				dig("#paymentFormId .addrform input").val("");
			}

			function selectUseShippingAddress() {
				//console.log('selected address');
				dig(".useShipAddrChk")
					.prop("checked", true)
					.change();
			}
			function unselectUseShippingAddress() {
				//console.log('unselect');
				if (dig(".useShipAddrChk").prop("checked")) {
					dig(".useShipAddrChk")
						.prop("checked", false)
						.change();
					enableShippingCCAddrForm();
				}
			}
			function hideBillingAddress() {
				dig(".paymentOptionsCCBody .name").hide();
				dig(".paymentOptionsCCBody .address").hide();
				dig(".paymentOptionsCCBody .citystatezip").hide();
				dig(".paymentOptionsCCBody .phone").hide();
				dig(".paymentOptionsCCBody #saveCCaddr").hide();
			}
			function showBillingAddress() {
				dig(".paymentOptionsCCBody .name").show();
				dig(".paymentOptionsCCBody .address").show();
				dig(".paymentOptionsCCBody .citystatezip").show();
				dig(".paymentOptionsCCBody .phone").show();
				dig(".paymentOptionsCCBody #saveCCaddr").show();
			}
			function useShippingAddress() {
				//console.trace("useShippingAddress");
				base.opc.config.form.useDummyAddress = false;
				base.opc.config.form.useShipFirstLoad = false;
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

				//Clear form errors
				base.opc.config.form.validatorRules.clearErrors(
					"#paymentFormId"
				);

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

					$(window).trigger("afterUseShippingAddress");
				}, 1);

				hideBillingAddress();
			}

			function useDummyAddress() {
				base.opc.config.form.useDummyAddress = true;

				var map = {
					"#ccAddrId": "Dummy",
					"#ccfirstName": "Surly",
					"#cclastName": "Table",
					"#ccaddress1": "6100 4th ave S",
					"#ccaddress2": "",
					"#cccity": "Seattle",
					"#ccstate": "WA",
					"#ccpostalCode": "98108",
					"#ccphoneNumber": "222-222-2222",
					"#ccfirstName2": "Surly",
					"#cclastName2": "Table",
					"#ccaddress12": "6100 4th ave S",
					"#ccaddress22": "",
					"#cccity2": "WA",
					"#ccstate2": "Seattle",
					"#ccpostalCode2": "98108",
					"#ccphoneNumber2": "222-222-2222"
				};

				//Clear form errors
				base.opc.config.form.validatorRules.clearErrors(
					"#paymentFormId"
				);

				//$('.useShipAddrChk').prop('checked',true).parents('.addrform').first().find('.errMissed').removeClass('errMissed');
				//$('.isUseShippingAddress').val('true');

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
						dig(k).val(v);
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
				$(window).trigger("methodRequest", [
					"loadTemplate",
					{
						tpl: "getTotals",
						callback: function() {
							orderSatisfiedHandler();
						}
					}
				]);
			});

			var orderSatisfiedHandler = function() {
				if (base.opc.config.form.totalSatisfied == true) {
					dig("#ccFormBox").attr(
						"data-gutter-toggle",
						"soldToHoverMessage"
					);

					dig("#giftCardsModule .gcform,.ccform").hide();

					dig("#cc_form .addrform").hide();
					//dig('#cc_form .addrform h6').hide();
					//dig('#shipToShipAddr,#soldToParagraph').show();

					//dig('#cc_form').children('h3:first').html('Sold to (Enter Name &amp; Address) <a href="#" class="soldto"><span class="note inline">(Why do we need this?)</span></a>');

					$("#soldto").remove();
					/*$('body').append(
					$('<div id="soldto" class="jqmWindow jqm-init">' +
						'<h6>“Sold To” Address</h6>' +
						'<p>For technical reasons, all orders require a physical address associated with them. We won’t use it to add you to any mailing lists.</p>' +
						'<p><a href="#" class="button reverse right cartpopupclose"><span>Close</span></a></p>' +
					'</div>')
				);*/

					//if ordered is fully covered by the gift card, use a dummy address for billing so customer doesn't have to enter it in
					useDummyAddress();

					/*if(base.opc.isElectronicOnly){
					useDummyAddress();
				}
				//if there's a hard good default the billing address to use the physical address
				else{
					console.log('useShippingAddress');
					useShippingAddress();
				}*/

					soldToHandler();

					dig("#creditcardHoverMessage").addClass("noCC");

					//dig('#savedSoldToAddresses').removeClass('hideThis');
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
					dig(".ppMethodRadioContent").hide();
					dig(".ppMethodRadioContent")
						.first()
						.closest(".panel-collapse")
						.collapse("hide"); //close the CC accordion
					dig("#giftCardsModule .panel-collapse").collapse("show"); //show the GC accordion
					dig(".CGsoldToParagraph")
						.html(
							"Your order total is covered by your gift card(s) and promotion entries. You don't need to include further payment."
						)
						.show();
					dig(".paypalPayment").hide();

					lastStep = 2;
				} else {
					dig("#ccFormBox").attr(
						"data-gutter-toggle",
						"creditcardHoverMessage1"
					);

					dig("#cc_form .addrform").show();
					dig(".gcform,.ccform").show();
					//dig('#creditcardHoverMessage').show();

					dig("#giftCardsModule,#promoCodesModule").show();

					//dig('.ppMethodRadio').show();//.removeClass('hideThis');
					// dig('#ppMethodId3').trigger('click');

					dig("#creditcardHoverMessage").removeClass("noCC");

					dig("#cc_form .addrform h6").show();
					dig("#shipToShipAddr,#soldToParagraph").hide();
					dig(".CGsoldToParagraph")
						.html("")
						.hide();
					dig(".paypalPayment").show();

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
					$(".ppMethodRadioContent").show();
				}
			};

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

				dig("a.btn.giftCardCheckBalanceBtn").on("click", function() {
					hideGiftCardErrorMessages();
				});

				dig("#addGiftCardSubmit")
					.unbind("click")
					.on("click", function() {
						hideGiftCardErrorMessages();
					})
					.on("click", function(evt) {
						evt.preventDefault();
						console.log("fire 2");
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

				//Databind giftcard fields
				$("#giftCardNumberField").on("keyup change", function() {
					$("#giftCardBalanceNumberId").val(
						$("#giftCardNumberField").val()
					);
				});
				$("#giftCardPinField").on("keyup change", function() {
					$("#giftCardBanlancePinNumberId").val(
						$("#giftCardPinField").val()
					);
				});
				$(".giftCardCheckBalanceBtn").on("mousedown", function() {
					$("#giftCardBalanceNumberId").val(
						$("#giftCardNumberField").val()
					);
					$("#giftCardBanlancePinNumberId").val(
						$("#giftCardPinField").val()
					);
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

			/* hide gift card error section for Check Balance and Apply Gift Card  */
			function hideGiftCardErrorMessages() {
				dig(
					"form#check_gift_card_balance div.message.haserror>div"
				).hide(); //GC balance
				dig(
					"form[id^=paymentFormGiftCardsId]>div.has-error>div.help-block"
				).hide(); //GC apply
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
/* APO Military Zip Validation For Ship-to in checkout
*
* NOTES:
* - CSV converted to JSON at http://www.convertcsv.com/csv-to-json.htm
* - Window event handlers set in opc.js
* - triggered in step1.js
*
* REQUIRES: Jquery Mask plugin, opc.js, base.opc.config.form.js
* 
*/

(function($) {
	try {
		//Define the plugin's name here
		var __name = "zipValidation";
		//--
		$.fn[__name] = function(options) {
			//-- Vars
			//-- ------------------------------------------------------
			var f = function(s) {
				return self.view.find(s);
			};
			var zipField;
			var form;
			var data;
			var JSONurl = "/scripts/opc/APOzips.json";
			var fiveZip;
			var zipFourVal;
			var fiveArr;
			var zipBasedObj = {};

			//-- Plugin gymnastics - Part 1/3
			//-- ------------------------------------------------------
			var self = this; // prevent from losing the scope
			self.view = $(this);
			self.view.data(__name, self); // store the plugin instance into the element
			//-- ------------------------------------------------------

			//-- init
			//-- ------------------------------------------------------
			self.defaults = {
				zipField: null
			};

			self.initialize = function() {
				// merging defaults with passed arguments
				self.options = $.extend(true, {}, self.defaults, options);
				//-
				return ignite();
			};

			//-- Start
			//-- ------------------------------------------------------
			function ignite() {
				//console.log('zip ignite');
				//set vars now that we have options
				zipField = f(self.options.zipField);
				form = self.view;

				//require zip code fields to be present
				if (zipField && !zipField.data("loaded")) {
					//mark loaded to prevent multiple events on the same field
					zipField.data("loaded", true);

					//set standard mask on first load
					setMask();

					//trigger
					bindEvents();
				}

				return self;
			}

			function bindEvents() {
				//console.log("zip bind");

				//on 5 digit blur
				form.on("blur", self.options.zipField, function(e) {
					zipCheck();
				});
				//on 5 digit keypress
				form.on("keyup", self.options.zipField, function(e) {
					zipCheck();
				});

				form.on("validate", self.options.zipField, function(e) {
					validate();
				});
				form.on("invalidate", self.options.zipField, function(e) {
					invalidate();
				});
				form.on("requireFour", self.options.zipField, function(e) {
					//pop message saying 4 more are needed
					//console.log('requires 4 more');
					popMessage();
				});
				form.on("reset", self.options.zipField, function(e) {
					//when user starts over and we need to clear requirements
					resetAttr();
				});
			}

			function zipCheck() {
				//console.log("zipcheck");

				var zipVal = zipField.val();
				//stop check if field doesn't contain at least 5 characters
				if (zipVal.length < 5) {
					zipField.trigger("reset");
					return;
				}

				//do the first 5 digits match the APO zips?
				fiveZip = zipVal.substring(0, 5);
				//get JSON reference
				if (!data && data != "fail") {
					getJSON(zipCheck);
					return;
				}

				//check for zip match
				var match = fiveCheck(zipVal.substring(0, 5));

				if (!match) {
					zipField.trigger("reset");
					return;
				}

				//if match and exactly 5 characters, store defaults, change max lengths on field and auto-include dash
				if (zipVal.length == 5) {
					//save original values
					zipField.maxLength = zipField.attr("maxlength");
					zipField.size = zipField.attr("size");

					//set new values
					zipField.attr("maxlength", "10");
					zipField.attr("size", "10");

					//and require that 4 more digits be entered (5 including the dash that is auto included)
					zipField.unmask().mask("00000-0000", {});
					zipField.val(zipField.val() + "-");

					//require four more digits
					zipField.trigger("requireFour");
				}

				//THIS CONDITION CAN'T EXIST WITHOUT THE ATTRIBUTE CHANGES ABOVE
				//run validation on 4 additional digits
				zipFourVal = zipVal.split("-")[1];

				if (!zipFourVal || zipFourVal.length != 4) {
					//test
					return;
				}

				//Do the +4 match a zip?
				//if so, mark field as valid
				//if not, popMessage()
				fourCheck()
					? zipField.trigger("validate")
					: zipField.trigger("invalidate");
			}

			function fiveCheck(zipVal) {
				//returns -1 or index (Bool)
				return data
					.map(function(obj, i, me) {
						return obj["5DigitZip"];
					})
					.indexOf(zipVal) == -1
					? false
					: true;
			}

			function fourCheck() {
				//build zip based array if it doesn't exist
				if (jQuery.isEmptyObject(zipBasedObj)) {
					for (var i = 0; i < data.length; i++) {
						//check for 5zip array key
						if (!zipBasedObj[data[i]["5DigitZip"]]) {
							//create blank entry as array to push to
							zipBasedObj[data[i]["5DigitZip"]] = [];
						}

						//push 4 zip to new 5zip key
						zipBasedObj[data[i]["5DigitZip"]].push(data[i]["Zip4"]);
					}
				}

				//do the inputted 4 digits match the APO zips and belonging to the fiveField?
				//console.log(zipBasedObj[fiveZip]);

				return zipBasedObj[fiveZip].indexOf(zipFourVal) == -1
					? false
					: true;
			}

			function resetAttr() {
				//reset attributes only if they were changed
				//zipField.maxLength is only present if changed
				if (zipField.maxLength) {
					zipField.attr("maxlength", zipField.maxLength);
					zipField.attr("size", zipField.size);
					setMask();
					zipField.firstCheckDone = false;
					validate();
				}
			}

			function popMessage() {
				zipField.data("valid", false);
				$(window).trigger("errors", [
					{
						postalCode0:
							"The USPS requires a valid +4 ZIP code for FPO addresses. To find the correct +4 ZIP code, <a href='https://tools.usps.com/go/ZipLookupAction!input.action?mode=0&refresh=true' target='_blank'>click here</a>."
					},
					"singleshipformid"
				]);
			}

			function validate() {
				// console.log('validate');
				zipField.data("valid", true);
				$(window).trigger("clearErrors");
			}

			function invalidate() {
				//console.log('invalidate');
				zipField.data("valid", false);
				$(window).trigger("errors", [
					{
						postalCode0:
							"Oops! This APO/FPO ZIP is invalid. Please use valid +4 digits. To find the correct +4 ZIP code, <a href='https://tools.usps.com/go/ZipLookupAction!input.action?mode=0&refresh=true' target='_blank'>click here</a>."
					},
					"singleshipformid"
				]);
			}

			function setMask() {
				var options = {
					onKeyPress: function(cep, e, field, options) {
						mask = cep.length < 5 ? "00000" : "00000-0000";
						zipField.mask(mask, options);
					}
				};
				zipField.mask("00000-0000", options);

				//original...
				//zipField.unmask().mask("99999",{});
			}

			function getJSON(callback) {
				$.ajax({
					url: JSONurl,
					complete: function(response) {
						/*
                        EXPECTED SAMPLE RESPONSE:
                        [{"5DigitZip":09501,"Zip4":1503,"UNIT/SHIP":"HSC 9"},
                        {"5DigitZip":09501,"Zip4":1913,"UNIT/SHIP":"PATROL COASTAL CREW D"}]

                    */

						if (response) {
							data = JSON.parse(response.responseText);
							callback();
						} else {
							data = "fail";
						}
					}
				});
			}

			//-
			return self.initialize();
		};
	} catch (e) {}
})(jQuery);
(function() {
	//console.log('google autocomplete');

	var autocomplete = [];
	var autocompletelistener = [];
	var componentForm = [];
	var currentForm = [];
	var ignoreList = []; /* add keys to ignore i.e. ignoreList.push("billingForm");*/

	/* Define if we want to use short / long value for each field */
	var componentFormDefault = {
		street_number: "short_name",
		route: "long_name",
		locality: "long_name",
		administrative_area_level_1: "short_name",
		country: "long_name",
		postal_code: "short_name"
	};

	/* Google expects the fields to be named as the componentForm, but we have our own field names
         so currentForm is used to map google and our form field names. This must be passed in by the caller.

         i.e.
              var currentForm = {
            key: 'uniqueKey'
            street_number: 'ssaddr1',
            route: 'ssaddr1',
            locality: 'sscity',
            administrative_area_level_1: 'ssstate',
            postal_code: 'sszip',
            apartment: 'ssaddr2'
          };

       */

	/* Custom event to initialize the textbox that will trigger the suggestions */
	$(window).on("initGAutocomplete", function(evt, data) {
		if (data) {
			if (data.componentForm) {
				componentForm[data.currentForm.key] = data.componentForm;
			} else {
				componentForm[data.currentForm.key] = componentFormDefault;
			}

			if (data.currentForm) {
				if (ignoreList.indexOf(data.currentForm.key) != -1) {
					return;
				}

				currentForm[data.currentForm.key] = data.currentForm;
			} else {
				console.log("Unable to set up Google Autocomplete");
				return;
			}

			var el = $("#" + data.currentForm.autocompleteBoxId).length;
			if (el > 0) {
				initAutocomplete(data);
			}
		}
	});
	/* Custom event to initialize the textbox that will trigger the suggestions */
	$(window).on("disableGAutocomplete", function(evt, key) {
		disableAutoComplete(key);
	});

	/* Custom event to initialize the textbox that will trigger the suggestions */
	$(window).on("hideGAutocomplete", function(evt) {
		hideGAutocomplete();
	});

	function disableAutoComplete(key) {
		google.maps.event.clearInstanceListeners(autocomplete[key]);
		google.maps.event.clearInstanceListeners(
			document.getElementById(currentForm[key].street_number)
		);

		$(".pac-container").remove();
		currentForm[key].isEnabled = false;
		currentForm[key] = "";

		$(window).trigger("AfterDisableGAutocomplete");
	}

	function hideGAutocomplete() {
		$(".pac-container").remove();
	}

	function initAutocomplete(data) {
		// Create the autocomplete object, restricting the search to geographical
		// location types.
		if (
			currentForm[data.currentForm.key] &&
			currentForm[data.currentForm.key].isEnabled != "undefined" &&
			currentForm[data.currentForm.key].isEnabled
		) {
			//disableAutoComplete(data.currentForm.key);
			//return;
		}
		autocomplete[
			data.currentForm.key
		] = new google.maps.places.Autocomplete(
			document.getElementById(data.currentForm.autocompleteBoxId),
			{ types: ["address"] }
		);

		// When the user selects an address from the dropdown, populate the address
		// fields in the form.

		currentForm[data.currentForm.key].isEnabled = true;
		google.maps.event.addListener(
			autocomplete[data.currentForm.key],
			"place_changed",
			function() {
				console.log("fill address autocomplete");
				fillInAddress(data.currentForm.key);
			}
		);
	}

	function fillInAddress(key) {
		// Get the place details from the autocomplete object.
		var place = autocomplete[key].getPlace();
		for (var component in currentForm[key]) {
			var el = document.getElementById(component);
			if (!el) {
				el = document.getElementById(currentForm[key][component]);
			}

			if (el) {
				el.value = "";
				el.disabled = false;
			}
		}

		// Get each component of the address from the place details
		// and fill the corresponding field on the form.
		for (var i = 0; i < place.address_components.length; i++) {
			var addressType = place.address_components[i].types[0];
			if (currentForm[key][addressType]) {
				var val =
					place.address_components[i][
						componentForm[key][addressType]
					];
				var currentValue = document.getElementById(
					currentForm[key][addressType]
				).value;
				var element = document.getElementById(
					currentForm[key][addressType]
				);
				if (currentValue.length > 0) {
					element.value = currentValue + " " + val;
				} else {
					element.value = val;
				}
				$(element).change();
				if (typeof $(element).valid == "function") {
					$(element).valid();
				}
			}
		}
	}

	function geolocate(key) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var geolocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				var circle = new google.maps.Circle({
					center: geolocation,
					radius: position.coords.accuracy
				});
				autocomplete[key].setBounds(circle.getBounds());
			});
		}
	}
})();

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
