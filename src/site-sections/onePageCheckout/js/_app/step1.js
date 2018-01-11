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

			var aZebraTooltips = {};
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

						eStep1Form
							.htmlOverride(data)
							.find('input[type="radio"]')
							.prop("checked", false)
							.eq(nCheckedRadio)
							.prop("checked", true);
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

						clearErrorMessages();
						//if required fields are missing, prevent form submission
						if (!ValidateOnlineClassRequiredFields()) {
							return;
						}

						dig(".stepLoad").show();
						$(window).trigger("methodRequest", [
							"submitForm",
							{
								obj: $(this),
								cnf: "singleStep1",
								form: "form#singleshipformid"
							}
						]);
					});

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

				dig("#showGiftOptLink")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();

						//$(this).toggleClass('active');
						$("#giftopt1").toggle();
					});

				dig("a.showMessage")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						//-
						dig("#" + $(this).attr("rel"))
							.removeClass("hideThis")
							.show();
						$(this).hide();
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

				//openShowGiftOptLink();

				//- Gift card allowed chars
				//$('.giftmsgform input[type="text"]').giftCardValidation();

				addressEvents();
			}

			function checkForRegistryValue(val) {
				return parseInt(val) > 9999999999;
			}

			function addressEvents() {
				var eDD = dig("#opcShippingFormId_Operation");
				var nShippingSelectionVal = dig("#shippingSelection").val();

				//- Existing address dropdown

				eDD.unbind("change").on("change", function(evt) {
					$(window).trigger("methodRequest", ["clearAllErrors", {}]);
					$(this)
						.parents(".addrform")
						.find('[id^="shippingAddressOperation"]')
						.val($(this).val());
					//allow updated to first on the first multi-address
					if (dig("#firstMultiStep").length > 0) {
						dig("#firstAddressSelectID").val($(this).val());
					}

					$(window).trigger("methodRequest", [
						"autoFillAddress",
						{
							elm: $(this)
						}
					]);

					if ($(this).val() && $(this).val().length < 1) {
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
					fnShowHideForm(checkForRegistryValue($(this).val()));
				});

				var val = eDD.val();
				var fnShowHideForm = function(isRegistry) {
					dig(".name, .address, .citystatezip, .phone")[
						isRegistry ? "hide" : "show"
					]();
					dig(".savedRegistryAddress")[
						isRegistry ? "removeClass" : "addClass"
					]("hideThis");
					dig("#saveAddressPanel")[
						isRegistry ? "addClass" : "removeClass"
					]("hideThis");
				};

				switch (base.opc.mode) {
					case "edit":
						eDD.val(nShippingSelectionVal);
						fnShowHideForm(
							checkForRegistryValue(nShippingSelectionVal)
						);
						break;
					default:
						fnShowHideForm(checkForRegistryValue(val));
						checkForRegistryValue(val) ||
							$(window).trigger("methodRequest", [
								"autoFillAddress",
								{
									elm: eDD
								}
							]);
						break;
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
				}
				//- suggested address
				if (typeof data.suggestedAddress == "object") {
					eFedx.find("tr th:eq(2)").show();
					eValidationLinks.filter('[rel="suggested"]').show();
					data.suggestedAddress.sname =
						dig("#ssfname").val() + " " + dig("#sslname").val();
					b = fnPopulate(data.suggestedAddress);
					dig("#fedexValidation-msg h6").text(
						data.errors["suggestedAddressNote"]
					);
				} else {
					eFedx.find("tr th:eq(2)").hide();
				}
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
			/*
		function InitStep1Common() {
			$('.showDetails').off('click').on('click', function() {
				//$(this).parents('div:first')
				//	.find('tr.initViewOff').toggleClass('showThis').toggleClass('hideThis')
				//		.find('.initViewOff').toggleClass('showThis').toggleClass('hideThis');
				$(this).parents('div:first').find('.initViewOff').toggleClass('hideThis');
				return false;
			});
			
			$('.editDetails').off('click').on('click', function() {
				if(NullifyEdit)
					return false;
				
				PrepStep1EditMode();
				
				ToggleVirtualDetailsEdit(this);
				
				$(this).off('click').on('click', function() { return false; });
				
				return false;
			});
		}

		function InitStep1SingleShip() {
			InitStep1Common();
			$('.singleShipEditHardgood').off('click').on('click', function(e) {
				if(NullifyEdit)
					return false;
				
				PrepStep1EditMode();
				
				current.skipAutoFillAddr = true;
				$(window).trigger('methodRequest', ['loadTemplate', {
					tpl : 'tpl_single',
					data: { mode: 'edit' },
					submit : true
				}]);
			});
		}

		function InitStep1MultiShip() {
			InitStep1Common();
			$('input[id^=multiVirtualForm_itemEmail]').off('blur').on('blur', function() {
				var EmailCtrl1 = $(this);
				var EmailCtrl2 = EmailCtrl1.siblings('.multiVirtualFormEmail').not(this);
				
				if (( EmailCtrl1.val().length > 0 && EmailCtrl1.val() != EmailCtrl1.prop('title') &&
						EmailCtrl2.val().length > 0 && EmailCtrl2.val() != EmailCtrl2.prop('title') &&
						EmailCtrl1.val() != EmailCtrl2.val())
						||
					(( EmailCtrl1.val().length == 0 || EmailCtrl1.val() == EmailCtrl1.prop('title')) &&
						EmailCtrl2.val() != EmailCtrl2.prop('title'))
					||
					(EmailCtrl1.val() == EmailCtrl1.prop('title') && EmailCtrl2.val() == EmailCtrl2.prop('title'))) {
					EmailCtrl1.siblings('div[id^=multiVirtualForm_emailId2Error]').show();
				} else {
					EmailCtrl1.siblings('div[id^=multiVirtualForm_emailId2Error]').hide();
				}
			
				EmailCtrl1 = null;		
				EmailCtrl2 = null;
			});
			
			$('a[id^=multiVirtualForm_saveDetails]').off('click').on('click', function() {
				var That = $(this);
				var EmailCtrl1 = That.parents('form:first').find('.multiVirtualFormEmail').eq(0);
				var EmailCtrl2 = That.parents('form:first').find('.multiVirtualFormEmail').eq(1);
				
				if (EmailCtrl1.val().length < 1 || EmailCtrl2.val().length < 1 || EmailCtrl1.val() != EmailCtrl2.val()) {
					That.parents('form:first').find('div[id^=multiVirtualForm_emailId2Error]').show();
				} else {
					That.parents('form:first').find('div[id^=multiVirtualForm_emailId2Error]').hide();
					
					$('#step1load').slideDown();
					$('#step2info').slideUp();

					submitForm($(this), 'editVirtualGifts', 'form#' + That.parents('form:first').attr('id'));
				}
			
				That = null;		
				EmailCtrl1 = null;		
				EmailCtrl2 = null;
				return false;
			});

			$('.multiShipEditHardgood').off('click').on('click', function(e) {
				if(NullifyEdit)
					return false;
				
				$('#step1load').slideDown();
				
				if($('#step1form').html().length > 0)
					$('#step1form').slideUp();
				
				PrepStep1EditMode();
				
			    var editButton = $(this);
			    editButton.parents('div.shipAddrInfo').first().slideUp().siblings('.shipAddrInfo:hidden').slideDown().siblings('.step').remove();
			    var getIndex2 = typeof($(this).find('em').text().split('_')[2]) == 'undefined' ? '0' : $(this).find('em').text().split('_')[2];
			    $.get('/checkout/opc/includes/singleShipEditInclude.jsp?editListIndex=' + $(this).find('em').text().split('_')[0] + '&editListCount=' + 
			    		$(this).find('em').text().split('_')[1] + '&editListAddressIndex=' + getIndex2 + '&_rand=' + Math.random(), function(data){
			                $(editButton).parents('div.shipAddrInfo').first().before(data);
			            	$('#step1load').slideUp();
			        });
			//    $.get('/checkout/opc/includes/singleShipEditInclude.jsp?editListIndex=' + $(this).find('em').text().split('_')[0] + '&editListCount=' + 
			//		$(this).find('em').text().split('_')[1] + '&editListAddressIndex=' + getIndex2 + '&whichPage='+whichPage+'&_rand=' + Math.random() , function(data){
			//            $(editButton).parents('div.shipAddrInfo').first().before(data);
			//    });
			    return false;
			});
		}

		function PrepStep1EditMode() {
			KillAllAsyncRequests();
			
			$('#step2load').slideUp();
			$('#step2form').slideUp();
			$('#step2info').slideUp();
			$('#step4form').slideUp();
			$('#step4load').slideUp();
			
			//$('#step2load').slideUp().empty();
			//$('#step2form').slideUp().empty();
			//$('#step2info').slideUp().empty();
			//$('#step4form').slideUp().empty();
			//$('#step4load').slideUp().empty();
		}*/

			//-

			function ValidateOnlineClassRequiredFields() {
				var isFormValid = true;
				var requiredFields = $(".onlineclass-gift input[required]");
				var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
				if (typeof requiredFields != "object") {
					return isFormValid;
				}

				for (i = 0; i < requiredFields.length; i++) {
					var field = $(requiredFields[i]);
					var id = field.attr("id");
					if (field.val() == "" || field.val() == null) {
						var labelFor =
							$("label[for='" + id + "']").html() +
							" is required.";
						displayErrorMessage(id, labelFor, true);
						isFormValid = false;
					} else {
						if (id.indexOf("email") != -1) {
							var isValid = pattern.test(field.val());
							if (!isValid) {
								displayErrorMessage(
									id,
									"Email Address is not valid.",
									true
								);
								isFormValid = false;
							}
						}
					}

					if (!isFormValid) {
						field.addClass("errRedBorder");
					}
				}

				return isFormValid;
			}

			function displayErrorMessage(id, message, display) {
				var el = dig("#" + id);
				doTooltip(el, message, null);

				/*
		    var msg = $('#'+id).siblings(".spanrequiredred.error-msg");
		    msg.html(message);
		    if (display) {
		        msg.css("display", "block");
		    } else {
		        msg.css("display", "none");
		    }
		    */
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
					vertical_offset: 28,
					horizontal_offset: 35
				});
				aZebraTooltips[nZT].show(el, true);
			}

			function clearErrorMessages() {
				$("div.Zebra_Tooltip").each(function(index, value) {
					if (value.length) {
						value.remove();
					}
				});

				$("[data-zebra-ref]").each(function() {
					$(this).removeAttr("data-zebra-ref");
					$(this).removeClass("errRedBorder");
				});

				aZebraTooltips = {};
			}

			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
