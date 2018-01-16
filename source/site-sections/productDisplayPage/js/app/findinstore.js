function findInStoreButtonClick() {
	var skuId = $("#findInStoreSkuId").val();
	var productId = $("#findInStoreProductId").val();
	var qtyId = "#" + skuId + "QtyId";
	var productQty = $(qtyId).val();
	var quantity = 1;
	if (productQty != null && productQty != 0 && productQty != "") {
		quantity = productQty;
	}
	var pdpColor = $("#product-optionsColor-select .activeSelection").attr(
		"data-color"
	);
	var pdpSize = $("#product-optionsSize-select .activeSelection").attr(
		"data-size"
	);
	var quickViewColor = $("#colorselection_quickview").val();
	var quickViewSize = $("#sizeselection_quickview").val();
	var selectedcolor = "";
	var selectedsize = "";
	if (pdpColor != null && pdpColor != "undefined") {
		selectedcolor = pdpColor;
	}
	if (pdpSize != null && pdpSize != "undefined") {
		selectedsize = pdpSize;
	}
	if (quickViewColor != null && quickViewColor != "undefined") {
		selectedcolor = quickViewColor;
	}
	if (quickViewSize != null && quickViewSize != "undefined") {
		selectedsize = quickViewSize;
	}
	if (quantity == null || quantity == "") {
		quantity = "1";
	}

	//- Google Analytics Tracking
	var e = PDPTracking.ga.findastore;
	pdpTracker(e[0], e[1], e[2] + skuId);

	//DTM
	//Find In Store Event Example
	var ddFindInStoreEvent = {
		eventInfo: {
			eventName: "findInStore",
			type: "locate product",
			location: "product detail",
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
				}
			}
		],
		findInStore: {
			params: {},
			results: {
				status: "success" //"success" (if sku found in any store) or "failure"
			}
		}
	};

	//Push it onto the event array on digitalData object
	window.digitalData = window.digitalData || {};
	window.digitalData.event = window.digitalData.event || [];
	window.digitalData.event.push(ddFindInStoreEvent);

	//Create and dispatch an event trigger (using predefined sendCustomEvent function)
	sendCustomEvent("findInStore");
	$.ajax({
		type: "POST",
		url:
			contextPath +
			"/browse/include/toolbarBottons/reserveInStore/_PDP2017_findStoreLandingPage.jsp",
		data: {
			skuId: skuId,
			productId: productId,
			quantity: quantity,
			size: selectedsize,
			color: selectedcolor
		},
		beforeSend: function() {
			$("#findInStoreSectionwaitingBtn").show();
			$("#findInStoreSection").hide();
		},
		success: function(data) {
			$("#findInStoreFormContainer")
				.html(data)
				.show()
				.find("#findInStoreFormZipCode")
				.focus();
			$("#findInStoreResultsContainer").hide();
			$("#findInStoreSectionwaitingBtn").hide();
			$("#findInStoreSection").show();
		}
	});

	return false;
}

function findInStoreBindEventsAfterLoad() {
	$("#findInStoreContainer").scroll2({
		padding: 40
	});

	var el = $("#findInStoreResults_options");

	el.find(".product-optionsColor").droplets({
		type: "color",
		callback: function($droplet) {
			findStoreChooseColorOption(
				$droplet.attr("data-color"),
				$droplet.attr("data-sku")
			);
		}
	});
	el.find(".product-optionsSize").droplets({
		type: "size",
		callback: function($droplet) {
			findStoreChooseSizeOption(
				$droplet.attr("data-size"),
				$droplet.attr("data-size")
			);
		}
	});
}

