/**
 * author: thomas
 * date: 2010-7-23
 */

/**********************************store product begin*******************************************/

function addPaddingToForty(input) {
	var numberSpaces = 40 - input.length;
	var paddedString = "";

	for (var i = 0; i < numberSpaces; i++) {
		paddedString += " ";
	}

	return paddedString;
}

function addToCartStoreAjaxFormSubmit(
	elementId,
	$form,
	productId,
	skuId,
	quantity,
	type
) {
	var options = {
		success: function(data) {
			//console.log(['addToCartStoreAjaxFormSubmit', data]);

			$("#" + elementId).html(data);

			postAddToCartStore(productId, skuId, quantity, type);
		}
	};
	return $form.ajaxSubmit(options);
}

$(window).on("addedToCart", function(e, obj) {
	//console.log('addedToCart');
	//console.log(obj);
	var productId = obj.productId;
	var skuId = obj.skuId;
	var quantity = obj.quantity;
	var type = obj.type;

	// DTM
	var ddPersistedListAddEvent = {
		eventInfo: {
			eventName: "persistedListAddition",
			type: "persisted list",
			location: "cart",
			registryID: "",
			target: "cart",
			timeStamp: new Date(),
			processed: {
				adobeAnalytics: false
			}
		},
		product: [
			{
				productInfo: {
					productID: productId,
					sku: skuId
				},
				category: {
					productType: "",
					size: "",
					color: ""
				},
				quantity: quantity
			}
		]
	};

	//Push it onto the event array on digitalData object
	window.digitalData = window.digitalData || {};
	window.digitalData.event = window.digitalData.event || [];
	window.digitalData.event.push(ddPersistedListAddEvent);

	//Create and dispatch an event trigger (using predefined sendCustomEvent function)
	sendCustomEvent("persistedListAddition");

	if (productId.length == 0) {
		window.location.href = "/cart/shoppingCart.jsp";
		return;
	}

	$.ajax({
		type: "POST",
		url: "/rest/bean/slt/rest/pricing/PricingActorPublic/getPricesForSKU",
		data: { skuIdList: skuId },
		success: function(data) {
			//console.log('skuprice success');
			//console.log(data);

			var response = JSON.parse(data.atgResponse)[skuId];
			var price = response.ListPrice;

			if (response.SalePrice > 0) {
				price = response.SalePrice;
			}

			dataLayer.push({
				event: "addToCart",
				ecommerce: {
					add: {
						products: [
							{
								id: productId,
								price: price,
								quantity: quantity,
								variant: skuId,
								metric1: +(price * quantity).toFixed(2)
							}
						]
					}
				},
				eventCallback: function() {
					//console.log('event success');
					window.location.href = "/cart/shoppingCart.jsp";
				},
				eventTimeout: 2000
			});
		},
		error: function(data) {
			//console.log("sku price error");
			//console.log(data);
			window.location.href = "/cart/shoppingCart.jsp";
		}
	});
});

/**
 * if add to cart sucessful popup mini cart
 * @return
 */
function postAddToCartStore(productId, skuId, quantity, type) {
	var errorCountId = skuId + "AddToCartFormErrorCount";
	var errorCount = $("#" + errorCountId).val();
	var r = new Date().getTime(); //Math.floor((Math.random() * 10000000) + 1);
	if (errorCount == 0) {
		// clear form fields
		var $form = $("#addItemToCartForm");
		//window.location.reload(false);

		restoreButtonStatus(productId, skuId, quantity, "0");
		$("#topHeaderItemCount").load(
			contextPath + "/includes/headerCartItemsForAjax.jsp?" + r,
			function() {
				if (type == "3") {
					$("#productquickview").jqmHide();
				}
				$(window).trigger("addedToCart", {
					productId: productId,
					skuId: skuId,
					quantity: quantity,
					type: type
				});
				/*$("#cartpopup").load(contextPath + "/cart/miniCart.jsp?" + r, function() {
					$(".cartpopuptrigger").trigger('click');
				});*/
			}
		);
		$("#beginCheckoutFormDiv").load(
			contextPath + "/cart/include/beginCheckoutForm.jsp?" + r
		);
		$("#beginCheckoutFormDivPPExpress").load(
			contextPath + "/cart/include/beginCheckoutFormPPExpress.jsp?" + r
		);
		$("#beginCheckoutFormDivPPExpressEasy").load(
			contextPath +
				"/cart/include/beginCheckoutFormPPExpressEasy.jsp?" +
				r
		);
	} else {
		clearRecorders(productId);
	}
}
/**
 * giftRegistryId:
 *   -if it not add from gift registry,giftRegistryId is empty
 * sizeSelectionId:
 *   -no matter there are size dropdown selection,this id can not be empty
 *    for we need it when the type is 2
 * colorSelectionId:
 *   - the same as sizeSelectionId
 * type:
 *   -1: add from pdp primary product
 *   -2: add from pdp relevancy product
 *   -3: add from qickview product
 **/
