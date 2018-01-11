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
