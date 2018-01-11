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
