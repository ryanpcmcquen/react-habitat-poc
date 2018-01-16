/**
 * author: thomas
 * date: 2010-7-23
 * last updated: tfritsch 2016-02-09
 */

/*************************************EVENT BINDINGS***********************************************/
$(document).ready(function() {
	$("#selectedGR").bind("change", function() {
		$("#selectGRError").empty();
	});

	$(".giftselectregistrytrigger").bind("click", function() {
		$("#selectGRError").empty();
	});

	/**
     * Fired when wanting to add items to registry. Expects JSON object.
     * Example:
                {
                    "recipeId": "123",
                    "products": [{
                        "productID": "pro12",
                        "skuID": "23"
                    }, {
                        "productID": "pro34",
                        "skuID": "45"
                    }]
                }

     *
     * @param {Object} obj - contains products and skus to be added
     * @param {Int} [obj.recipeId] - recipe ID from Fluid MM used to pull back up content in Fluid widget
     * @param {Array} obj.products - An array of objects containing product IDs and associated skus
     * @param {String} obj.products[i].productID - Product ID
     * @param {String} obj.products[i].skuID - SKU ID
     * @return {Bool} true/false
     */
	$(window).on("addToRegistry", function(e, obj) {
		//Save data to be used usable beyond the current page
		setLocalGiftRegistryData(obj);

		//Retrieve profile and registry data for the user and process
		GetProfileGRData(e, obj);
	});

	$(window).on("loggedin", function(e, obj) {
		if (
			obj != null &&
			typeof obj.action != "undefined" &&
			obj.action == "loggedin" &&
			obj.grFluid == 1
		) {
			GetProfileGRData(); // re-throw
		}
	});
});

/***************************************store product begin****************************************/

function addToRegistryStoreAjaxFormSubmit(
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
			postAddToRegistryStore(productId, skuId, quantity, type);
		}
	};
	return $form.ajaxSubmit(options);
}

function postAddToRegistryStore(productId, skuId, quantity, type) {
	var errorCountId = skuId + "AddToRegistryFormErrorCount";
	var errorCount = $("#" + errorCountId).val();

	$("#giftselectregistry").jqmHide();
	if (errorCount == 0) {
		restoreButtonStatus(productId, skuId, quantity, "1");
	} else {
		clearRecorders(productId);
	}
	if (type == 3) {
		$("#productquickview").jqmShow();
	}
	$("#topHeaderGiftCount").load(
		contextPath + "/includes/headerRegistryItems.jsp"
	);
}

// add for bug 13568 start
function addToRegistryStoreAjaxFormSubmitLoadRegistry(
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
			postAddToRegistryStoreLoadRegistry(
				productId,
				skuId,
				quantity,
				type
			);
		}
	};
	return $form.ajaxSubmit(options);
}

function postAddToRegistryStoreLoadRegistry(productId, skuId, quantity, type) {
	var errorCountId = skuId + "AddToRegistryFormErrorCount";
	var errorCount = $("#" + errorCountId).val();

	$("#giftselectregistry").jqmHide();
	if (errorCount == 0) {
		restoreButtonStatus(productId, skuId, quantity, "1");
	} else {
		clearRecorders(productId);
	}
	if (type == 3) {
		$("#productquickview").jqmShow();
	}
	$("#topHeaderGiftCount").load(
		contextPath + "/includes/headerRegistryItems.jsp"
	);
}
// add for bug 13568 end

function addToRegistryStoreSingleGR(
	productId,
	skuId,
	qtyId,
	onlyGRId,
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

	//omniture function
	OmnitureCenter.addGREvent(productId, skuId);

	var $form = $("#addItemToRegistryForm");
	var quantity = $("#" + qtyId).val();
	$form.find(".productId").val(productId);
	$form.find(".skuId").val(skuId);
	$form.find(".quantity").val(quantity);
	$form.find(".giftlistId").val(onlyGRId);
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
		return typeof s != "undefined";
	};

	if (u(extraParams)) {
		elementId = u(extraParams.elementId)
			? elementId
			: extraParams.elementId;
		finalUrl = u(extraParams.finalUrl) ? finalUrl : extraParams.finalUrl;
	}

	$form.find(".addItemToGiftlistSuccessURL").val(finalUrl);
	$form.find(".addItemToGiftlistErrorURL").val(finalUrl);
	return addToRegistryStoreAjaxFormSubmitLoadRegistry(
		elementId,
		$form,
		productId,
		skuId,
		quantity,
		type
	); //alter for bug 13568
}