function findInStoreZipCodeEdit() {
	var productId = $("#findInStoreResultsProductId").val();
	var zipcode = $("#findInStoreResultsZipcodeId").val();
	var skuId = $("#findInStoreResultsSkuId").val();
	var quantity = $("#findInStoresResults_optionsQuantity").val();
	// save color or size selection before submitting form
	var color = $('#findStoreColorSelection option[selected="selected"]').val();
	var size = $('#findStoreSizeSelection option[selected="selected"]').val();

	if (quantity == "" || quantity == 0 || quantity == null) {
		quantity = 1;
	}

	$.ajax({
		url:
			contextPath +
			"/browse/include/toolbarBottons/reserveInStore/_PDP2017_findStoreLandingPage.jsp",
		type: "get",
		cache: false,
		data: {
			skuId: skuId,
			productId: productId,
			quantity: quantity,
			size: size,
			color: color,
			zipcode: zipcode,
			searchType: "LIMITED_DISTANCE"
		},
		beforeSend: function() {
			$("#findInStorewaitingBtn").show();
		},
		success: function(data) {
			$("#findInStoreFormContainer").html(data);
			$("#findInStoreFormContainer").show();
			$("#findInStoreResultsContainer").hide();
			$("#findInStoreSectionwaitingBtn").hide();
			$("#findInStoreSection").show();
		}
	});

	return false;
}

function findInStoreCheckAvailability() {
	var skuId = $("#findInStoreSkuId").val();
	var productId = $("#findInStoreProductId").val();
	var qtyId = "#" + skuId + "QtyId";
	var productQty = $(qtyId).val();
	var quantity = 1;
	if (productQty != null && productQty != 0) {
		quantity = productQty;
	}
	var pdpColor = $("#colorselection").val();
	var pdpSize = $("#sizeselection").val();
	var quickViewColor = $("#colorselection_quickview").val();
	var quickViewSize = $("#sizeselection_quickview").val();
	if (quantity == null || quantity == "") {
		quantity = "1";
	}
	var selectedcolor = "";
	var selectedsize = "";

	if (pdpColor != null && pdpColor != "undefined") {
		selectedcolor = pdpColor;
	}

	if (pdpSize != null && pdpSize != "undefined") {
		selectedsize = pdpSize;
	}

	if (quickViewColor != null && quickViewColor != "undefined") {
		selectedcolor = quickViewColor;
	}

	if (quickViewSize != null && quickViewSize != "undefined") {
		selectedsize = quickViewSize;
	}

	var zipCode = $("#findInStoreCheckAvailabilityzipcode").val();

	$.ajax({
		type: "POST",
		url:
			contextPath +
			"/browse/include/toolbarBottons/reserveInStore/_PDP2014_findStoreSearchResults.jsp",
		data: {
			skuId: skuId,
			productId: productId,
			quantity: quantity,
			size: selectedsize,
			color: selectedcolor,
			zipcode: zipCode,
			searchType: "LIMITED_DISTANCE"
		},
		beforeSend: function() {
			$("#findInStoreSectionwaitingBtn").show();
			$("#findInStoreSection").hide();
		},
		success: function(data) {
			$("#findInStoreResultsContainer").html(data);
			setResultsContainerPosition();
			$("#findInStoreResultsContainer").show();
			$("#findInStoreSectionwaitingBtn").hide();
			$("#findInStoreSection").show();
			// GA tagging
			//ga('send','event','form','submit','People who used Find in Store');
			window.pdpTracker(
				"form",
				"submit",
				"People who used Find in Store"
			);
		}
	});

	return false;
}