function addToCartStore(
	productId,
	skuId,
	qtyId,
	giftRegistryId,
	sizeSelectionId,
	colorSelectionId,
	type,
	extraParams
) {
	var selectResult = promptUserToChoose(
		productId,
		sizeSelectionId,
		colorSelectionId
	);
	if (selectResult == 1) {
		return;
	}
	//add scOpen & scAdd omniture event here
	try {
		OmnitureCenter.addShoppingCartEventType(productId, skuId, type);
	} catch (e) {
		//alert(e);
	}

	//*******************************
	var $form = $("#addItemToCartForm");
	var quantity = $("#" + qtyId).val();
	$form.find(".commerceItemTypeToSubmit").val("storeCommerceItem");
	$form.find(".productToSubmit").val(productId);
	$form.find(".skuToSubmit").val(skuId);
	$form.find(".qtyToSubmit").val(quantity);
	$form.find(".giftlistIdToSubmit").val(giftRegistryId);
	$form.find(".addCulinaryToOrder").attr("disabled", "true");
	var finalUrl;
	var elementId;
	switch (type) {
		case "1":
			finalUrl = getAddPrimaryStoreProductUrl(
				productId,
				sizeSelectionId,
				colorSelectionId
			);
			elementId = "productdetailinfo";
			break;
		case "2":
			finalUrl = getAddRelevancyStoreProductUrl(
				productId,
				sizeSelectionId,
				colorSelectionId
			);
			var idSplit = sizeSelectionId.split("_");
			elementId = idSplit[1] + "Product" + idSplit[2];
			break;
		case "3":
			finalUrl = getAddQuickViewStoreProductUrl(
				productId,
				sizeSelectionId,
				colorSelectionId
			);
			elementId = "detailInfo";
			break;
		default:
			break;
	}

	var u = function(s) {
		return typeof s == "undefined";
	};

	if (!u(extraParams)) {
		elementId = u(extraParams.elementId)
			? elementId
			: extraParams.elementId;
		finalUrl = u(extraParams.finalUrl) ? finalUrl : extraParams.finalUrl;

		if (
			!u(extraParams.extraData) &&
			!u(extraParams.extraData.onlineClass) &&
			extraParams.extraData.onlineClass
		) {
			$form
				.find(".isOnlineCookingClassToSubmit")
				.val(extraParams.extraData.onlineClass);
			//$form.find(".isGiftToSubmit").val(extraParams.extraData.isGift);
			//$form.find(".recipientFirstNameToSubmit").val(extraParams.extraData.firstName);
			//$form.find(".recipientLastNameToSubmit").val(extraParams.extraData.lastName);
			//$form.find(".emailToSubmit").val(extraParams.extraData.emailAddress);
			//$form.find(".messageToSubmit").val(extraParams.extraData.giftMessage);
			$form
				.find(".commerceItemTypeToSubmit")
				.val(extraParams.extraData.commerceType);
		}
	}

	$form.attr("action", finalUrl);
	$form.find(".addItemToOrderSuccessURL").val(finalUrl);
	$form.find(".addItemToOrderErrorURL").val(finalUrl);
	$form.find(".addItemToOrder").removeAttr("disabled");
	$form.find(".addCulinaryToOrder").attr("disabled", "true");

	return addToCartStoreAjaxFormSubmit(
		elementId,
		$form,
		productId,
		skuId,
		quantity,
		type
	);
}

function doPDPprefix(url) {
	var a = url.parseURI();

	return a.directory + "_PDP2014_" + a.file + "?" + a.query;
}

/**********************************store product end*******************************************/

/**********************************begin checkout *********************************************/
function beginCheckoutTag() {
	try {
		OmnitureCenter.sccheckOutEvent();
	} catch (e) {
		//alert(e);
	}
	$("#beginCheckoutForm").submit();
}

/**********************************gr add to cart start*******************************************/