function addToRegistryStoreMultiGR(
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

	//omniture function
	OmnitureCenter.addGREvent(productId, skuId);

	$("#productquickview").jqmHide();
	$("#selectGRError").empty();
	$("#giftselectregistry").jqmShow();
	$("#continueButton").unbind("click");
	$("#continueButton").click(function() {
		submitStoreManage(
			productId,
			skuId,
			qtyId,
			sizeSelectionId,
			colorSelectionId,
			type
		);
	});
}

function submitStoreManage(
	productId,
	skuId,
	qtyId,
	sizeSelectionId,
	colorSelectionId,
	type
) {
	var selectedGR = $("#selectedGR").val();
	if (selectedGR == null || "" == selectedGR) {
		$("p.haserror")
			.empty()
			.text("Please select a gift registry!");
		return;
	}
	var quantity = $("#" + qtyId).val();
	var $form = $("#addItemToRegistryForm");
	$form.find(".productId").val(productId);
	$form.find(".skuId").val(skuId);
	$form.find(".quantity").val(quantity);
	$form.find(".giftlistId").val(selectedGR);
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
			var finalUrl = getAddRelevancyStoreProductUrl(
				productId,
				sizeSelectionId,
				colorSelectionId
			);
			var idSplit = sizeSelectionId.split("_");
			elementId = idSplit[1] + "Product" + idSplit[2];
			break;
		case "3":
			var finalUrl = getAddQuickViewStoreProductUrl(
				productId,
				sizeSelectionId,
				colorSelectionId
			);
			elementId = "detailInfo";
			break;
		default:
			break;
	}
	$form.find(".addItemToGiftlistSuccessURL").val(finalUrl);
	$form.find(".addItemToGiftlistErrorURL").val(finalUrl);
	addToRegistryStoreAjaxFormSubmit(
		elementId,
		$form,
		productId,
		skuId,
		quantity,
		type
	);
}
/***********************************************store product end************************************/

/***********************************************culinary product begin********************************/

function addToRegistryCulinaryAjaxFormSubmit(
	elementId,
	$form,
	productId,
	skuId,
	quantity
) {
	var options = {
		success: function(data) {
			$("#" + elementId).html(data);
			postAddToRegistryCulinary(productId, skuId, quantity);
		}
	};
	return $form.ajaxSubmit(options);
}

function postAddToRegistryCulinary(productId, skuId, quantity) {
	var errorCountId = skuId + "AddToRegistryFormErrorCount";
	var errorCount = $("#" + errorCountId).val();

	$("#giftselectregistry").jqmHide();
	if (errorCount == 0) {
		restoreButtonStatus(productId, skuId, quantity, "1");
	} else {
		clearRecorders(productId);
	}
	$("#topHeaderGiftCount").load(
		contextPath + "/includes/headerRegistryItems.jsp"
	);
}

/**
 * type:
 *  --1: primary product
 *  --2: relevancy product
 *  if need to extend type,just need add the geturl method in toolbarPub.js
 *  here add case x: action();
 */
function addToRegistryCulinarySingleGR(
	productId,
	skuId,
	qtyId,
	onlyGRId,
	locSelectionId,
	type
) {
	//omniture function
	OmnitureCenter.addGREvent(productId, skuId);

	var $form = $("#addItemToRegistryForm");
	var quantity = $("#" + qtyId).val();
	$form.find(".productId").val(productId);
	$form.find(".skuId").val(skuId);
	$form.find(".quantity").val(quantity);
	$form.find(".giftlistId").val(onlyGRId);
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
	addToRegistryCulinaryAjaxFormSubmit(
		elementId,
		$form,
		productId,
		skuId,
		quantity
	);
}

function addToRegistryCulinaryMultiGR(
	productId,
	skuId,
	qtyId,
	locSelectionId,
	type
) {
	//omniture function
	OmnitureCenter.addGREvent(productId, skuId);

	$("#productquickview").jqmHide();
	$("#selectGRError").empty();
	$("#giftselectregistry").jqmShow();
	$("#continueButton").unbind("click");
	$("#continueButton").click(function() {
		submitCulinaryManage(productId, skuId, qtyId, locSelectionId, type);
	});
}