function findInStoreCheckAvailabilityPDP() {
	var skuId = $("#findInStoreSkuId").val();
	var productId = $("#findInStoreProductId").val();
	var qtyId = "#" + skuId + "QtyId";
	var productQty = $(qtyId).val();
	var quantity = 1;
	if (productQty != null && productQty != 0) {
		quantity = productQty;
	}
	var color = $("#colorselection").val();
	var size = $("#sizeselection").val();
	var quickViewColor = $("#colorselection_quickview").val();
	var quickViewSize = $("#sizeselection_quickview").val();
	if (quantity == null || quantity == "") {
		quantity = "1";
	}
	var selectedcolor = "";
	var selectedsize = "";

	if (pdpColor != null && pdpColor != "undefined") {
		selectedcolor = pdpColor;
	}

	if (pdpSize != null && pdpSize != "undefined") {
		selectedsize = pdpSize;
	}

	if (quickViewColor != null && quickViewColor != "undefined") {
		selectedcolor = quickViewColor;
	}

	if (quickViewSize != null && quickViewSize != "undefined") {
		selectedsize = quickViewSize;
	}

	var zipCode = $("#findInStoreCheckAvailabilityzipcode").val();

	$.ajax({
		type: "POST",
		url:
			contextPath +
			"/browse/include/toolbarBottons/reserveInStore/_PDP2014_findStoreSearchResults.jsp",
		data: {
			skuId: skuId,
			productId: productId,
			quantity: quantity,
			size: selectedsize,
			color: selectedcolor,
			zipcode: zipCode,
			searchType: "LIMITED_DISTANCE"
		},
		success: function(data) {
			$("#findInStoreResultsContainer").html(data);
			setResultsContainerPosition();
			$("#findInStoreResultsContainer").show();
			// GA tagging
			//ga('send','event','form','submit','People who used Find in Store');
			window.pdpTracker(
				"form",
				"submit",
				"People who used Find in Store"
			);
		}
	});

	return false;
}

function findInStoreCheckAvailabilityQuickView() {
	var skuId = $("#findInStoreSkuId").val();
	var productId = $("#findInStoreProductId").val();
	var qtyId = "#" + skuId + "QtyId";
	var productQty = $(qtyId).val();
	var quantity = 1;
	if (productQty != null && productQty != 0) {
		quantity = productQty;
	}
	var color = $("#colorselection").val();
	var size = $("#sizeselection").val();
	var quickViewColor = $("#colorselection_quickview").val();
	var quickViewSize = $("#sizeselection_quickview").val();
	if (quantity == null || quantity == "" || quantity == 0) {
		quantity = "1";
	}
	var selectedcolor = "";
	var selectedsize = "";

	if (pdpColor != null && pdpColor != "undefined") {
		selectedcolor = pdpColor;
	}

	if (pdpSize != null && pdpSize != "undefined") {
		selectedsize = pdpSize;
	}

	if (quickViewColor != null && quickViewColor != "undefined") {
		selectedcolor = quickViewColor;
	}

	if (quickViewSize != null && quickViewSize != "undefined") {
		selectedsize = quickViewSize;
	}

	var zipCode = $("#findInStoreCheckAvailabilityzipcode").val();

	$.ajax({
		type: "POST",
		url:
			contextPath +
			"/browse/include/toolbarBottons/reserveInStore/_PDP2014_findStoreSearchResults.jsp",
		data: {
			skuId: skuId,
			productId: productId,
			quantity: quantity,
			size: selectedsize,
			color: selectedcolor,
			zipcode: zipCode,
			searchType: "LIMITED_DISTANCE"
		},
		success: function(data) {
			$("#findInStoreResultsContainer").html(data);
			setResultsContainerPosition();
			$("#findInStoreResultsContainer").show();

			// GA tagging
			//ga('send','event','form','submit','People who used Find in Store');
			window.pdpTracker(
				"form",
				"submit",
				"People who used Find in Store"
			);
		}
	});

	return false;
}

function findInStoreCloseButtonClick() {
	$("#findInStoreFormContainer").hide();
	$("#findInStoreResultsContainer").hide();
	$("#findInStoreFormContainer").hide();
	$("#findInStoreResultsContainer").hide();
	var skuId = $("#findInStoreSkuId").val();
	var productId = $("#findInStoreProductId").val();
	if (skuId == null || skuId == "") {
		skuId = "";
	}
	var qtyId = "#" + skuId + "QtyId";
	var productQty = $(qtyId).val();
	var quantity = 1;
	if (productQty != null && productQty != 0) {
		quantity = productQty;
	}
	if (quantity == null || quantity == "" || quantity == 0) {
		quantity = "1";
	}
	$("#findInStoreContainer").load(
		contextPath +
			"/browse/include/toolbarBottons/reserveInStore/_PDP2014_findStore.jsp",
		{
			skuId: skuId,
			productId: productId,
			quantity: quantity
		}
	);

	return false;
}