function addToCartStoreForGR(
	productId,
	skuId,
	qtyId,
	giftRegistryId,
	giftItemId,
	index
) {
	var $form = $("#addItemToCartForm");
	var quantity = $("#" + qtyId).val();
	$form.find(".commerceItemTypeToSubmit").val("storeCommerceItem");
	$form.find(".productToSubmit").val(productId);
	$form.find(".skuToSubmit").val(skuId);
	$form.find(".qtyToSubmit").val(quantity);
	$form.find(".giftRegistryIdToSubmit").val(giftRegistryId);
	$form.find(".addCulinaryToOrder").attr("disabled", "true");
	$("#form_index").remove();
	$form.append(
		"<input type='hidden' id='form_index' name='index' value='" +
			index +
			"'>"
	);
	$("#form_giftItemId").remove();
	$form.append(
		"<input type='hidden' id='form_giftItemId' name='giftItemId' value='" +
			giftItemId +
			"'>"
	);
	$("#form_id").remove();
	$form.append(
		"<input type='hidden' id='form_id' name='id' value='" +
			giftRegistryId +
			"'>"
	);

	var finalUrl = "/registry/include/giftRegistryListItemDetail.jsp";
	$form.attr("action", finalUrl);
	var elementId = "giftitem_" + giftItemId;
	//$form.find(".addItemToOrderSuccessURL").val(finalUrl);
	//$form.find(".addItemToOrderErrorURL").val(finalUrl);
	return addToCartStoreAjaxFormSubmit(
		elementId,
		$form,
		productId,
		skuId,
		quantity,
		"1"
	);
	//restoreButtonStatus
	var errorCountId = skuId + "AddToCartFormErrorCount";
	var errorCount = $("#" + errorCountId).val();
	if (errorCount == 0) {
	}
}

function moveToCartStoreForGR(
	productId,
	skuId,
	qtyId,
	giftRegistryId,
	giftItemId,
	index
) {
	var $form = $("#addItemToCartForm");
	var quantity = $("#" + qtyId).val();
	$form.find(".commerceItemTypeToSubmit").val("storeCommerceItem");
	$form.find(".productToSubmit").val(productId);
	$form.find(".skuToSubmit").val(skuId);
	$form.find(".qtyToSubmit").val(quantity);
	$form.find(".giftRegistryIdToSubmit").val(giftRegistryId);
	$form.find(".addCulinaryToOrder").attr("disabled", "true");
	var url =
		contextPath + "/registry/include/giftRegistryTrackerItemDetail.jsp?";
	var params =
		"index=" +
		index +
		"&giftItemId=" +
		giftItemId +
		"&id=" +
		giftRegistryId;
	var finalUrl = url + params;
	var elementId = "giftitem_" + giftItemId;
	$form.find(".addItemToOrderSuccessURL").val(finalUrl);
	$form.find(".addItemToOrderErrorURL").val(finalUrl);
	return addToCartStoreAjaxFormSubmit(
		elementId,
		$form,
		productId,
		skuId,
		quantity,
		"1"
	);
}

/**********************************gr add to cart end*******************************************/

/**********************************culinary product begin***************************************/

function addToCartCulinary(
	productId,
	skuId,
	qtyId,
	giftRegistryId,
	errorURLId
) {
	var commerceItemType = "culinaryCommerceItem";
	var url =
		$("#addToCartLinkTo").val() +
		"?productId=" +
		productId +
		"&skuId=" +
		skuId +
		"&quantity=" +
		$("#" + qtyId).val();
	var $form = $("#addItemToCartForm");
	$form.attr("action", url);
	$form.find(".addItemToOrderSuccessURL").val(url);
	$form.find(".addItemToOrderErrorURL").val($("#" + errorURLId).val());
	$form.find(".commerceItemTypeToSubmit").val(commerceItemType);
	$form.find(".productToSubmit").val(productId);
	$form.find(".skuToSubmit").val(skuId);
	$form.find(".qtyToSubmit").val($("#" + qtyId).val());
	$form.find(".giftRegistryIdToSubmit").val(giftRegistryId);
	$form.find(".addItemToOrder").attr("disabled", "true");
	$form.find(".addCulinaryToOrder").removeAttr("disabled");
	$form.submit();
}
/**********************************culinary product end*******************************************/

/**********************************giftcard product begin******************************************/