function submitCulinaryManage(productId, skuId, qtyId, locSelectionId, type) {
	var selectedGR = $("#selectedGR").val();
	if (selectedGR == null || "" == selectedGR) {
		$("p.haserror")
			.empty()
			.text("Please select a gift registry!");
		return;
	}
	var quantity = $("#" + qtyId).val();
	var $form = $("#addItemToRegistryForm");
	$form.find(".productId").val(productId);
	$form.find(".skuId").val(skuId);
	$form.find(".quantity").val(quantity);
	$form.find(".giftlistId").val(selectedGR);
	var finalUrl;
	var elementId;
	switch (type) {
		case "1":
			finalUrl = getAddPrimaryCulinaryProductUrl(skuId);
			elementId = "culPrimaryDetail";
			break;
		case "2":
			var finalUrl = getAddRelevancyCulinaryProductUrl(
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
	addToRegistryCulinaryAjaxFormSubmit(
		elementId,
		$form,
		productId,
		skuId,
		quantity
	);
}
/***********************************************culinary product end********************************/

/***********************************************giftcard product begin******************************/

function addToRegistryGiftcardAjaxFormSubmit(
	elementId,
	$form,
	productId,
	skuId,
	quantity,
	selectedGR
) {
	var options = {
		success: function(data) {
			$("#" + elementId).html(data);
			if ($("#topHeaderGiftCount").size() > 0) {
				$("#topHeaderGiftCount").load(
					"/includes/headerRegistryItems.jsp"
				);
			}
			postAddToRegistryGiftcard(productId, skuId, quantity, selectedGR);
		}
	};
	return $form.ajaxSubmit(options);
}

function postAddToRegistryGiftcard(productId, skuId, quantity, selectedGR) {
	var errorCountId = skuId + "AddToRegistryFormErrorCount";
	var errorCount = $("#" + errorCountId).val();

	$("#giftselectregistry").jqmHide();
	if (true || errorCount == 0) {
		restoreButtonStatus(productId, skuId, quantity, "1");
		var url =
			contextPath +
			"/registry/include/popup/giftcarditemsadded_popup.jsp";
		var params = { giftlistId: selectedGR };
		loadPopup(url, params);
	} else {
		clearRecorders(productId);
	}
	$("#topHeaderGiftCount").load(
		contextPath + "/includes/headerRegistryItems.jsp"
	);
}

function setGiftRegistry(giftlistId) {
	if (typeof giftlistId === "undefined") giftlistId = "";
	var oGiftCardData = {};
	oGiftCardData.skuId = $(
		"#giftCardsDesignSelectCarousel-designs img.giftCardDesignSelected"
	)
		.data("skuid")
		.toString();
	oGiftCardData.productId = $(
		"#giftCardsDesignSelectCarousel-designs img.giftCardDesignSelected"
	).data("productid");
	oGiftCardData.virtualGC = $("#giftCardsTypeSelect-eGift").prop("checked");
	oGiftCardData.sendDate = "";
	if (oGiftCardData.virtualGC == true) {
		oGiftCardData.quantity = 1;
		oGiftCardData.type = "2";
		if ($("#giftCardsDate-sendLater:checked").length > 0) {
			oGiftCardData.sendDate = $("#giftCardDatepicker").val();
			if (oGiftCardData.sendDate == "") {
				$("#giftCardDatepicker-error").text("Please enter a date.");
				$("#giftCardDatepicker-error").show();
				$("#giftCardDatepicker").focus();
				return false;
			}
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
			oGiftCardData.sendDate = $("#currentDate").val();
		}
	} else {
		oGiftCardData.quantity = $("#giftCardsDesignQuantityInput").val();
		oGiftCardData.type = "1";
	}
	//oGiftCardData.grId = $("#grId").val();
	oGiftCardData.activeGRId = $(".activeGRId").val();
	var $form = $("#addItemToRegistryForm");
	$form.find(".productId").val(oGiftCardData.productId);
	$form.find(".skuId").val(oGiftCardData.skuId);
	$form.find(".quantity").val(oGiftCardData.quantity);
	$form.find(".giftlistId").val(giftlistId);
	return oGiftCardData;
}

function addToRegistryGiftcardSingleGR(
	productId,
	skuId,
	qtyId,
	onlyGRId,
	type
) {
	//omniture function
	OmnitureCenter.addGREvent(productId, skuId);

	var $form = $("#addItemToRegistryForm");
	var quantity = $("#" + qtyId).val();
	$form.find(".productId").val(productId);
	$form.find(".skuId").val(skuId);
	$form.find(".quantity").val(quantity);
	$form.find(".giftlistId").val(onlyGRId);
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
	$form.find(".addItemToGiftlistSuccessURL").val(finalUrl);
	$form.find(".addItemToGiftlistErrorURL").val(finalUrl);
	addToRegistryGiftcardAjaxFormSubmit(
		"giftcarddetail",
		$form,
		productId,
		skuId,
		quantity,
		onlyGRId
	);
}

function addToRegistryGiftcardSingleGR2(onlyGRId) {
	var deactivate = $(
		"#giftCardsSubmit a.addToRegistry.deactivateSubmitButton"
	);
	if (deactivate.length > 0) {
		return false;
	}
	var oGiftCardData = setGiftRegistry(onlyGRId);
	if (!oGiftCardData) {
		return;
	}
	//omniture function
	OmnitureCenter.addGREvent(oGiftCardData.productId, oGiftCardData.skuId);

	var $form = $("#addItemToRegistryForm");
	//$form.find(".giftlistId").val(grId);
	$form.find(".giftlistId").val(onlyGRId);
	var finalUrl = contextPath + "/browse/include/addCart.jsp";
	$form.find(".addItemToGiftlistSuccessURL").val(finalUrl);
	$form.find(".addItemToGiftlistErrorURL").val(finalUrl);
	addToRegistryGiftcardAjaxFormSubmit(
		"giftcarddetail-ajax",
		$form,
		oGiftCardData.productId,
		oGiftCardData.skuId,
		oGiftCardData.quantity,
		onlyGRId
	);
}

function addToRegistryGiftcardMultiGR2() {
	var deactivate = $(
		"#giftCardsSubmit a.addToRegistry.deactivateSubmitButton"
	);
	if (deactivate.length > 0) {
		return false;
	}
	var oGiftCardData = setGiftRegistry();
	if (!oGiftCardData) {
		return;
	}
	//omniture function
	OmnitureCenter.addGREvent(oGiftCardData.productId, oGiftCardData.skuId);

	$("#productquickview").jqmHide();
	$("#selectGRError").empty();
	$("#giftselectregistry").jqmShow();
	$("#continueButton").unbind("click");
	$("#continueButton").click(function() {
		submitGiftcardManage2(
			oGiftCardData.productId,
			oGiftCardData.skuId,
			oGiftCardData.quantity,
			oGiftCardData.type
		);
	});
}

function addToRegistryGiftcardMultiGR(productId, skuId, qtyId, type) {
	//omniture function
	OmnitureCenter.addGREvent(productId, skuId);

	$("#productquickview").jqmHide();
	$("#selectGRError").empty();
	$("#giftselectregistry").jqmShow();
	$("#continueButton").unbind("click");
	$("#continueButton").click(function() {
		submitGiftcardManage(productId, skuId, qtyId, type);
	});
}

function submitGiftcardManage(productId, skuId, qtyId, type) {
	var selectedGR = $("#selectedGR").val();
	if (selectedGR == null || "" == selectedGR) {
		$("p.haserror")
			.empty()
			.text("Please select a gift registry!");
		return;
	}
	var quantity = $("#" + qtyId).val();
	var $form = $("#addItemToRegistryForm");
	$form.find(".productId").val(productId);
	$form.find(".skuId").val(skuId);
	$form.find(".quantity").val(quantity);
	$form.find(".giftlistId").val(selectedGR);
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
	addToRegistryGiftcardAjaxFormSubmit(
		"giftcarddetail",
		$form,
		productId,
		skuId,
		quantity,
		selectedGR
	);
}

function submitGiftcardManage2(productId, skuId, quantity, type) {
	var selectedGR = $("#selectedGR").val();
	if (selectedGR == null || "" == selectedGR) {
		$("p.haserror")
			.empty()
			.text("Please select a gift registry!");
		return;
	}
	var $form = $("#addItemToRegistryForm");
	var oGiftCardData = setGiftRegistry(selectedGR);
	var finalUrl;
	/*
    switch(type){
        case '1':
            finalUrl=getAddTraditionalGiftcardsProductUrl(productId,skuId);
            //  return contextPath+"/browse/include/giftcardDetail.jsp?productId="+productId+"&skuId="+skuId;
            break;
        case '2':
            finalUrl=getAddVirtualGiftcardsProductUrl(productId,skuId);
            break;
        default:
            break;
    }
    */
	//var finalUrl = contextPath+"/browse/include/addCart.jsp";/
	$form.find(".addItemToGiftlistSuccessURL").val(finalUrl);
	$form.find(".addItemToGiftlistErrorURL").val(finalUrl);
	addToRegistryGiftcardAjaxFormSubmit(
		"giftcarddetail_TEST",
		$form,
		oGiftCardData.productId,
		oGiftCardData.skuId,
		quantity,
		selectedGR
	);
}

/***********************************************giftcard product end********************************/

//Those coded following may used before. pre remove test if system is ok.
/*
function addToRegistry(productId, skuId, qtyId,actionURLId) {
    var $form = $("#" + productId + "AddToRegistryForm");
    $form.attr("action",$("#"+actionURLId).val());
    $form.find(".productId").val(productId);
    $form.find(".skuId").val(skuId);
    $form.find(".quantity").val($("#" + qtyId).val());
    $form.find(".addItem").click();
}
function addToRegistryCulinary(productId, skuId, qtyId,actionURLId) {
    var $form = $("#" + productId + "AddToRegistryForm");
    $form.attr("action",$("#"+actionURLId).val());
    $form.find(".productId").val(productId);
    $form.find(".skuId").val(skuId);
    $form.find(".quantity").val($("#" + qtyId).val());
    $form.find(".addItem").click();
}
function addToRegistryGiftCard(productId, skuId, qtyId,actionURLId) {
    var $form = $("#" + productId + "AddToRegistryForm");
    $form.attr("action",$("#"+actionURLId).val());
    $form.find(".productId").val(productId);
    $form.find(".skuId").val(skuId);
    $form.find(".quantity").val($("#" + qtyId).val());
    var options={
            success:function () {
                var url = contextPath + "/registry/include/popup/giftcarditemsadded_popup.jsp";
                loadPopup(url);
//              var toolbarURL = contextPath + "/browse/include/giftCardToolbar.jsp";
//              $("#giftCardToolbar").load(url);
            }
        };
    return $form.ajaxSubmit(options);
}

function addToRegistryWithOutGRMode(ctx, productId, skuId, qtyId,actionURLId) {
    $("#selectGRError").empty();
    $("#giftselectregistry").jqmShow();
    var $form = $("#" + productId + "AddToRegistryForm");
    $form.attr("action",$("#"+actionURLId).val());
    $form.find(".productId").val(productId);
    $form.find(".skuId").val(skuId);
    $form.find(".quantity").val($("#" + qtyId).val());
    subForm = $form;
}

function addToRegistryCulinaryWithOutGRMode(ctx, productId, skuId, qtyId,actionURLId) {
    $("#selectGRError").empty();
    $("#giftselectregistry").jqmShow();
    var $form = $("#" + productId + "AddToRegistryForm");
    $form.attr("action",$("#"+actionURLId).val());
    $form.find(".productId").val(productId);
    $form.find(".skuId").val(skuId);
    $form.find(".quantity").val($("#" + qtyId).val());
    subForm = $form;
}


function addToRegistryWithOutGRModeWhenOneGR(ctx, productId, skuId, qtyId , onlyGRId,actionURLId) {
    var $form = $("#" + productId + "AddToRegistryForm");
    $form.attr("action",$("#"+actionURLId).val());
    $form.find(".productId").val(productId);
    $form.find(".skuId").val(skuId);
    $form.find(".quantity").val($("#" + qtyId).val());
    subForm = $form;
    $(subForm).find(".giftlistId").val(onlyGRId);
    $(subForm).find(".activeGRId").val(onlyGRId);
    $form.find(".addItem").click();
}
function addToRegistryGiftcardWithOutGRModeWhenOneGR(ctx, productId, skuId, qtyId , onlyGRId,actionURLId) {
    var $form = $("#" + productId + "AddToRegistryForm");
    $form.attr("action",$("#"+actionURLId).val());
    $form.find(".productId").val(productId);
    $form.find(".skuId").val(skuId);
    $form.find(".quantity").val($("#" + qtyId).val());
    subForm = $form;
    $(subForm).find(".giftlistId").val(onlyGRId);
    $(subForm).find(".activeGRId").val(onlyGRId);
    var options={
            success:function () {
                var url = contextPath + "/registry/include/popup/giftcarditemsadded_popup.jsp";
                loadPopup(url);
            }
        };
    $(subForm).ajaxSubmit(options);
}

function addToRegistryCulinaryWithOutGRModeWhenOneGR(ctx, productId, skuId, qtyId , onlyGRId,actionURLId) {
    var $form = $("#" + productId + "AddToRegistryForm");
    $form.attr("action",$("#"+actionURLId).val());
    $form.find(".productId").val(productId);
    $form.find(".skuId").val(skuId);
    $form.find(".quantity").val($("#" + qtyId).val());
    subForm = $form;
    $(subForm).find(".giftlistId").val(onlyGRId);
    $(subForm).find(".activeGRId").val(onlyGRId);
    $form.find(".addItem").click();
}

function giftcardSubmitManage() {
    var selectedGR = $("#selectedGR").val();
    if (selectedGR == null || "" == selectedGR) {
        $("p.haserror").empty().text("Please select a gift registry!");
        return;
    }
    $(subForm).find(".giftlistId").val(selectedGR);
    $(subForm).find(".activeGRId").val(selectedGR);
    //$(subForm).find(".addItem").click();
    $('#giftselectregistry').jqmHide();
    var options={
        success:function () {
            var url = contextPath + "/registry/include/popup/giftcarditemsadded_popup.jsp";
            var params = {giftlistId: selectedGR};
            loadPopup(url, params);
        }
    };
    $(subForm).ajaxSubmit(options);
}
*/
function removeFromGiftRegistry(itemId, productId, skuId, registryId) {
	//Remove from Registry Event Example
	//create object with eventInfo and product object
	var ddPersistedListRemovalEvent = {
		eventInfo: {
			eventName: "persistedListRemoval",
			type: "persisted list",
			location: "registry", // "cart", "wishlist", "registry"
			registryID: registryId,
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

function updateQtyFromGiftRegistry(itemId) {
	$("#updateReceivedDiv").remove();
	var qty = $("#" + itemId).val();
	$("#giftRegistryForm")[0].reset();
	$("#updateItemQty").val(qty);
	$("#updateItemId").val(itemId);
	$("#" + itemId).val(qty);

	$("#giftRegistryForm")
		.find("#div_accordian > .contents,#registryItems")
		.each(function() {
			if ($(this).css("display") == "block") {
				var giftItem = $(this).attr("id");
				var inputHtml =
					"<input type='hidden' name='expandDivs' value=" +
					giftItem +
					" />";
				$("#giftRegistryForm").append(inputHtml);
			}
		});
	$("#updateGiftlistItems").click();
}

function updateQtyFromGiftRegistry1(itemId, categoryDivId, divSkuId) {
	$("#updateReceivedDiv").remove();
	var qty = $("#" + itemId).val();
	$("#giftRegistryForm")[0].reset();
	$("#updateItemQty").val(qty);
	$("#updateItemId").val(itemId);
	$("#" + itemId).val(qty);

	$("#giftRegistryForm")
		.find("#div_accordian > .contents,#registryItems")
		.each(function() {
			if ($(this).css("display") == "block") {
				var giftItem = $(this).attr("id");
				var inputHtml =
					"<input type='hidden' name='expandDivs' value=" +
					giftItem +
					" />";
				$("#giftRegistryForm").append(inputHtml);
			}
		});

	$("#updateItemQtySkuId").val("div_" + divSkuId);
	$("#updateItemQtyCategory").val("head_" + categoryDivId);
	$("#updateGiftlistItems").click();
}

function updateRecivedQtyFromGiftRegistry(itemId) {
	$("#updateGiftlistItemsDiv").remove();
	var qty = $("#received" + itemId).val();
	$("#updateReceivedQty").val(qty);
	$("#giftItemId").val(itemId);
	$("#updateReceivedIQtySubmit").click();
}

$(document).ready(function() {
	$("#selectedGR").bind("change", function() {
		$("#selectGRError").empty();
	});

	$(".giftselectregistrytrigger").bind("click", function() {
		$("#selectGRError").empty();
	});
});

function moveItemsFormWishlistToRegistrySingle(qtyId) {
	var $form = $("#moveToRegistryForm");
	$form.find(".quantity").val($("#" + qtyId).val());
	$form.find(".wishlistItemId").val(qtyId);
	$form.submit();
}

function moveItemsFormWishlistToRegistryMulti(qtyId) {
	var $form = $("#moveToRegistryForm");
	$form.find(".giftlistId").val($("#selectedGR").val());
	if ($form.find(".giftlistId").val() == "") {
		$("p.haserror")
			.empty()
			.text("Please select a gift registry!");
		return;
	}
	$form.find(".quantity").val($("#" + qtyId).val());
	$form.find(".wishlistItemId").val(qtyId);
	$form.submit();
}

function chooseRegistry(wishlistItemIdVal) {
	loadPopup(
		contextPath +
			"/registry/include/popup/giftselectregistryWishlist_popup.jsp",
		{
			wishlistItemId: wishlistItemIdVal
		}
	);
}
/***************************************Generic add items to GR****************************************/

//When the user creates a GR, gets redirected back to FMM page
//so we load the recipe data and send it to the GR API
function OnFluidMixandMatchDOMReady() {
	if (
		window.location.href.indexOf("autogr=1") != -1 &&
		getLocalGiftRegistryData() != null
	) {
		GetProfileGRData();
	}
}

function FirefluidGRCreated(data) {
	if (
		window.location.href.indexOf("giftRegistryCreated.jsp") != -1 &&
		window.location.href.indexOf("grFluid=1") != -1
	) {
		setTimeout(function() {
			window.location.href =
				"/category/TCA-310755/?autogr=1&recipeId=" + data.recipeId;
		}, 1000);
	}
}

function setLocalGiftRegistryData(obj) {
	// Put the object into storage as a string
	localStorage.setItem("GiftRegistryData", JSON.stringify(obj));
}

function getLocalGiftRegistryData() {
	// Retrieve the object from storage and parse it
	var data = localStorage.getItem("GiftRegistryData");
	return $.parseJSON(data);
}

function GetProfileGRData(event) {
	// Get profile and gift registry data
	$.ajax({
		type: "POST",
		url: "/rest/bean/slt/rest/profile/ProfileActor/getGRData",
		success: function(data) {
			var dataToParse = data;
			if (typeof data.atgResponse != "undefined") {
				dataToParse = data.atgResponse;
			}

			console.log(dataToParse);

			ProcessGRData(
				event,
				getLocalGiftRegistryData(),
				$.parseJSON(dataToParse)
			);
		},
		error: function(error) {
			console.log("GR Data was no retrieved! " + error);
		}
	});
}

function ProcessGRData(event, fluidData, grData) {
	if (grData == null) {
		console.log("GR Data is not available!");
		return;
	}
	if (fluidData == null) {
		console.log("Fluid Data is not available");
		return;
	}
	//handle if user needs to be logged in
	if (
		typeof grData.isTransient == "undefined" ||
		grData.isTransient != false
	) {
		var loginUrl =
			"https://" + location.host + "/account/popupLogin.jsp?grFluid=1";
		loadPopup(loginUrl);
		return;
	}

	//handle if user needs to create a registry first
	if (grData.GiftLists.length == 0) {
		window.location.href =
			"https://" +
			location.host +
			"/registry/createGiftRegistry.jsp?grFluid=1&recipeId=" +
			fluidData.recipeId;
	} else if (grData.GiftLists.length == 1) {
		//handle if user is authenticated and has 1 registry
		//handle if user is in GR mode and has a default registry defined
		SendItemsToGiftRegistry(grData.GiftLists[0].ID, fluidData);
	} else if (grData.GiftLists.length > 1) {
		//handle if user is authenticated has multiple registries to choose from
		if (grData.GRMode == false) {
			//Load gift registry selection popup
			LoadGRSelectionPopup();
			return;
		} else {
			SendItemsToGiftRegistry(grData.ActiveGRID, fluidData);
		}
	}
}

function bindContinueButtonEvent() {
	$("#continueButton").bind("click", function() {
		var selectedGR = $("#selectedGR").val();
		SendItemsToGiftRegistry(selectedGR, getLocalGiftRegistryData());
		$("#giftselectregistry").jqmHide();
	});
}

function bindSelectGRPopUpEvents() {
	$("#selectedGR").removeAttr("onchange");
	$("#selectedGR").unbind("onchange");
	$("#selectedGR").change(function(event) {
		if (event.target.value == "") {
			$("#continueButton").attr("class", "buttonalt");
			$("#continueButton").unbind("click");
		} else {
			$("#continueButton").attr("class", "button giftreg");
			bindContinueButtonEvent();
		}
	});
	$("#continueButton").unbind("click");
}

function LoadGRSelectionPopup() {
	//Selection popup may already exist in the page
	//remove it, so we reload data
	if ($("#giftselectregistry").length == 1) {
		$("#giftselectregistry").remove();
	}

	//Initialize it and display it
	if ($("#giftselectregistryContainer").length == 0) {
		$("#xyz").append($('<div id="giftselectregistryContainer"></div>'));
	}

	var grSelectUrl = "/cart/include/giftSelectRegistryPopup.jsp";
	$("#giftselectregistryContainer").load(grSelectUrl, function() {
		$("#giftselectregistry").jqm({
			overlay: 50,
			trigger: "",
			closeClass: "popupclose",
			width: 495,
			height: 300,
			modal: false,
			onShow: myOpenGIF,
			onHide: myCloseGIF
		});

		bindSelectGRPopUpEvents();

		$("#giftselectregistry").css("position", "fixed");
		$("#giftselectregistry").jqmShow();
	});
}

function SendItemsToGiftRegistry(giftRegistryId, fluidData) {
	if (
		giftRegistryId != "" &&
		giftRegistryId != null &&
		fluidData != "" &&
		fluidData != null
	) {
		var postData = {
			giftlistId: giftRegistryId,
			productId: [],
			skuId: [],
			qty: []
		};
		for (i = 0; i < fluidData.products.length; i++) {
			postData.productId.push(fluidData.products[i].productId);
			postData.skuId.push(fluidData.products[i].skuId);
			postData.qty.push(1);
		}

		//This prevents jquery from adding [] at the end of the parameter name for arrays i.e. productId[]
		//the appended [] makes ATG fails since it does not find the parameter.
		jQuery.ajaxSettings.traditional = true;

		$.ajax({
			type: "POST",
			url:
				"/rest/bean/atg/commerce/gifts/GiftlistFormHandler/addItemsToGiftlist?atg-rest-return-form-handler-exceptions=true&atg-rest-return-form-handler-properties=true",
			data: postData,
			success: function(data) {
				//Refresh Item Count
				$("#topHeaderGiftCount").load(
					contextPath + "/includes/headerRegistryItems.jsp"
				);
				//Clear data from local storage
				setLocalGiftRegistryData(null);
				//display success popup
				displayItemsAddedDialog();

				// If there was an issue adding 1+ item(s)
				// we will get some exception messages
				if (data.result == false) {
					console.log("Error while adding one or more items to GR!");
					console.log(data.formExceptions);
				}
			},
			error: function(error) {
				console.log("Error adding items to GR! " + error);
			}
		});
	}
}

function closeItemsAddedDialog() {
	$(".slt-fc-itemadded-dialog").remove();
	$(".slt-dialog-backdrop").remove();
}

function displayItemsAddedDialog() {
	$("#fluidConfigure").after(
		'<div class="slt-dialog-backdrop fc-dialog-backdrop" style="background-color: rgba(0, 0, 0, 0.5);position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;"></div>'
	);
	$("#fluidConfigure").after(
		'<div class="slt-fc-itemadded-dialog fc-dialog fc-dialog-type-confirm-dialog fc-dialog-type-local-storage" style="position: absolute; width: 400px; height: auto; transform: translate(350px,-450px) scale(1); transform-origin: 0% 0% 0px;z-index:10500;"><header class="fc-dialog-header" style="height:44px;"><h2>ITEMS ADDED!</h2></header><div class="fc-dialog-body" style="width:400px;height:auto;"><div class="fc-confirm-dialog"><p>The items have been added to your Gift Registry.</p><div class="fc-dialog-footer"><div class="fc-button-pair"><button class="fc-default-button">OK</button><div class="fc-button fc-fancy-button fc-confirm-ok sltfc-confirm-ok"><div class="fc-ripple-effect"></div><span class="fc-button-label"><span>OK</span></span></div></div></div></div></div></div>'
	);
	$(".sltfc-confirm-ok").bind("click", function() {
		closeItemsAddedDialog();
	});
	$("html, body").animate(
		{
			scrollTop: $("#fluidConfigure").offset().top
		},
		2000
	);
}
