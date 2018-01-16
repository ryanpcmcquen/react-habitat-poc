/**
 * author: thomas
 * date: ii1i-7-i3
 */

/**********************************store product begin***************************************/
function isPDP() {
	var e = document.getElementById("productdetailpage");
	return e != null;
}
function getAddPrimaryStoreProductUrl(
	productId,
	sizeSelectionId,
	colorSelectionId
) {
	if (isPDP()) {
		var selectedColor = $(
			".product-optionsColor-select > a.activeSelection"
		).attr("data-color");
		var selectedSize = $(
			".product-optionsSize-select > a.activeSelection"
		).attr("data-size");
	} else {
		var selectedSize = $("#" + sizeSelectionId).val();
		var selectedColor = $("#" + colorSelectionId).val();
	}
	var colorSizeUrl =
		contextPath + "/templates/catalog/product/productDetailInfo.jsp?";
	var sizeOnlyUrl =
		contextPath +
		"/templates/catalog/product/productDetailInfo_sizeOnly.jsp?";
	var colorOnlyUrl =
		contextPath +
		"/templates/catalog/product/productDetailInfo_colorOnly.jsp?";
	var noAnyUrl =
		contextPath +
		"/templates/catalog/product/productDetailInfo_noColorSize.jsp?";
	var finalUrl;
	if (selectedSize != undefined && selectedColor != undefined) {
		finalUrl =
			colorSizeUrl +
			"optionColor=" +
			selectedColor +
			"&optionSize=" +
			selectedSize +
			"&productId=" +
			productId +
			"&isInit=false";
	} else if (selectedSize != undefined && selectedColor == undefined) {
		finalUrl =
			sizeOnlyUrl +
			"optionSize=" +
			selectedSize +
			"&productId=" +
			productId +
			"&isInit=false";
	} else if (selectedSize == undefined && selectedColor != undefined) {
		finalUrl =
			colorOnlyUrl +
			"optionColor=" +
			selectedColor +
			"&productId=" +
			productId +
			"&isInit=false";
	} else {
		finalUrl = noAnyUrl + "productId=" + productId + "&isInit=false";
	}
	return finalUrl;
}

function getAddRelevancyStoreProductUrl(
	productId,
	sizeSelectionId,
	colorSelectionId
) {
	var selectedSize = $("#" + sizeSelectionId).val();
	var selectedColor = $("#" + colorSelectionId).val();
	var idSplit = sizeSelectionId.split("_");
	var pubUrl = contextPath + "/browse/include/productItemWrapper.jsp?";
	var finalUrl;
	if (selectedSize != undefined && selectedColor != undefined) {
		finalUrl =
			pubUrl +
			"optionColor=" +
			selectedColor +
			"&optionSize=" +
			selectedSize +
			"&productId=" +
			productId +
			"&isInit=false" +
			"&productType=" +
			idSplit[1] +
			"&count=" +
			idSplit[2];
	} else if (selectedSize != undefined && selectedColor == undefined) {
		finalUrl =
			pubUrl +
			"optionSize=" +
			selectedSize +
			"&productId=" +
			productId +
			"&isInit=false" +
			"&productType=" +
			idSplit[1] +
			"&count=" +
			idSplit[2];
	} else if (selectedSize == undefined && selectedColor != undefined) {
		finalUrl =
			pubUrl +
			"optionColor=" +
			selectedColor +
			"&productId=" +
			productId +
			"&isInit=false" +
			"&productType=" +
			idSplit[1] +
			"&count=" +
			idSplit[2];
	} else {
		finalUrl =
			pubUrl +
			"&productId=" +
			productId +
			"&isInit=false" +
			"&productType=" +
			idSplit[1] +
			"&count=" +
			idSplit[2];
	}
	return finalUrl;
}

function getAddQuickViewStoreProductUrl(
	productId,
	sizeSelectionId,
	colorSelectionId
) {
	var selectedSize = $("#" + sizeSelectionId).val();
	var selectedColor = $("#" + colorSelectionId).val();
	var idSplit = sizeSelectionId.split("_");
	var pubUrl =
		contextPath + "/templates/catalog/product/quickView_detail.jsp?";
	var finalUrl;
	if (selectedSize != undefined && selectedColor != undefined) {
		finalUrl =
			pubUrl +
			"optionColor=" +
			selectedColor +
			"&optionSize=" +
			selectedSize +
			"&qpId=" +
			productId +
			"&isInit=false";
	} else if (selectedSize != undefined && selectedColor == undefined) {
		finalUrl =
			pubUrl +
			"optionSize=" +
			selectedSize +
			"&qpId=" +
			productId +
			"&isInit=false";
	} else if (selectedSize == undefined && selectedColor != undefined) {
		finalUrl =
			pubUrl +
			"optionColor=" +
			selectedColor +
			"&qpId=" +
			productId +
			"&isInit=false";
	} else {
		finalUrl = pubUrl + "&qpId=" + productId + "&isInit=false";
	}
	return finalUrl;
}