function addToCartGiftcardAjaxFormSubmit(
	elementId,
	$form,
	productId,
	skuId,
	quantity,
	type
) {
	var options = {
		success: function(data) {
			$("#" + elementId).html(data);
			postAddToCartGiftcard(productId, skuId, quantity, type);
		}
	};
	return $form.ajaxSubmit(options);
}
function clearGiftCard() {
	// clear data entries
	$("fieldset#giftCardsType .giftCardsTypeWrap")
		.siblings()
		.removeClass("giftCardType-selected");
	// hide form below amount field
	$("form#giftCardsForm fieldset:not(#giftCardsType)").hide();
	$("#giftCardsForm  [id^=giftCardsPersonalize]").val("");
	$("#giftCardsForm #giftCardsAmountSelect-custom").val("");
	// Ensure that the form gets revalidated with blank amount
	$(
		"fieldset#giftCardsAmount div#giftCardsAmountCustom input#giftCardsAmountSelect-custom"
	).change();
	$("#giftCardsForm #giftCardsDesignQuantityInput").val(1);

	$("#giftCardsForm label").removeClass("giftCardAmount-selected");
	$("#giftCardsForm").removeClass("giftCardDesignSelected");
	$("#giftCardsForm dropdown").val(
		$("#giftCardsForm dropdown option:first").val()
	);
	$("#giftCardsForm #giftCardsDate-sendNow").prop("checked", true);
	$("#giftCardsForm #giftCardDatepicker").val("");

	// clear hidden form
	$("#addItemToCartForm  .productToSubmit").val("");
	$("#addItemToCartForm  .skuToSubmit").val("");
	$("#addItemToCartForm  .qtyToSubmit").val("");
	$("#addItemToCartForm  .cardValToSubmit").val("");
	$("#addItemToCartForm  .emailToSubmit").val("");
	$("#addItemToCartForm  .recipientNameToSubmit").val("");
	$("#addItemToCartForm  .giverNameToSubmit").val("");
	$("#addItemToCartForm  .giverMessageToSubmit").val("");
	$("#addItemToCartForm  .futureSendDateToSubmit").val("");
	$("#addItemToCartForm  .isElectricTypeToSubmit").val("");

	// clear review box
	$("#giftCardsReview").css("visibility", "hidden");
	$("fieldset#giftCardsReview span#giftCardsReview-amount").text("");
	$("fieldset#giftCardsReview p#giftCardsReview-design span").text("");
	// $("fieldset#giftCardsReview p#giftCardsReview-design span").next("img").remove();
	$("p#giftCardsReview-message").hide();
	$("p#giftCardsReview-message [id^=giftCardsReview-messageLine]").text("");
	$("[id^=giftCardsReview-previewMessageLine]").text("");
	$("#giftCardsReview-previewAmount").text("");
	$("span#giftCardsReview-previewRecipent").text("");
	$("p#giftCardsReview-recipient span#giftCardsReview-recipientName")
		.text("")
		.hide();
	$("p#giftCardsReview-recipient span#giftCardsReview-recipientEmail")
		.text("")
		.hide();
	$("p#giftCardsReview-recipient span#giftCardsReview-recipientDate")
		.text("")
		.hide();
}
function postAddToCartGiftcard(productId, skuId, quantity) {
	var errorCountId = skuId + "AddToCartFormErrorCount";
	var errorCount = $("#" + errorCountId).val();
	if (true || errorCount == 0) {
		restoreButtonStatus(productId, skuId, quantity, "0");
		$("#topHeaderItemCount").load(
			contextPath + "/includes/headerCartItemsForAjax.jsp",
			function() {
				$("#tellApart").load(
					"/tellApartTag.jsp?actionType=updateCart&targetPage=Partial&rnd=" +
						random_string(),
					function() {
						$(window).trigger("addedToCart", {
							productId: productId,
							skuId: skuId,
							quantity: quantity
						});
						/*
				$("#cartpopup").load(contextPath+"/cart/miniCart.jsp", function() {
					$(".cartpopuptrigger").trigger('click');
				});
				*/
					}
				);
			}
		);
		// clear out the Gift Card data entry form, saving the default values
		clearGiftCard();
		$("#beginCheckoutFormDiv").load(
			contextPath + "/cart/include/beginCheckoutForm.jsp"
		);
		$("#beginCheckoutFormDivPPExpress").load(
			contextPath + "/cart/include/beginCheckoutFormPPExpress.jsp"
		);
		$("#beginCheckoutFormDivPPExpressEasy").load(
			contextPath + "/cart/include/beginCheckoutFormPPExpressEasy.jsp"
		);
	} else {
		window.scrollTo(0, 0);
		clearRecorders(productId);
	}
}

