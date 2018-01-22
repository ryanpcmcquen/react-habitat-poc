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
				$(window).trigger("addToRegistryComplete");
				//Refresh Item Count
				$("#topHeaderGiftCount").load(
					contextPath + "/includes/headerRegistryItems.jsp"
				);
				//Clear data from local storage (SLT data)
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

function closeItemsAddedDialog(isOtherPopUpOpen, otherPopUp) {
	$(".slt-fc-itemadded-dialog").remove();
	if (!isOtherPopUpOpen) {
		$(".fc-dialog-wrapper").css("display", "none");
	} else {
		otherPopUp.css("display", "block");
	}
}

function displayItemsAddedDialog() {
	var startOverPopUpSelector =
		".fc-dialog.fc-dialog-type-confirm-dialog.fc-dialog-type-local-storage[data-fcreactid='.8.1.0']";
	var startOverPopUp = $(startOverPopUpSelector);
	var isStartOverOnDisplay =
		startOverPopUp.closest(".fc-dialog-wrapper").css("display") == "block";
	if (isStartOverOnDisplay == true) {
		startOverPopUp.css("display", "none");
	}

	$("#fluidConfigure").append(
		'<div class="slt-fc-itemadded-dialog fc-dialog fc-dialog-type-confirm-dialog fc-dialog-type-local-storage" style="position: absolute; width: 400px; height: auto; transform: translate(350px,205px) scale(1); transform-origin: 0% 0% 0px;z-index:1500;"><header class="fc-dialog-header" style="height:44px;"><h2>ITEMS ADDED!</h2></header><div class="fc-dialog-body" style="width:400px;height:auto;"><div class="fc-confirm-dialog"><p>The items have been added to your Gift Registry.</p><div class="fc-dialog-footer"><div class="fc-button-pair"><button class="fc-default-button">OK</button><div class="fc-button fc-fancy-button fc-confirm-ok sltfc-confirm-ok"><div class="fc-ripple-effect"></div><span class="fc-button-label"><span>OK</span></span></div></div></div></div></div></div>'
	);
	$(".fc-dialog-wrapper").css("display", "block");
	$(".sltfc-confirm-ok").bind("click", function() {
		closeItemsAddedDialog(isStartOverOnDisplay, startOverPopUp);
	});
}