function findInStoreSubmitClick() {
	$("#findInStoreFormContainer").hide();
	setResultsContainerPosition();
	$("#findInStoreResultsContainer").show();
}

function findInStoreResultsLocationEditClick() {
	$("#findInStoreFormContainer").show();
	$("#findInStoreResultsContainer").hide();
}

function findInStoreResultsQuantityEditClick() {
	if ($("#findInStoresResults_optionsQuantity").prop("disabled")) {
		$("#findInStoresResults_optionsQuantity").prop("disabled", false);
		$("#findInStoresResults_optionsQuantityEdit").hide();
		$("#findInStoresResults_optionsQuantitySave").show();
	} else {
		$("#findInStoresResults_optionsQuantity").prop("disabled", true);
		$("#findInStoresResults_optionsQuantityEdit").show();
		$("#findInStoresResults_optionsQuantitySave").hide();
	}

	return false;
}

function findInStoreResultsQuantitySaveClick() {
	var productId = $("#findInStoreResultsProductId").val();
	var zipcode = $("#findInStoreResultsZipcodeId").val();
	var skuId = $("#findInStoreResultsSkuId").val();
	var quantity = $("#findInStoresResults_optionsQuantity").val();
	if (quantity == "" || quantity == 0 || quantity == null) {
		quantity = 1;
	}

	// save color or size selection before submitting form
	var color = $('#findStoreColorSelection option[selected="selected"]').val();
	var size = $('#findStoreSizeSelection option[selected="selected"]').val();

	$.ajax({
		type: "POST",
		url:
			contextPath +
			"/browse/include/toolbarBottons/reserveInStore/_PDP2014_findStoreSearchResults.jsp",
		data: {
			skuId: skuId,
			productId: productId,
			quantity: quantity,
			size: size,
			color: color,
			zipcode: zipcode,
			searchType: "LIMITED_DISTANCE"
		},
		beforeSend: function() {
			$("#findInStorewaitingBtn").show();
			$("#findInStoreResults_locations").hide();
		},
		success: function(data) {
			$("#findInStoreResultsContainer").html(data);
			setResultsContainerPosition();
			$("#findInStoreResultsContainer").show();
			$("#findInStoreResults_locations").show();
			$("#findInStorewaitingBtn").hide();

			// GA tagging
			//ga('send','event','form','submit','People who used Find in Store');
			window.pdpTracker(
				"form",
				"submit",
				"People who used Find in Store"
			);
		}
	});

	return false;
}

function findStoreChooseSizeOption(size, skuId) {
	var productId = $("#findInStoreResultsProductId").val();
	var zipcode = $("#findInStoreResultsZipcodeId").val();
	var quantity = $("#findInStoresResults_optionsQuantity").val();

	if (quantity == "" || quantity == 0 || quantity == null) {
		quantity = 1;
	}

	$.ajax({
		type: "POST",
		url:
			contextPath +
			"/browse/include/toolbarBottons/reserveInStore/_PDP2014_findStoreSearchResults.jsp",
		data: {
			productId: productId,
			quantity: quantity,
			size: size,
			zipcode: zipcode,
			searchType: "LIMITED_DISTANCE"
		},
		beforeSend: function() {
			$("#findInStorewaitingBtn").show();
			$("#findInStoreResults_locations").hide();
		},
		success: function(data) {
			$("#findInStoreResultsContainer").html(data);
			setResultsContainerPosition();
			$("#findInStoreResultsContainer").show();
			$("#findInStorewaitingBtn").hide();
			$("#findInStoreResults_locations").show();

			// GA tagging
			//ga('send','event','form','submit','People who used Find in Store');
			window.pdpTracker(
				"form",
				"submit",
				"People who used Find in Store"
			);
		}
	});

	return false;
}

