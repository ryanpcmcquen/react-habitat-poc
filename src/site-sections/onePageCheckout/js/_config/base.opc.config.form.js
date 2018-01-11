// used by "old" code
/* obj -> object within the form
 * cnf -> config to load
 * form -> form id
 * loadDiv ->
 */
function submitForm(obj, cnf, form, loadDiv, isAsync) {
	/* KEPT HERE TO PREVENT ANY INLINE USE FROM BRAKING.  Function logic resides in opc.js (/SurLaTable/workspace/ui_sources/js/_app) */
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
		currEditIndex: "",
		onlineClassesLoaded: 0,
		onlineClassesNumRecipients: 0,
		onlineClassTimer: 0,
		eventFired_step1: false,
		eventFired_step2: false,
		eventFired_step3: false,
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
			phoneNumber0: {
				selector: "#ssphone:eq(0)",
				step: "1"
			},
			unableToVerifyAddressNote: {
				selector: "#fedexValidation-msg",
				step: "1"
			},
			suggestedAddressNote: {
				selector: "#fedexValidation-msg",
				step: "1"
			},
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
			moveToConfirmation: {
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
				selector: "#ccFormBox .addrform",
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
			},
			confirm: {
				selector: "#step2 #creditCardNumberT",
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
				url: "/checkout/opc/includes/sidebarCart.jsp",
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
					"/checkout/opc/includes/sidebarCart.jsp?defaultShippingMethod=true",
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
				url: "/checkout/opc/includes/sidebarCart.jsp",
				type: "GET",
				async: true,
				dataType: "html",
				success: function(data) {
					jQuery("#cartsummary")
						.htmlOverride(data)
						.sidebarCart({
							updateLeftSide: true
						});
				}
			},

			tpl_promo_sum: {
				url: "/checkout/opc/includes/promoSum.jsp",
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
				url: "/checkout/opc/includes/singleShipInclude.jsp", //singleShipInclude.jsp',
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
					$("#step1").step1({
						success: true,
						cnf: "tpl_single",
						data: data
					});
				}
			},

			tpl_single_silent_form_load: {
				url: "/checkout/opc/includes/singleShipInclude.jsp", //singleShipInclude.jsp',
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
				url: "/checkout/opc/includes/singleShipInclude.jsp",
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
				url: "/checkout/opc/includes/step3acSum.jsp",
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
				url: "/checkout/opc/includes/step3acSum.jsp?ppx=1",
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
				url: "/checkout/opc/includes/step3ac.jsp",
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
				url: "/checkout/opc/includes/step3ac.jsp?ppx=1",
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
				url: "/checkout/opc/includes/step2Initial2_ppx.jsp",
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
				url: "/checkout/opc/includes/sidebarCart.jsp",
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
				url: "/checkout/opc/includes/singleshipStep1Sum.jsp",
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
				url: "/checkout/opc/includes/singleshipStep1Sum_ppx.jsp",
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
				url: "/checkout/opc/includes/singleshipStep1Sum_ppx.jsp",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {},
				success: function(data) {
					//console.log('tpl_single1_ppx_SILENT - success');
				}
			},

			tpl_shippingMethods_ppx: {
				// Shipping Options
				url: "/checkout/opc/includes/singleShipInclude_ppx.jsp",
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
				url: "/checkout/opc/includes/step2Initial1_ppx.jsp",
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
					"/checkout/opc/includes/step2Initial1_ppx.jsp#giftCardsDiv",
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
				url: "/checkout/opc/includes/step3_ppx.jsp",
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
				url: "/checkout/opc/includes/singleshipStep1Sum_ppx.jsp",
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
				url: "/checkout/opc/includes/singleShipInclude.jsp",
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
				url: "/checkout/opc/includes/singleshipStep1Sum.jsp",
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
					jQuery("#step1info")
						.htmlOverride(data)
						.slideDown(500);
				}
			},

			tpl_step1_sum_edit_single: {
				// Multi-address submit summaries - items remaining = true
				url: "/checkout/opc/includes/singleShipInclude.jsp",
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
					"/checkout/opc/includes/step2Initial.jsp?w=1&currentType=single",
				type: "GET",
				dataType: "html",
				success: function(data) {
					$("#step2").step2({
						success: true,
						cnf: "tpl_step2",
						data: data,
						cartUpdate: this.cartUpdate
					});
				}
			},

			tpl_step2_oncartUpdate: {
				url:
					"/checkout/opc/includes/step2Initial.jsp?w=1&currentType=single&onCartUpdate=true",
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
					"/checkout/opc/includes/step2Initial.jsp?w=1&currentType=single",
				type: "GET",
				dataType: "html",
				beforeSend: function(jqXHR, settings) {},
				complete: function() {},
				success: function(data) {
					jQuery("#step2form")
						.hide()
						.htmlOverride(data);
					$(window).trigger("methodRequest", [
						"editLinkAnimate",
						{
							step: "2",
							action: "show"
						}
					]);
				}
			},

			tpl_giftcard_sum: {
				url: "/checkout/opc/includes/giftCardSum.jsp",
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
				url: "/checkout/opc/includes/step3.jsp",
				type: "GET",
				dataType: "html",
				success: function(data) {
					$(window).trigger("methodRequest", [
						"setStep",
						{ step: 3 }
					]);

					$(window).trigger("methodRequest", [
						"editLinkAnimate",
						{
							step: "2",
							action: "show"
						}
					]);

					$("#step3").step3({
						success: true,
						cnf: "tpl_order_confirmation",
						data: data
					});
				}
			},

			tpl_order_confirmation_ppx: {
				url: "/checkout/opc/includes/step3.jsp",
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
				url: "/checkout/opc/includes/step2Sum.jsp",
				type: "GET",
				dataType: "html",
				success: function(data) {
					$("#step2").step2({
						success: true,
						cnf: "tpl_step2_sum",
						data: data,
						cartUpdate: this.cartUpdate
					});
				}
			},

			tpl_step4_sum: {
				url: "/checkout/opc/includes/step4Sum.jsp",
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
				url: "/checkout/opc/singlePageSignIn.jsp?from=getTotals",
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
				url: "/checkout/opc/singlePageSignIn.jsp?from=singleshipform",
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
						} else if (base.opc.config.form.current.lastStep > 1) {
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
				url: "/checkout/opc/singlePageSignIn.jsp?from=cartQuantity",
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
				url: "/checkout/opc/singlePageSignIn.jsp?from=singleshipform",
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
				url: "/checkout/opc/singlePageSignIn.jsp?from=singleshipform",
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
				url: "/checkout/opc/singlePageSignIn.jsp?from=singleshipform",
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
				url: "/checkout/opc/singlePageSignIn.jsp",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form, options) {
					//set in zipValidation.js---------
					//APO/FPO Zip validation check
					//Cancel submit if zip is invalid
					if ($("#sszip").data("valid") === false) {
						console.log("stop submit");
						jQuery("#step1load").hide();
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
						$(window).trigger("errors", [
							data,
							base.opc.config.form.current.id
						]);
					} else {
						//send data to GTM for checkout tracking
						if (!base.opc.config.form.eventFired_step1) {
							dataLayer.push({
								event: "checkoutStep",
								checkoutStep: "Shipping Info Complete"
							});
							s.events = "event20";
							base.opc.config.form.eventFired_step1 = true;
						}

						$(window).trigger("methodRequest", [
							"editLinkAnimate",
							{
								step: "1",
								action: "show"
							}
						]);

						orderTotal = data.orderTotal;
						base.opc.config.form.totalSatisfied =
							data.totalSatisfied;

						$(window).trigger("methodRequest", [
							"setStep",
							{ step: data.step }
						]);

						$(window).trigger("methodRequest", [
							"loadTemplate",
							{
								tpl: "tpl_step2",
								data: {
									data: {
										currentType:
											base.opc.config.form.current.type
									}
								}
							}
						]);

						$(window).trigger("methodRequest", [
							"loadTemplate",
							{ tpl: "tpl_step1_sum_single" }
						]);
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
					}
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			createAccountHandler: {
				// Email Receipt / Preview Order
				url: "/checkout/opc/singlePageSignIn.jsp",
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
				url: "/checkout/opc/singlePageSignIn.jsp",
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
				url: "/checkout/opc/singlePageSignIn.jsp?from=addmultiship",
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
				url: "/checkout/opc/singlePageSignIn.jsp?from=editVirtualGifts",
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
				url: "/checkout/opc/singlePageSignIn.jsp?from=editHardgoods",
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
				url: "/checkout/opc/singlePageSignIn.jsp?from=editHardgoods",
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
				url: "/checkout/opc/singlePageSignIn.jsp?from=addPayment",
				type: "POST",
				dataType: "json",
				beforeSerialize: function(form) {
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
							base.opc.config.form.current.lastStep = 2;
							method = "loadStep2Success";
						}
						$(window).trigger("methodRequest", [method, {}]);
					}

					NullifyEdit = false;
				},
				complete: function(data) {
					jQuery("#creditCardNumberT").prop("disabled", false); // re-enable temporary (masked) CC field in case this form is shown again
					jQuery("#step2load").hide();
				},
				error: function(data) {
					//console.log(['errrrrrror', data]);
					$(window).trigger("ajaxError", [data]);
				}
			},

			paymentSubmit_ppx: {
				url: "/checkout/opc/singlePageSignIn.jsp?from=addPayment",
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
				url: "/checkout/opc/singlePageSignIn.jsp",
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
						$(window).trigger("methodRequest", [
							"retainFormValues",
							{}
						]);
						$(window).trigger("methodRequest", [
							"formValuesRetained",
							{ view: $("#step1") }
						]);
						$(window).trigger("methodRequest", [
							"submitForm",
							{
								obj: $("#step1 .submitButton"),
								cnf: "singleStep1",
								form: "#step1 #singleshipformid",
								callback: function() {
									$(window).trigger("methodRequest", [
										"setStep",
										{ step: 1 }
									]);
									$(window).trigger("methodRequest", [
										"loadTemplate",
										{
											tpl: "tpl_step2",
											data: {
												data: {
													currentType:
														base.opc.config.form
															.current.type
												}
											},
											callback: function() {
												$(window).trigger(
													"methodRequest",
													[
														"formValuesRetained",
														{ view: $("#step2") }
													]
												);
												$(window).trigger("errors", [
													data
												]);
											}
										}
									]);
								}
							}
						]);
					}
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			moveToOrderCommit_ppx: {
				url: "/checkout/opc/singlePageSignIn.jsp",
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
				url: "/checkout/opc/singlePageSignIn.jsp?from=applyGiftcard",
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
					jQuery("div#giftcardLoad").hide(); //promocodespay
					$("#step2, #step3_ppx").trigger("methodRequest", [
						"giftCardSuccess",
						{
							data: data
						}
					]);
				},
				complete: function() {},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			paymentRemoveGiftCard: {
				url: "/checkout/opc/singlePageSignIn.jsp?from=removeGiftcard",
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
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			updateItemCartQty: {
				url: "/checkout/opc/singleShippingGroup.jsp",
				type: "POST",
				beforeSerialize: function(form) {
					base.opc.config.form.current.id = form.attr("id");
				},
				beforeSend: function(jqXHR, settings) {},
				success: function(data) {
					var step = base.opc.config.form.current.step;
					if (step == "3" || step == "3ac")
						$(window).trigger("methodRequest", [
							"setStep",
							{
								step: "2"
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
				},
				error: function(data) {
					$(window).trigger("ajaxError", [data]);
				}
			},

			/**
			 * Promotions Configurations
			 */
			paymentApplyPromo: {
				url: "/checkout/opc/singlePageSignIn.jsp?from=applyPromotion",
				type: "GET",
				dataType: "json",
				beforeSerialize: function(form) {
					base.opc.config.form.current.id = form.attr("id");
				},
				beforeSend: function(jqXHR, settings) {
					if (
						jQuery("#promoLoad")
							.show()
							.not(":eq(0)").length
					) {
						jQuery("#promoLoad")
							.show()
							.not(":eq(0)")
							.remove(); // Duplicates were popping up.  This will remove them
					}
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
				url: "/checkout/opc/singlePageSignIn.jsp?from=removePromotion",
				type: "GET",
				dataType: "json",
				beforeSerialize: function(form) {
					base.opc.config.form.current.id = form.attr("id");
				},
				beforeSend: function(jqXHR, settings) {
					jQuery("div#promocodespay div.giftcarddisp").hide();
					if (
						jQuery("div#promoLoad")
							.show()
							.not(":eq(0)").length
					) {
						jQuery("div#promoLoad")
							.show()
							.not(":eq(0)")
							.remove(); // Duplicates were popping up.  This will remove them.
					}
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
				url: '/checkout/opc/singleShippingGroup.jsp?action=remove',
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
		//		url: '/checkout/opc/singlePageSignIn.jsp?from=addPayment&whichPaymentMethodVal=' + $('#whichPaymentMethod').val(),
				url: '/checkout/opc/singlePageSignIn.jsp?from=addPayment',
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
				url: "/checkout/opc/includes/multishipStep1Sum.jsp",
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
				url: "/checkout/opc/includes/multishipStep1Sum.jsp",
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
				url: "/checkout/opc/includes/multishipStep1Sum.jsp",
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
				url: "/checkout/opc/includes/multishipStep1Initial.jsp",
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
				url: "/checkout/opc/includes/multishipAddressWithForm.jsp",
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
