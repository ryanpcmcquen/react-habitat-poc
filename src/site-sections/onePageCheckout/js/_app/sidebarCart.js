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
				dig(".sidebarCartUpdate")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						updateItem($(this), $(this).attr("rel"));
					});

				dig(".sidebarCartRemove")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						removeItem($(this).attr("rel"));
					});

				dig("#editcart2")
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

				dig("#paymentAddPromoCodeForm .button")
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
						data.step = base.opc.config.form.current.step; //ignore the step returned here
						$(window).trigger("errors", [data]);
					} else {
						alert(
							"Unknown Error Occurred. Please contact an administrator with the code: paymentApplyPromo"
						);
					}
				} else {
					totalSatisfied = data.totalSatisfied;

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
				return dig("table#cartitems tr").length == 0;
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