//giftcard sku
function addToCartGiftCard(
	productId,
	skuId,
	qtyId,
	giftRegistryId,
	cardValId,
	recipientNameId,
	giverNameId,
	giverMessageId,
	emailId,
	futureSendDateId,
	isElectricTypeId,
	type
) {
	if (typeof $("#emailId2") != "undefined") {
		if ($("#emailId").val() != $("#emailId2").val()) {
			$("#emailId2Error").show();
			$("#emailId2").focus();
			return false;
		}
	}

	var messageStr = "";
	for (var index = 0; index < 4; index++) {
		var indexedValue = $("#giftmessage .textarea:eq(" + index + ")").val();

		messageStr +=
			!indexedValue || 0 === indexedValue.length
				? " "
				: $("#giftmessage .textarea:eq(" + index + ")").val() +
					addPaddingToForty(
						$("#giftmessage .textarea:eq(" + index + ")").val()
					);
	}

	$("#" + giverMessageId).val(messageStr);

	var commerceItemType = "giftCardCommerceItem";
	var $form = $("#addItemToCartForm");
	var quantity = $("#" + qtyId).val();
	$form.find(".commerceItemTypeToSubmit").val(commerceItemType);
	$form.find(".productToSubmit").val(productId);
	$form.find(".skuToSubmit").val(skuId);
	$form.find(".qtyToSubmit").val(quantity);
	$form.find(".giftlistIdToSubmit").val(giftRegistryId);
	$form.find(".cardValToSubmit").val($("#" + cardValId).val());
	$form.find(".emailToSubmit").val($("#" + emailId).val());
	$form.find(".recipientNameToSubmit").val($("#" + recipientNameId).val());
	$form.find(".giverNameToSubmit").val($("#" + giverNameId).val());
	$form.find(".giverMessageToSubmit").val($("#" + giverMessageId).val());
	$form.find(".futureSendDateToSubmit").val($("#" + futureSendDateId).val());
	$form.find(".isElectricTypeToSubmit").val($("#" + isElectricTypeId).val());
	var grid = $("#grIdPDP").val(); //if the grIdPDP is not null means add the GC for GR
	var length = $.trim(grid).length;
	if (length > 0) {
		$form.find(".giftRegistryIdToSubmit").val(grid);
	}
	$form.find(".addCulinaryToOrder").attr("disabled", "true");
	var finalUrl;
	switch (type) {
		//Traditional
		case "1":
			finalUrl = getAddTraditionalGiftcardsProductUrl(productId, skuId);
			break;
		//Virtual
		case "2":
			finalUrl = getAddVirtualGiftcardsProductUrl(productId, skuId);
			break;
		default:
			break;
	}
	if (giftRegistryId != "") {
		finalUrl = finalUrl + "&grId=" + giftRegistryId + "&gcSkuId=" + skuId;
	}
	$form.find(".addItemToOrderSuccessURL").val(finalUrl);
	$form.find(".addItemToOrderErrorURL").val(finalUrl);
	return addToCartGiftcardAjaxFormSubmit(
		"giftcarddetail",
		$form,
		productId,
		skuId,
		quantity
	);
}

