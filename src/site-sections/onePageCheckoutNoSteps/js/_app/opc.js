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
