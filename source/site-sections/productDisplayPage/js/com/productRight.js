(function($) {
	try {
		//Define the plugin's name here
		var __name = "productRight";
		//--
		$.fn[__name] = function(options) {
			//-- ------------------------------------------------------
			var self = this; // prevent from loosing the scope
			self.view = $(this);
			self.view.data(__name, self); // store the plugin instance into the element
			//-- ------------------------------------------------------

			//-- init
			//-- ------------------------------------------------------
			self.defaults = {
				_productLeft: {},
				$sku: null,
				productId: 0
			};

			self.initialize = function() {
				// merging defaults with passed arguments
				self.options = $.extend(true, {}, self.defaults, options);
				//-
				return ignite();
			};

			//-- Vars
			//-- ------------------------------------------------------

			var f = function(s) {
					return self.view.find(s);
				},
				_productLeft,
				$sku,
				_gatrackr = PDPTracking.ga,
				productId,
				quantity = 1;

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				_productLeft = self.options._productLeft;
				productId = self.options.productId;

				$sku = self.options.$sku;
				showSku();

				bindToolTips();
				bindEvents();

				return self;
			}

			function bindEvents() {
				/*
                _productLeft.on('adjustHeight', function(evt, height) {
                    var thisHeight = self.view.outerHeight();
                    parseInt(height) <= parseInt(thisHeight) ? _productLeft.adjustHeight(thisHeight) : self.view.css('height', height);
                });*/

				/*
                 **    Read more
                 */

				f("div#product-descriptionTeaser > p > a").click(function() {
					self.view.trigger("scroll2", ["#product-description"]);
				});

				// Related Items
				f("div.relateditems a").on("click", function(evt) {
					evt.preventDefault();
					//-

					//- Google Analytics Tracking
					//pdpTracker('category', 'action', 'title');

					var el = $($(this).attr("href"));
					!el.length || el.scroll2();
				});

				/*
                 **    Confidence builders
                 */

				f("div#product-confidence a").on("click", function(evt) {
					evt.preventDefault();
					//-
					//- Google Analytics Tracking
					var e = _gatrackr.stella[$(this).attr("data-tracking")];
					pdpTracker(e[0], e[1], e[2] + " " + productId);

					var link = $(this).attr("href"),
						img = $(this).attr("data-image");

					//Removing document location change for SLT-1781
					//document.location.href = $(this).attr("data-link");

					// If the div has a link, open in new window (Stella)
					if (link != "#") {
						window.open(link, "_blank");
					} else if (img) {
						// Else, if the div has an image, show popup window
						$("div#product-confidence-popup>img").attr("src", img);
						$("div#product-confidence-popup")
							.show()
							.scroll2({
								padding: 150
							});
					}
				});

				/*
                 **    Hazmat-Learn More
                 */
				f("#product-hazmat-learnMore")
					.off("click")
					.on("click", function(evt) {
						window.setTimeout(function() {
							f("div#product-hazmat-message-popup")
								.css({
									left:
										f("div#product-availability").position()
											.left + 10,
									top:
										f("div#product-availability").position()
											.top + 6
								})
								.show();
						}, 100);
					});

				//- popup
				f(".product-close")
					.off("click")
					.on("click", function(evt) {
						$(this)
							.parent()
							.hide();
					});

				bindEventsCart();
			}

			function bindEventsCart() {
				var $colors = f(".product-optionsColor");
				var $sizes = f(".product-optionsSize");

				//- dev purposes only to test with colors/sizes
				/**
                var dummyColorsSizes = self.dummyColorsSizes = function() {

                    return {
                        colors : '<div class="product-optionsColor"><div class="product-optionsColor-select">  <!-- Color Swatch Value for sku 958678:  --><a href="#" data-color="Black" data-sku="5" style="background-image:url(http://);">Black</a><!-- Color Swatch Value for sku 958660:  --><a href="#" data-color="Red" data-sku="6" style="background-image:url(http://);">Red</a></div><span class="product-optionsColor-current">COLOR: <span itemprop="color"></span></span></div>',

                        sizes : '<div class="product-optionsSize"><div class="product-optionsSize-select"><a data-size="3 qt." class="activeSelection" data-sku="5">3 qt.</a><a data-size="4.5 qt." data-sku="6">4.5 qt.</a></div><span class="product-optionsSize-current">SIZE: <span itemprop="size">3 qt.</span></span></div>'
                    };
                };
                $colors = $colors.length ? $colors : $(dummyColorsSizes().colors);
                $sizes = $sizes.length ? $sizes : $(dummyColorsSizes().sizes);
                /**/

				_productLeft.dropletsReference({
					colors: $colors.clone(),
					sizes: $sizes.clone()
				});

				var _color = $colors.droplets({
					type: "color",
					callback: function($droplet) {
						var skuId = $droplet.attr("data-sku");
						_size.activate(skuId);

						chooseOption();
						updateSku(skuId);

						_productLeft.trigger("colorChange", [skuId]);
					}
				});

				var currentColorSkuId = _color.getCurrentSku();

				var _size = $sizes.droplets({
					type: "size",
					callback: function($droplet) {
						var skuId = $droplet.attr("data-sku");
						_color.activate(skuId);

						chooseOption();
						updateSku(skuId);

						_productLeft.trigger("sizeChange", [skuId]);
					}
				});

				var currentSizeSkuId = _size.getCurrentSku();

				_productLeft
					.on("variationRequest", function(evt) {
						!currentColorSkuId ||
							_productLeft.trigger("colorChange", [
								currentColorSkuId
							]);
						!currentSizeSkuId ||
							_productLeft.trigger("sizeChange", [
								currentSizeSkuId
							]);
					})
					.on("colorSizeRequest", function(evt, callback) {
						callback({
							color: f(".product-optionsColor"),
							size: f(".product-optionsSize")
						});
					});

				//- Quantity
				f("#product-optionsQuantity-select")
					.find("input")
					.on("blur", function(evt) {
						//- Google Analytics Tracking
						var e = _gatrackr.quantity,
							n = parseInt($(this).val()),
							numLeft = parseInt(f("#quantity-left").text());

						quantity = n;
						/*
                    if(n > numLeft) {
                        $(this).val(numLeft);
                        buzz(numLeft);
                        return;
                    }*/

						n == 0
							? $(this).val(1)
							: pdpTracker(
									e[0],
									e[1],
									e[2] + n + " - " + productId
								);
					});

				/*
                 **    Pre-order
                 */
				f(".product-future")
					.off("click")
					.on("click", function(evt) {
						//- Google Analytics Tracking
						var e = _gatrackr.availability.preorder;
						pdpTracker(e[0], e[1], e[2] + $(this).attr("data-sku"));

						window.setTimeout(function() {
							f("div#product-availability-preOrderPopover")
								.css({
									left:
										f("div#product-availability").position()
											.left + 10,
									top:
										f("div#product-availability").position()
											.top + 6
								})
								.show();
						}, 100);
					});

				f(".product-future-seedetails")
					.off("click")
					.on("click", function(evt) {
						window.setTimeout(function() {
							f("div#product-availability-preOrderPopover")
								.css({
									left:
										f("div#product-availability").position()
											.left + 10,
									top:
										f("div#product-availability").position()
											.top + 6
								})
								.show();
						}, 100);
					});

				//- popup
				f(".product-close")
					.off("click")
					.on("click", function(evt) {
						$(this)
							.parent()
							.hide();
					});

				/*
                 **    Add to registry
                 */

				f("div#product-actions a.product-addToRegistry").hasClass(
					"product-disabled"
				)
					? f("div#product-actions a.product-addToRegistry").unbind(
							"click"
						)
					: f("div#product-actions a.product-addToRegistry")
							.off("click")
							.on("click", function(evt) {
								if (
									!$(this).hasClass("product-loggedInUser") ||
									$(this).hasClass("product-noRegistryList")
								)
									return true;

								evt.preventDefault();

								var addToRegistryProductId = $(this).attr(
										"data-productId"
									),
									addToRegistryQuantityId = $(this).attr(
										"data-qtyId"
									),
									addToRegistryGiftRegistryId = $(this).attr(
										"data-giftRegistryId"
									),
									addToRegistrySizeSelectionId = $(this).attr(
										"data-sizeSelectionId"
									),
									addToRegistryColorSelectionId = $(
										this
									).attr("data-colorSelectionId"),
									addToRegistryType = $(this).attr(
										"data-type"
									),
									giftRegistryType = $(this).attr(
										"data-giftRegistryType"
									),
									addToRegistrySkuId = $(this).attr(
										"data-skuId"
									);

								// DTM
								var ddPersistedListAddEvent = {
									eventInfo: {
										eventName: "persistedListAddition",
										type: "persisted list",
										location: "product detail",
										registryID: addToRegistryGiftRegistryId,
										target: addToRegistryType,
										timeStamp: new Date(),
										processed: {
											adobeAnalytics: false
										}
									},
									product: [
										{
											productInfo: {
												productID: addToRegistryProductId,
												sku: addToRegistrySkuId
											},
											category: {
												productType: "",
												size: addToRegistrySizeSelectionId,
												color: addToRegistryColorSelectionId
											},
											quantity: addToRegistryQuantityId
										}
									]
								};

								//Push it onto the event array on digitalData object
								window.digitalData = window.digitalData || {};
								window.digitalData.event =
									window.digitalData.event || [];
								window.digitalData.event.push(
									ddPersistedListAddEvent
								);

								//Create and dispatch an event trigger (using predefined sendCustomEvent function)
								sendCustomEvent("persistedListAddition");

								//- Google Analytics Tracking
								var e = _gatrackr.addtoregistry;
								pdpTracker(
									e[0],
									e[1],
									e[2] + addToRegistrySkuId
								);

								if (
									giftRegistryType == "addToRegistrySingleGR"
								) {
									var ajax = addToRegistryStoreSingleGR(
										addToRegistryProductId,
										addToRegistrySkuId,
										addToRegistryQuantityId,
										addToRegistryGiftRegistryId,
										addToRegistrySizeSelectionId,
										addToRegistryColorSelectionId,
										addToRegistryType,
										{
											finalUrl: getAddPrimaryStoreProductUrlStoreProduct(
												addToRegistryProductId,
												addToRegistrySizeSelectionId,
												addToRegistryColorSelectionId
											),
											elementId: "product-options"
										}
									);
								} else {
									var ajax = addToRegistryStoreMultiGR(
										addToRegistryProductId,
										addToRegistrySkuId,
										addToRegistryQuantityId,
										addToRegistrySizeSelectionId,
										addToRegistryColorSelectionId,
										addToRegistryType
									);
								}

								try {
									ajax.done(function(e) {
										bindEventsCart();
									});
								} catch (err) {}
							});

				//- Add to cart

				/* pre-order old js - for ref.
                onclick="addToCartStore('${productId}','${selectedSKU}','${selectedSKU}QtyId','','${sizeSelectionId}','${colorSelectionId}','${type}');"

                notify-me old js - for ref.
                javascript:loadPageFullPathNotifyMe(contextPath + '/global/_PDP2014_inventoryNotifyMe.jsp',{isFromEditLink:'true',catalogRefId:'${skuId}',productId:'${productId}',url:'${pageContext.request.requestURI}', callback: function() {pdpNotifyMeEvents();}});

                */

				f("div#product-actions a.product-addToCart").hasClass(
					"product-disabled"
				)
					? f("div#product-actions a.product-addToRegistry").unbind(
							"click"
						)
					: f("div#product-actions a.product-addToCart")
							.off("click")
							.on("click", function(evt) {
								evt.preventDefault();

								var addToCartProductId = $(this).attr(
										"data-productId"
									),
									addToCartQuantityId = $(this).attr(
										"data-qtyId"
									),
									addToCartGiftRegistryId = $(this).attr(
										"data-giftRegistryId"
									),
									addToCartSizeSelectionId = $(this).attr(
										"data-sizeSelectionId"
									),
									addToCartColorSelectionId = $(this).attr(
										"data-colorSelectionId"
									),
									addToCartType = $(this).attr("data-type"),
									addToCartSkuId = $(this).attr("data-skuId");

								//- Google Analytics Tracking
								var e = _gatrackr.addtocart;
								pdpTracker(e[0], e[1], e[2] + addToCartSkuId);

								// DTM
								var ddPersistedListAddEvent = {
									eventInfo: {
										eventName: "persistedListAddition",
										type: "persisted list",
										location: "product detail",
										registryID: addToCartGiftRegistryId,
										target: addToCartType,
										timeStamp: new Date(),
										processed: {
											adobeAnalytics: false
										}
									},
									product: [
										{
											productInfo: {
												productID: addToCartProductId,
												sku: addToCartSkuId
											},
											category: {
												productType: "",
												size: addToCartSizeSelectionId,
												color: addToCartSizeSelectionId
											},
											quantity: addToCartQuantityId
										}
									]
								};

								//Push it onto the event array on digitalData object
								window.digitalData = window.digitalData || {};
								window.digitalData.event =
									window.digitalData.event || [];
								window.digitalData.event.push(
									ddPersistedListAddEvent
								);

								//Create and dispatch an event trigger (using predefined sendCustomEvent function)
								sendCustomEvent("persistedListAddition");

								var finalUrl = getAddPrimaryStoreProductUrlStoreProduct(
									addToCartProductId,
									addToCartSizeSelectionId,
									addToCartColorSelectionId
								);

								var data = {};
								if (
									$(evt.target).hasClass(
										"product-onlineClass"
									)
								) {
									finalUrl = finalUrl.replace(
										"_PDP2014_productDetailInfo_noColorSize",
										"_PDP_OnlineClassDetailInfo"
									);

									data.onlineClass = true;
									data.commerceType = "culinaryCommerceItem";
								}

								var ajax = addToCartStore(
									addToCartProductId,
									addToCartSkuId,
									addToCartQuantityId,
									addToCartGiftRegistryId,
									addToCartSizeSelectionId,
									addToCartColorSelectionId,
									addToCartType,
									{
										finalUrl: finalUrl,
										elementId: "product-options",
										extraData: data
									}
								);

								try {
									ajax.done(function(e) {
										bindEventsCart();
									});
								} catch (err) {}
							});

				f("a.product-notifyMe")
					.off("click")
					.on("click", function(evt) {
						evt.preventDefault();
						//-
						var url = "/global/_PDP2014_inventoryNotifyMe.jsp";
						$.get(
							url,
							{
								isFromEditLink: "true",
								catalogRefId: $(this).attr("data-skuId"),
								productId: $(this).attr("data-productId"),
								url: document.location.href
							},
							function(data) {
								$("#notifyMe_div")
									.html($(data).show())
									.notifyme();
							}
						);
					});
			}

			function bindToolTips() {
				//assign titles if the title is blank
				$('.product-disabled, [data-productdisabled="true"]').each(
					function(i) {
						if ($(this).attr("title")) {
							return;
						}
						var title = buildTitle(this);
						$(this).attr("title", title);
					}
				);

				//add tooltips to disabled "add to cart", etc buttons
				var zt = new $.Zebra_Tooltips(
					$('.product-disabled, [data-zebratip="true"]'),
					{
						background_color: "#fff",
						color: "#000",
						opacity: 1
					}
				);

				//bind tap to show hover
				$('.product-disabled, [data-zebratip="true"]').on(
					"touchstart",
					function(e, t) {
						var el = this;
						zt.show($(el), false);

						setTimeout(function() {
							zt.hide($(el));
						}, 1000);
					}
				);
			}

			function buildTitle(btn) {
				//build title message based off of data set in _PDP2014_pdpButtons.jsp
				var sizeId = $(btn).attr("data-sizeSelectionId");
				var colorId = $(btn).attr("data-colorSelectionId");

				if (sizeId == "" || colorId == "") {
					return "";
				}

				var selectColor = "Please choose a color. ";
				var selectSize = "Please choose a size. &nbsp;";
				var selectBoth = "Please choose a size/color. &nbsp;";

				if (sizeId == "notHasThisSizeId" && colorId != undefined) {
					return selectColor;
				}
				if (sizeId != undefined && colorId == "notHasThisColorId") {
					return selectSize;
				}
				if (sizeId != undefined && colorId != undefined) {
					return selectBoth;
				}
			}

			function getAddPrimaryStoreProductUrlStoreProduct(
				productId,
				sizeSelectionId,
				colorSelectionId
			) {
				var selectedColor = f(
						".product-optionsColor-select > a.activeSelection"
					).attr("data-color"),
					selectedSize = f(
						".product-optionsSize-select > a.activeSelection"
					).attr("data-size"),
					basePath = "/templates/catalog/product/_PDP2014_",
					colorSizeUrl =
						contextPath + basePath + "productDetailInfo.jsp?",
					sizeOnlyUrl =
						contextPath +
						basePath +
						"productDetailInfo_sizeOnly.jsp?",
					colorOnlyUrl =
						contextPath +
						basePath +
						"productDetailInfo_colorOnly.jsp?",
					noAnyUrl =
						contextPath +
						basePath +
						"productDetailInfo_noColorSize.jsp?",
					finalUrl;

				if (!base.fn.und(selectedSize) && !base.fn.und(selectedColor)) {
					finalUrl =
						colorSizeUrl +
						"optionColor=" +
						selectedColor +
						"&optionSize=" +
						selectedSize +
						"&productId=" +
						productId +
						"&isInit=false";
				} else if (
					!base.fn.und(selectedSize) &&
					base.fn.und(selectedColor)
				) {
					finalUrl =
						sizeOnlyUrl +
						"optionSize=" +
						selectedSize +
						"&productId=" +
						productId +
						"&isInit=false";
				} else if (
					base.fn.und(selectedSize) &&
					!base.fn.und(selectedColor)
				) {
					finalUrl =
						colorOnlyUrl +
						"optionColor=" +
						selectedColor +
						"&productId=" +
						productId +
						"&isInit=false";
				} else {
					finalUrl =
						noAnyUrl + "productId=" + productId + "&isInit=false";
				}
				return finalUrl;
			}

			function parseColorName(colorName) {
				return colorName
					.toLowerCase()
					.replace(/ /g, "")
					.replace(/\//, "");
			}

			function chooseOption() {
				var $selectedColor = f(
						".product-optionsColor-select a.activeSelection"
					),
					$selectedSize = f(
						".product-optionsSize-select a.activeSelection"
					);

				var size = $selectedSize.attr("data-size");
				var color = $selectedColor.attr("data-color");
				var skuId =
					$selectedColor.attr("data-sku") ||
					$selectedSize.attr("data-sku");
				var jsp = f('input[name="chooseOptionGetFile"]').val();

				//PDP and QV SKU Selection Event Example
				//create object with eventInfo and product object
				var ddSkuSelectionEvent = {
					eventInfo: {
						eventName: "skuSelection",
						type: "product interaction",
						timeStamp: new Date(),
						processed: {
							adobeAnalytics: false //dtm will change this to true once processed
						}
					},
					product: [
						{
							productInfo: {
								productID: productId,
								sku: skuId
							},
							category: {
								productType: ""
							}
						}
					]
				};

				//Push it onto the event array onto the digitalData object
				window.digitalData = window.digitalData || {};
				window.digitalData.event = window.digitalData.event || [];
				window.digitalData.event.push(ddSkuSelectionEvent);

				//Update the base page digitalData.product object - food
				//window.digitalData.product = ddSkuSelectionEvent.product;

				$.ajax({
					url:
						contextPath +
						"/templates/catalog/product/" +
						jsp +
						".jsp",
					data: {
						optionColor: color,
						optionSize: size,
						productId: productId,
						isInit: false
					},
					success: function(data) {
						f("#product-options")
							.html(data)
							.find("#product-optionsQuantity-select input")
							.val(quantity);

						//- Google Analytics Tracking
						var e = _gatrackr.availability;
						pdpTracker(
							e[0],
							e[1],
							e[2] +
								f(
									"#product-availability .product-availability"
								).text() +
								" " +
								f("#product-sku span").text()
						);

						bindEventsCart();
						DisableWishlistToolAttribute(data.productId, "false");
						bindToolTips();
						//Create and dispatch an event trigger (using predefined sendCustomEvent function)
						sendCustomEvent("skuSelection");
					},
					error: function(data) {
						console.log(["error", data]);
					}
				});
			}

			function updateSku(skuId) {
				$sku.find("span:eq(1)").text(skuId);
				showSku();
			}

			function showSku() {
				$sku
					.find("span:eq(1)")
					.text()
					.trim() == "" || $sku.find("span").show(333);
			}

			function DisableWishlistToolAttribute(skuId, isDisabled) {
				var wlbtn = f(".wishlist a:first-child");

				if (wlbtn.attr("data-isTransientUser") == "false") {
					wlbtn.attr("data-productdisabled", isDisabled);
					wlbtn.removeAttr("data-zebratip");
				}
			}

			function displayErrorMessage(id, message, display) {
				var msg = $(id).siblings(".spanrequiredred.error-msg");
				msg.html(message);
				if (display) {
					msg.css("display", "block");
				} else {
					msg.css("display", "none");
				}
			}

			function clearErrorMessages() {
				displayErrorMessage("#onlineClassGiftForm #name", "", false);
				displayErrorMessage("#onlineClassGiftForm #last", "", false);
				displayErrorMessage(
					"#onlineClassGiftForm #emailaddress",
					"",
					false
				);
			}

			//-
			return self.initialize();
		};
	} catch (e) {}
})(jQuery);