// new gift card landing page Add to Cart
function addToCartGiftCard2(giftRegistryId) {
	var deactivate = $("#giftCardsSubmit a.addToCart.deactivateSubmitButton");
	if (deactivate.length > 0) {
		return false;
	}
	var messageStr = "";
	var quantity = "";
	if (
		typeof $("#egiftCardsPersonalize-recipientEmailConfirm") != "undefined"
	) {
		if (
			$("#giftCardsPersonalize-recipientEmail").val() !=
			$("#giftCardsPersonalize-recipientEmailConfirm").val()
		) {
			$('#"giftCardsPersonalize-emailConfirmError').show();
			$("#giftCardsPersonalize-recipientEmailConfirm").focus();
			return false;
		}
	}
	/*
	for (var index = 0; index < 4; index++) {
		var indexedValue = $('#giftmessage .textarea:eq(' + index + ')').val();
		messageStr += (!indexedValue || 0 === indexedValue.length) ? " " : ($('#giftmessage .textarea:eq(' + index + ')').val() + addPaddingToForty($('#giftmessage .textarea:eq(' + index + ')').val()));
	}
	*/
	for (var index = 1; index < 5; index++) {
		var indexedValue = $("#giftCardsPersonalize-messageLine" + index).val();
		messageStr +=
			!indexedValue || 0 === indexedValue.length
				? " "
				: $("#giftCardsPersonalize-messageLine" + index).val() +
					addPaddingToForty(
						$("#giftCardsPersonalize-messageLine" + index).val()
					);
	}
	var skuId = $(
		"#giftCardsDesignSelectCarousel-designs img.giftCardDesignSelected"
	)
		.data("skuid")
		.toString();
	var productId = $(
		"#giftCardsDesignSelectCarousel-designs img.giftCardDesignSelected"
	).data("productid");
	if (!productId || !skuId) {
		return false;
	}
	var commerceItemType = "giftCardCommerceItem";
	var $form = $("#addItemToCartForm");
	var virtualGC = $("#giftCardsTypeSelect-eGift").prop("checked");
	var sendDate = "";
	if (virtualGC == true) {
		var quantity = 1;
		type = "2";
		if ($("#giftCardsDate-sendLater:checked").length > 0) {
			sendDate = $("#giftCardDatepicker").val();
			if (sendDate == "") {
				$("#giftCardDatepicker-error").text("Please enter a date.");
				$("#giftCardDatepicker-error").show();
				$("#giftCardDatepicker").focus();
				return false;
			}
			//var selectedDate = $("#giftCardDatepicker").datepicker("getDate");
			// Check for date format
			var dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
			if (!dateRegex.test($("#giftCardDatepicker").val())) {
				// Failed format validation
				$("span#giftCardDatepicker-error").text(
					"Please correct the date's format."
				);
				$("#giftCardDatepicker").focus();
				return false;
			}
		} else {
			sendDate = $("#currentDate").val();
		}
	} else {
		var quantity = $("#giftCardsDesignQuantityInput").val();
		type = "1";
	}
	$form.find(".giverMessageToSubmit").val(messageStr);
	$form.find(".commerceItemTypeToSubmit").val(commerceItemType);
	$form.find(".productToSubmit").val(productId);
	$form.find(".skuToSubmit").val(skuId);
	$form.find(".qtyToSubmit").val(quantity);
	$form.find(".giftlistIdToSubmit").val(giftRegistryId);
	$form
		.find(".cardValToSubmit")
		.val($("#giftCardsAmountSelect-custom").val());
	$form
		.find(".emailToSubmit")
		.val($("#giftCardsPersonalize-recipientEmail").val());
	$form
		.find(".recipientNameToSubmit")
		.val($("#giftCardsPersonalize-recipientName").val());
	//$form.find(".recipientNameToSubmit").val("RECIPIENT NAME - TESTING ONLY");
	//$form.find(".giverNameToSubmit").val($("#"+giverNameId).val()); // no longer using
	//$form.find(".giverNameToSubmit").val("GIVER NAME - TESTING ONLY");
	$form.find(".futureSendDateToSubmit").val(sendDate);
	$form.find(".isElectricTypeToSubmit").val(virtualGC);
	var grid = $("#grId").val(); //if the grIdPDP is not null means add the GC for GR
	var length = $.trim(grid).length;
	if (length > 0) {
		$form.find(".giftRegistryIdToSubmit").val(grid);
	}
	$form.find(".addCulinaryToOrder").attr("disabled", "true");
	var finalUrl =
		contextPath +
		"/browse/giftcardLanding.jsp?productId=" +
		productId +
		"&skuId=" +
		skuId;
	// TEMP FOR TESTIN ONLY
	if (giftRegistryId != "") {
		finalUrl = finalUrl + "&grId=" + giftRegistryId + "&gcSkuId=" + skuId;
	}
	var finalUrl = contextPath + "/browse/include/addCart.jsp";
	$form.find(".addItemToOrderSuccessURL").val(finalUrl);
	$form.find(".addItemToOrderErrorURL").val(finalUrl);
	return addToCartGiftcardAjaxFormSubmit(
		"giftcarddetail-ajax",
		$form,
		productId,
		skuId,
		quantity,
		type
	);
	//addToCartGiftcardAjaxFormSubmit("giftcarddetail",$form,productId,skuId,quantity,type);
}

//add by Scority
//this function is called by add GC into cart in PDP
function addToCartGiftCardForGRInPDP(
	productId,
	skuId,
	qtyId,
	giftRegistryId,
	cardValId,
	recipientNameId,
	giverNameId,
	giverMessageId,
	emailId,
	futureSendDateId,
	isElectricTypeId,
	actionURL
) {
	var commerceItemType = "giftCardCommerceItem";
	var $form = $("#" + productId + "AddItemToOrderForm");
	$form.attr("action", actionURL);
	$form.find(".commerceItemTypeToSubmit").val(commerceItemType);
	$form.find(".productToSubmit").val(productId);
	$form.find(".skuToSubmit").val(skuId);
	$form.find(".qtyToSubmit").val($("#" + qtyId).val());
	$form.find(".giftlistIdToSubmit").val(giftRegistryId);
	$form.find(".cardValToSubmit").val($("#" + cardValId).val());
	$form.find(".emailToSubmit").val($("#" + emailId).val());
	$form.find(".recipientNameToSubmit").val($("#" + recipientNameId).val());
	$form.find(".giverNameToSubmit").val($("#" + giverNameId).val());
	$form.find(".giverMessageToSubmit").val($("#" + giverMessageId).val());
	$form.find(".futureSendDateToSubmit").val($("#" + futureSendDateId).val());
	$form.find(".isElectricTypeToSubmit").val($("#" + isElectricTypeId).val());
	var grid = $("#grIdPDP").val(); //if the grIdPDP is not null means add the GC for GR
	var length = $.trim(grid).length;
	if (length > 0) {
		$form.find(".giftRegistryIdToSubmit").val(grid);
	}
	$form.find(".addItemToOrder").trigger("click");
}