/*************************************store product end************************************/

/*************************************culinary product begin*********************************/
function getAddPrimaryCulinaryProductUrl(skuId) {
	return contextPath + "/browse/include/culSKUPrimary.jsp?skuId=" + skuId;
}

function getAddRelevancyCulinaryProductUrl(productId, locSelectionId) {
	var url = contextPath + "/browse/include/classItemWrapper.jsp?";
	var location = $("#" + locSelectionId).val();
	var idSplit = locSelectionId.split("_");
	var count = idSplit[1];
	var finalUrl =
		url +
		"classId=" +
		productId +
		"&location=" +
		location +
		"&count=" +
		count +
		"&isInit=false";
	return finalUrl;
}
/*************************************culinary product end*********************************/

/*************************************giftcard product begin*********************************/

function getAddTraditionalGiftcardsProductUrl(productId, skuId) {
	return (
		contextPath +
		"/browse/include/giftcardDetail.jsp?productId=" +
		productId +
		"&skuId=" +
		skuId
	);
}

function getAddVirtualGiftcardsProductUrl(productId, skuId) {
	return (
		contextPath +
		"/browse/include/giftcardVirtualDetail.jsp?productId=" +
		productId +
		"&skuId=" +
		skuId
	);
}

/*************************************giftcard product end***********************************/

function getRecorders(productId) {
	//cart recoder
	var cartRecoderId = productId + "AddToCartRecoder";
	var $cartRecoder = $("#" + cartRecoderId);
	//registry recoder
	var registryRecoderId = productId + "AddToRegistryRecoder";
	var $registryRecoder = $("#" + registryRecoderId);
	//wishlist recorder
	var wishlistRecoderId = productId + "AddToWishlistRecoder";
	var $wishlistRecoder = $("#" + wishlistRecoderId);

	return new Array($cartRecoder, $registryRecoder, $wishlistRecoder);
}

function getButtons(skuId) {
	//add to cart
	var addToCartButtonId = skuId + "AddToCartButton";
	var $addToCartButton = $("#" + addToCartButtonId);
	//add to registry
	var addToRegistryButtonId = skuId + "AddToRegistryButton";
	var $addToRegistryButton = $("#" + addToRegistryButtonId);
	//add to wishlist
	var addToWishlistButtonId = skuId + "AddToWishlistButton";
	var $addToWishlistButton = $("#" + addToWishlistButtonId);

	return new Array(
		$addToCartButton,
		$addToRegistryButton,
		$addToWishlistButton
	);
}

function getButtonIndicators(skuId) {
	//cart indicator
	var addToCartButtonIndicatorId = skuId + "AddToCartButtonIndicator";
	var $addToCartButtonIndicator = $("#" + addToCartButtonIndicatorId);
	//registry indicator
	var addToRegistryButtonIndicatorId = skuId + "AddToRegistryButtonIndicator";
	var $addToRegistryButtonIndicator = $("#" + addToRegistryButtonIndicatorId);
	//wishlist indicator
	var addToWishlistButtonIndicatorId = skuId + "AddToWishlistButtonIndicator";
	var $addToWishlistButtonIndicator = $("#" + addToWishlistButtonIndicatorId);

	return new Array(
		$addToCartButtonIndicator,
		$addToRegistryButtonIndicator,
		$addToWishlistButtonIndicator
	);
}

function getIndicatorStrs() {
	return new Array(
		" Added to Cart",
		" Added to Registry",
		" Added to Wishlist"
	);
}

function clearRecorders(productId) {
	var $recorders = getRecorders(productId);
	for (var i = 0; i < $recorders.length; i++) {
		$recorders[i].val("0");
	}
}

function restoreButtonStatus(productId, skuId, quantity, type) {
	var recorders = getRecorders(productId);
	var bottons = getButtons(skuId);
	var buttonIndictors = getButtonIndicators(skuId);
	var indicatorStrs = getIndicatorStrs();
	var index = parseInt(type);
	for (var i = 0; i < 3; i++) {
		if (i == index) {
			if (i != 0 && i != 1) {
				bottons[i].attr("class", "buttonalt");
			}
			recorders[i].val(parseInt(recorders[i].val()) + parseInt(quantity));
			buttonIndictors[i].html(recorders[i].val() + indicatorStrs[i]);
			buttonIndictors[i].show();
			continue;
		}
		if (recorders[i].val() > 0) {
			if (i != 0 && i != 1) {
				bottons[i].attr("class", "buttonalt");
			}
			buttonIndictors[i].html(recorders[i].val() + indicatorStrs[i]);
			buttonIndictors[i].show();
		}
	}
}

function isPDPpage() {
	return $("body").attr("id") == "productdetailpage";
}
