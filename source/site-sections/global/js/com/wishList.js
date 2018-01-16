/**
 * author: thomas
 * date: 2010-7-24
 */

function addToWishlistAjaxFormSubmit(
	elementId,
	$form,
	productId,
	skuId,
	quantity
) {
	var options = {
		success: function(data) {
			$("#" + elementId).html(data);
			postAddToWishlist(productId, skuId, quantity);
		}
	};
	$form.ajaxSubmit(options);
}
/**
 * if add to cart sucessful popup mini cart
 * @return
 */
function postAddToWishlist(productId, skuId, quantity) {
	var errorCountId = skuId + "AddToWishlistFormErrorCount";
	var errorCount = $("#" + errorCountId).val();
	if (errorCount == 0) {
		restoreButtonStatus(productId, skuId, quantity, "2");
	} else {
		clearRecorders(productId);
	}
}

/***********************************************store product begin************************************/
function addToWishlistStore(
	productId,
	skuId,
	qtyId,
	sizeSelectionId,
	colorSelectionId,
	type
) {
	var selectResult = promptUserToChoose(
		productId,
		sizeSelectionId,
		colorSelectionId
	);
	if (selectResult == 1) {
		return;
	}

	var $form = $("#addItemToWishListForm");
	var quantity = $("#" + qtyId).val();
	$form.find(".productId").val(productId);
	$form.find(".skuId").val(skuId);
	$form.find(".quantity").val(quantity);
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

	// DTM
	var ddPersistedListAddEvent = {
		eventInfo: {
			eventName: "persistedListAddition",
			type: "persisted list",
			location: "product detail",
			registryID: "",
			target: "wishlist",
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
					size: sizeSelectionId,
					color: colorSelectionId
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

	$form.find(".addItemToGiftlistSuccessURL").val(finalUrl);
	$form.find(".addItemToGiftlistErrorURL").val(finalUrl);
	addToWishlistAjaxFormSubmit(elementId, $form, productId, skuId, quantity);
}

/***********************************************store product end************************************/

/***********************************************culinary product begin********************************/

function addToWishlistCulinary(productId, skuId, qtyId, locSelectionId, type) {
	var $form = $("#addItemToWishListForm");
	var quantity = $("#" + qtyId).val();
	$form.find(".productId").val(productId);
	$form.find(".skuId").val(skuId);
	$form.find(".quantity").val(quantity);
	var finalUrl;
	var elementId;
	switch (type) {
		case "1":
			finalUrl = getAddPrimaryCulinaryProductUrl(skuId);
			elementId = "culPrimaryDetail";
			break;
		case "2":
			finalUrl = getAddRelevancyCulinaryProductUrl(
				productId,
				locSelectionId
			);
			var idSplit = locSelectionId.split("_");
			elementId = "class" + idSplit[1];
			break;
		default:
			break;
	}
	$form.find(".addItemToGiftlistSuccessURL").val(finalUrl);
	$form.find(".addItemToGiftlistErrorURL").val(finalUrl);
	addToWishlistAjaxFormSubmit(elementId, $form, productId, skuId, quantity);
}
/***********************************************culinary product end********************************/

/***********************************************giftcard product begin********************************/

function addToWishlistGiftcardAjaxFormSubmit(
	elementId,
	$form,
	productId,
	skuId,
	quantity
) {
	var options = {
		success: function(data) {
			$("#" + elementId).html(data);
			postAddToWishlistGiftcard(productId, skuId, quantity);
		}
	};
	$form.ajaxSubmit(options);
}
/**
 * if add to cart sucessful popup mini cart
 * @return
 */
function postAddToWishlistGiftcard(productId, skuId, quantity) {
	var errorCountId = skuId + "AddToWishlistFormErrorCount";
	var errorCount = $("#" + errorCountId).val();
	if (errorCount == 0) {
		restoreButtonStatus(productId, skuId, quantity, "2");
		var url =
			contextPath + "/account/include/giftcardwishlistadded_popup.jsp";
		loadPopup(url);
	} else {
		clearRecorders(productId);
	}
}

function addToWishlistGiftcard(productId, skuId, qtyId, type) {
	var $form = $("#addItemToWishListForm");
	var quantity = $("#" + qtyId).val();
	$form.find(".productId").val(productId);
	$form.find(".skuId").val(skuId);
	$form.find(".quantity").val(quantity);
	var finalUrl;
	switch (type) {
		case "1":
			finalUrl = getAddTraditionalGiftcardsProductUrl(productId, skuId);
			break;
		case "2":
			finalUrl = getAddVirtualGiftcardsProductUrl(productId, skuId);
			break;
		default:
			break;
	}
	$form.find(".addItemToGiftlistSuccessURL").val(finalUrl);
	$form.find(".addItemToGiftlistErrorURL").val(finalUrl);
	addToWishlistGiftcardAjaxFormSubmit(
		"giftcarddetail",
		$form,
		productId,
		skuId,
		quantity
	);
}

/***********************************************giftcard product end********************************/

////Those coded following may used before. pre remove test if system is ok.
/*
function addToWishlist(productId,skuId,qtyId,actionURLId){
	var $form = $("#"+productId+"AddToWishListForm");
	$form.attr("action",$("#"+actionURLId).val());
	$form.find(".productId").val(productId);
	$form.find(".skuId").val(skuId);
	$form.find(".quantity").val($("#"+qtyId).val());
	$form.find(".addItem").click();
}

function hookAddToWishlistTask(productId,skuId,qtyId,actionURLId){
	var productId = productId;
	var skuId = skuId;
	var quantity =$("#"+qtyId).val();
	var pageURL = "/account/login.jsp?previousPage="+$("#"+actionURLId).val();
    var url = contextPath+"/global/hookAddToWishlistTask.jsp";
    var params = "?productId="+productId+"&skuId="+skuId+"&quantity="+quantity+"&pageURL="+pageURL;
    window.location.href=url+params;
}
*/

function anonymousAddToWishlistStore(
	url,
	productId,
	skuId,
	qtyId,
	sizeSelectionId,
	colorSelectionId,
	type
) {
	var params =
		"_sltwlAddToWishlist=true" +
		"&_sltwlProductId=" +
		productId +
		"&_sltwlSkuId=" +
		skuId +
		"&_sltwlQtyId=" +
		qtyId +
		"&_sltwlQuantity=" +
		$("#" + qtyId).val() +
		"&_sltwlHeight=" +
		getPageScroll();
	if (sizeSelectionId != null && sizeSelectionId != "") {
		params =
			params +
			"&_sltwlSizeSelection=" +
			sizeSelectionId +
			"&_sltwlSizeValue=" +
			$("#" + sizeSelectionId).val();
	}
	if (colorSelectionId != null && colorSelectionId != "") {
		params =
			params +
			"&_sltwlColorSelection=" +
			colorSelectionId +
			"&_sltwlColorValue=" +
			$("#" + colorSelectionId).val();
	}
	params = encodeURIComponent(params);
	window.location.href =
		contextPath +
		"/account/login.jsp?previousPage=" +
		url +
		"&params=" +
		escape(params);
}

function anonymousAddToWishlistGiftCard(
	url,
	productId,
	skuId,
	qtyId,
	skuSelectionId
) {
	var params =
		"_sltwlAddToWishlist=true" +
		"&_sltwlProductId=" +
		productId +
		"&_sltwlSkuId=" +
		skuId +
		"&_sltwlQtyId=" +
		qtyId +
		"&_sltwlQuantity=" +
		$("#" + qtyId).val() +
		"&_sltwlHeight=" +
		getPageScroll();
	if (skuSelectionId != null && skuSelectionId != "") {
		params = params + "&wSkuSelection=" + skuSelectionId;
	}
	params = encodeURIComponent(params);
	gotoUrl(contextPath + "/account/login.jsp?params=" + escape(params));
}

function anonymousAddToWishlistCulinary(
	url,
	productId,
	skuId,
	qtyId,
	locationSelectionId
) {
	var params =
		"_sltwlAddToWishlist=true" +
		"&_sltwlProductId=" +
		productId +
		"&_sltwlSkuId=" +
		skuId +
		"&_sltwlQtyId=" +
		qtyId +
		"&_sltwlQuantity=" +
		$("#" + qtyId).val() +
		"&_sltwlHeight=" +
		getPageScroll();
	if (locationSelectionId != null && locationSelectionId != "") {
		params =
			params +
			"&_sltwlLocationSelection=" +
			locationSelectionId +
			"&_sltwlLocationValue=" +
			$("#" + locationSelectionId).val();
	}
	params = encodeURIComponent(params);
	gotoUrl(contextPath + "/account/login.jsp?params=" + escape(params));
}

function gotoUrl(url) {
	if (document.all) {
		var gotoLink = document.createElement("a");
		gotoLink.href = url;
		document.body.appendChild(gotoLink);
		gotoLink.click();
		return;
	}
	window.location.href = url;
}

function storePreLoad(
	addToWishlist,
	sizeSelection,
	sizeValue,
	colorSelection,
	colorValue,
	skuId,
	qtyId,
	quantity,
	height
) {
	if (addToWishlist != "true") {
		return;
	}
	var sizeSelection = document.getElementById(sizeSelection);
	if (sizeSelection != null) {
		sizeSelection.value = sizeValue;
		sizeSelection.onchange();
	}

	var colorSelection = document.getElementById(colorSelection);
	if (colorSelection != null) {
		colorSelection.value = colorValue;
		colorSelection.onchange();
	}
	window.scrollTo(0, height);
	setQtyValue(qtyId, quantity);
	var buttonId = skuId + "AddToWishlistButton";
	clickWishlistButton(buttonId);
}

function giftcardPreLoad(
	addToWishlist,
	skuSelection,
	skuId,
	qtyId,
	quantity,
	height
) {
	if (addToWishlist != "true") {
		return;
	}
	var skuSelection = document.getElementById(skuSelection);
	if (skuSelection != null) {
		skuSelection.value = skuId;
		skuSelection.onchange();
	}
	window.scrollTo(0, height);
	setQtyValue(qtyId, quantity);
	var buttonId = skuId + "AddToWishlistButton";
	clickWishlistButton(buttonId);
}

function culinaryPreLoad(
	addToWishlist,
	locationSelection,
	locationValue,
	skuId,
	qtyId,
	quantity,
	height
) {
	if (addToWishlist != "true") {
		return;
	}
	var locationSelection = document.getElementById(locationSelection);
	if (locationSelection != null) {
		locationSelection.value = locationValue;
		locationSelection.onchange();
	}
	window.scrollTo(0, height);
	setQtyValue(qtyId, quantity);
	var buttonId = skuId + "AddToWishlistButton";
	clickWishlistButton(buttonId);
}

function quickviewPreLoad(addToWishlist, productId, skuId, quantity) {
	if (addToWishlist != "true") {
		return;
	}
	//excute add to wishlist
	var $form = $("#addItemToWishListForm");
	$form.find(".productId").val(productId);
	$form.find(".skuId").val(skuId);
	$form.find(".quantity").val(quantity);
	$form.ajaxSubmit();
}

function setQtyValue(qtyId, quantity) {
	var counter = 0;
	var interval = window.setInterval(function() {
		if (counter > 60) {
			clearInterval(interval);
		}
		counter++;
		var qty = document.getElementById(qtyId);
		if (qty != null) {
			clearInterval(interval);
			qty.value = quantity;
		}
	}, 1000);
}

function clickWishlistButton(buttonId) {
	var counter = 0;
	var interval = window.setInterval(function() {
		if (counter > 60) {
			clearInterval(interval);
		}
		counter++;
		var wishlistBtt = document.getElementById(buttonId);
		if (wishlistBtt != null) {
			clearInterval(interval);
			if (getOS() == "MSIE") {
				//IE
				wishlistBtt.click();
				return;
			}
			//Firefox and Other browsers
			var ev = document.createEvent("HTMLEvents");
			ev.initEvent("click", false, true);
			wishlistBtt.dispatchEvent(ev);
		}
	}, 1000);
}

function getOS() {
	var OsObject = "";
	if (navigator.userAgent.indexOf("MSIE") > 0) {
		return "MSIE";
	}
	if ((isFirefox = navigator.userAgent.indexOf("Firefox") > 0)) {
		return "Firefox";
	}
	if ((isSafari = navigator.userAgent.indexOf("Safari") > 0)) {
		return "Safari";
	}
	if ((isCamino = navigator.userAgent.indexOf("Camino") > 0)) {
		return "Camino";
	}
	if ((isMozilla = navigator.userAgent.indexOf("Gecko/") > 0)) {
		return "Gecko";
	}
}

function getPageScroll() {
	var yScroll;
	if (self.pageYOffset) {
		yScroll = self.pageYOffset;
		//xScroll = self.pageXOffset;
	} else if (document.documentElement && document.documentElement.scrollTop) {
		yScroll = document.documentElement.scrollTop;
	} else if (document.body) {
		yScroll = document.body.scrollTop;
	}
	//arrayPageScroll = new Array('',yScroll)

	return yScroll;
}

function removeFromWishlist(itemId, productId, skuId, wishListId) {
	//Remove from Wish List Event Example
	//create object with eventInfo and product object
	var ddPersistedListRemovalEvent = {
		eventInfo: {
			eventName: "persistedListRemoval",
			type: "persisted list",
			location: "wishlist", // "cart", "wishlist", "registry"
			registryID: wishListId,
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
				}
			}
		]
	};

	//Push it onto the event array onto digitalData object
	window.digitalData = window.digitalData || {};
	window.digitalData.event = window.digitalData.event || [];
	window.digitalData.event.push(ddPersistedListRemovalEvent);

	//Create and dispatch an event trigger (using predefined sendCustomEvent function)
	sendCustomEvent("persistedListRemoval");

	$("#updateItemId").val(itemId);
	$("#updateItemQty").val(0);
	$("#updateGiftlistItems").click();
}

function updateQtyFromWishlist(itemId) {
	var qty = $("#" + itemId).val();
	$("#wishListForm")[0].reset();
	$("#updateItemQty").val(qty);
	$("#updateItemId").val(itemId);
	$("#" + itemId).val(qty);
	$("#updateGiftlistItems").click();
}