//handle quantityMorph.js call
$(window).on("quantityMorphChange", function(e, el) {
	$("#shoppingCartForm #updateItemQty").trigger("click");
});
function updateItemQtyFromCart(itemId) {
	var qty = $("#" + itemId).val();
	$("#shoppingCartForm")[0].reset();
	$("#" + itemId).val(qty);
	$("#updateItemQty").trigger("click");
}
function removeItemFromCart(itemId, productID, skuID) {
	//add scOpen & scAdd omniture event here
	try {
		OmnitureCenter.removeShoppingCartEvent(productID, skuID);
	} catch (e) {
		//alert(e);
	}

	//Remove from Cart Event Example
	//create object with eventInfo and product object
	var ddPersistedListRemovalEvent = {
		eventInfo: {
			eventName: "persistedListRemoval",
			type: "persisted list",
			location: "cart", // "cart", "wishlist", "registry"
			timeStamp: new Date(),
			processed: {
				adobeAnalytics: false //dtm will change this to true once processed
			}
		},
		product: [
			{
				productInfo: {
					productID: productID,
					sku: skuID
				},
				quantity: 1
			}
		]
	};

	//Push it onto the event array on digitalData object
	window.digitalData = window.digitalData || {};
	window.digitalData.event = window.digitalData.event || [];
	window.digitalData.event.push(ddPersistedListRemovalEvent);

	//Create and dispatch an event trigger (using predefined sendCustomEvent function)
	sendCustomEvent("persistedListRemoval");

	dataLayer.push({
		event: "removeFromCart",
		ecommerce: {
			remove: {
				products: [
					{
						id: productID,
						variant: skuID
					}
				]
			}
		},
		eventCallback: function() {
			//console.log('event success');
			//*******************************
			$("#removalCommerceIds").val(itemId);
			$("#removeItem").trigger("click");
		},
		eventTimeout: 2000
	});
}

function removeItemFromCartCulinary(itemIds) {
	var ids = itemIds.split(",");
	for (i = 0; i < ids.length; i++) {
		var seq = i + 1;
		$("#removalCommerceIds_" + seq).val(ids[i]);
	}

	$("#removeItem").trigger("click");
}

function updateAttendeeFromCartCulinary(itemIds, sku, prodid, count) {
	var commerceItemType = "culinaryCommerceItem";
	$("#updateAttendeeCommerceIds").val(itemIds);
	$("#updateAttendeeproductToSubmit").val(prodid);
	$("#updateAttendeeskuToSubmit").val(sku);
	$("#updateAttendeecommerceItemTypeToSubmit").val(commerceItemType);
	$("#updateAttendeeqtyToSubmit").val(count);
	$("#culUpdateAttendee").trigger("click");
}

function updateRecipientFromCartGiftcard(
	itemId,
	sku,
	prodid,
	cardValue,
	count,
	revName,
	giverName
) {
	var commerceItemType = "giftcardCommerceItem";
	$("#updateRecipientCommerceId").val(itemId);
	$("#updateRecipientproductToSubmit").val(prodid);
	$("#updateRecipientkuToSubmit").val(sku);
	$("#updateRecipientcommerceItemTypeToSubmit").val(commerceItemType);
	$("#updateRecipientcardValueToSubmit").val(cardValue);
	$("#updateRecipientqtyToSubmit").val(count);
	$("#updateRecipientrevNameToSubmit").val(revName);
	$("#updateRecipientgiverNameToSubmit").val(giverName);
	$("#updateRecipient").trigger("click");
}

function moveItemToWishlist(commerceItemId, quantity) {
	var $form = $("#cartToWishlistForm");
	$form.find(".commerceItemId").val(commerceItemId);
	$form.find(".quantity").attr("name", commerceItemId);
	$form.find(".quantity").val(quantity);
	$form.find(".moveItemsFromCart").trigger("click");
}