function findStoreChooseColorOption(color, skuId) {
	var productId = $("#findInStoreResultsProductId").val();
	var zipcode = $("#findInStoreResultsZipcodeId").val();
	var quantity = $("#findInStoresResults_optionsQuantity").val();

	if (quantity == "" || quantity == 0 || quantity == null) {
		quantity = 1;
	}

	$.ajax({
		type: "POST",
		url:
			contextPath +
			"/browse/include/toolbarBottons/reserveInStore/_PDP2014_findStoreSearchResults.jsp",
		data: {
			productId: productId,
			quantity: quantity,
			color: color,
			skuId: skuId,
			zipcode: zipcode,
			searchType: "LIMITED_DISTANCE"
		},
		beforeSend: function() {
			$("#findInStorewaitingBtn").show();
			$("#findInStoreResults_locations").hide();
		},
		success: function(data) {
			$("#findInStoreResultsContainer").html(data);
			setResultsContainerPosition();
			$("#findInStoreResultsContainer").show();
			$("#findInStorewaitingBtn").hide();
			$("#findInStoreResults_locations").show();

			findInStoreBindEventsAfterLoad();
			// GA tagging
			//ga('send','event','form','submit','People who used Find in Store');
			window.pdpTracker(
				"form",
				"submit",
				"People who used Find in Store"
			);
		}
	});

	return false;
}

function setResultsContainerPosition() {
	var a = [
		{
			el: $(
				"div#productquickview div#findInStoreContainer div#findInStoreResultsContainer"
			),
			y: 0
		}
	];

	$.each(a, function(k, v) {
		!v.el.length || v.el.css("top", v.y);
	});

	findInStoreBindEventsAfterLoad();

	//(($('div#productquickview div.outsideBox span.close.popupclose').offset().top + $('div#productquickview div.outsideBox span.close.popupclose').outerHeight()) - $('div#productquickview div#findInStoreContainer').offset().top)
}

function findInStoreZipCodeSearchValidator() {
	var a = 0;
	if (
		$("#findInStoreFormZipCode")
			.val()
			.trim() == "Enter City, State or Zip"
	) {
		$("#findInStoreFormZipCodeError").show();
		a++;
	} else {
		$("#findInStoreFormZipCodeError").hide();
	}
	if ($("#findInStoreFormMiles").val() == "0.0") {
		$("#findInStoreFormMilesError").show();
		a++;
	} else {
		$("#findInStoreFormMilesError").hide();
	}
	return a;
}

$(document).click(function(e) {
	var target = $(e.target);

	if (!target.parents("#findInStoreContainer").length) {
		closeFindInStore(e);
	}
});

$(document).keydown(function(e) {
	if (e.keyCode == 27) {
		//esc

		closeFindInStore(e);
	}
});

function closeFindInStore(e) {
	//only fire if the dialog is visible
	if (
		!$("#findInStoreFormContainer").is(":visible") &&
		!$("#findInStoreResultsContainer").is(":visible") &&
		!$("#findInStoreFormContainer").is(":visible") &&
		!$("#findInStoreResultsContainer").is(":visible")
	) {
		return;
	}
	$("#findInStoreFormContainer").hide();
	$("#findInStoreResultsContainer").hide();
	$("#findInStoreFormContainer").hide();
	$("#findInStoreResultsContainer").hide();
	var skuId = $("#findInStoreSkuId").val();
	var productId = $("#findInStoreProductId").val();
	if (skuId == null || skuId == "") {
		skuId = "";
	}
	var qtyId = "#" + skuId + "QtyId";
	var productQty = $(qtyId).val();
	var quantity = 1;
	if (productQty != null && productQty != 0) {
		quantity = productQty;
	}
	if (quantity == null || quantity == "" || quantity == 0) {
		quantity = "1";
	}
	$("#findInStoreContainer").load(
		contextPath +
			"/browse/include/toolbarBottons/reserveInStore/_PDP2014_findStore.jsp",
		{
			skuId: skuId,
			productId: productId,
			quantity: quantity
		}
	);
}