function moveItemToRegistry(commerceItemId, quantity, onlyGRId) {
	var $form = $("#cartToRegistryForm");
	$form.find(".commerceItemId").val(commerceItemId);
	$form.find(".quantity").attr("name", commerceItemId);
	$form.find(".quantity").val(quantity);
	$form.find(".giftlistId").val(onlyGRId);
	$form.find(".moveItemsFromCart").trigger("click");
}
var $subForm;
function moveItemToRegistryWithOutGRMode(commerceItemId, quantity) {
	$subForm = $("#cartToRegistryForm");
	$subForm.find(".commerceItemId").val(commerceItemId);
	$subForm.find(".quantity").attr("name", commerceItemId);
	$subForm.find(".quantity").val(quantity);
	$("#giftselectregistry").jqmShow();
}

function popCartToRegistryCommit() {
	$subForm.find(".giftlistId").val($("#selectedGR").val());
	$subForm.find(".moveItemsFromCart").trigger("click");
}

function moveItemToWishlistCulinary(itemIds, quantity) {
	var $form = $("#cartToWishlistForm");
	var ids = itemIds.split(",");
	for (i = 0; i < ids.length; i++) {
		var seq = i + 1;
		$form.find(".commerceItemId_" + seq).val(ids[i]);
		$form.find(".quantity_" + seq).attr("name", ids[i]);
		$form.find(".quantity_" + seq).val("1");
	}
	$form.find(".moveItemsFromCart").trigger("click");
}

function moveItemToRegistryCulinary(itemIds, quantity, onlyGRId) {
	var $form = $("#cartToRegistryForm");
	var ids = itemIds.split(",");
	for (i = 0; i < ids.length; i++) {
		var seq = i + 1;
		$form.find(".commerceItemId_" + seq).val(ids[i]);
		$form.find(".quantity_" + seq).attr("name", ids[i]);
		$form.find(".quantity_" + seq).val("1");
	}
	$form.find(".giftlistId").val(onlyGRId);
	$form.find(".moveItemsFromCart").trigger("click");
}

function moveItemToRegistryCulinaryWithOutGRMode(itemIds, quantity) {
	$subForm = $("#cartToRegistryForm");
	var ids = itemIds.split(",");
	for (i = 0; i < ids.length; i++) {
		var seq = i + 1;
		$subForm.find(".commerceItemId_" + seq).val(ids[i]);
		$subForm.find(".quantity_" + seq).attr("name", ids[i]);
		$subForm.find(".quantity_" + seq).val("1");
	}
	$("#giftselectregistry").jqmShow();
}

function moveItemsFromWishlist(giftlistItemId) {
	$("#wishListToCartForm .giftlistItemId").val(giftlistItemId);
	var qty = $("#" + giftlistItemId).val();
	$("#wishListToCartForm .giftlistItem_qty").val(qty);
	//$("#wishListToCartForm").submit();

	var options = {
		success: function(data) {
			//postAddToCartStore(productId,skuId,quantity,type);
			$(window).trigger("addedToCart", {
				productId: "",
				skuId: "",
				quantity: "",
				type: ""
			});
		}
	};
	return $("#wishListToCartForm").ajaxSubmit(options);
}

function moveItemsFromGiftRegistry(giftRegistryId, giftlistItemId) {
	var $form = $("#giftRegistryToCartForm");
	$form.find(".giftlistId").val(giftRegistryId);
	$form.find(".giftRegistryId").val(giftRegistryId);
	$form.find(".giftlistItemId").val(giftlistItemId);
	$form.find(".moveItemsFromGiftRegistry").trigger("click");
}

function changeContinueButton(obj) {
	if (obj.value == "") {
		$("#continueButton").attr("class", "buttonalt");
		$("#continueButton").unbind("click");
	} else {
		$("#continueButton").attr("class", "button giftreg");
		$("#continueButton").click(function() {
			popCartToRegistryCommit();
		});
	}
}
function QtyNumberConstraintValidator(evt, QtyField) {
	QtyField.maxLength = 3;

	var charCode = evt.which ? evt.which : evt.keyCode;
	if (charCode == 37 || charCode == 39 || charCode == 46) {
		return true;
	}
	if (QtyField.value.length > 3 && charCode != 8) {
		return false;
	}
	if (
		(charCode >= 96 && charCode <= 105) ||
		(charCode >= 112 && charCode <= 123)
	) {
		return true;
	}
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
}

function removeNonNumeric(field) {
	var text = field.value;
	var patrn = /[^0-9]+/;
	text = text.replace(patrn, "");
	field.value = text != "" ? parseInt(text, 10) : text;
}
