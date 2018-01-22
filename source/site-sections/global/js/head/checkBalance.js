/**
 * profile management javascript codes.
 *
 * @author foy
 */
function popupOndocReadyCheckBalance(modal, showDivId) {
	$(showDivId).jqm({
		overlay: 50,
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: modal,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	$(".jqmOverlay").remove();
	$(showDivId).jqmShow();
}

function loadPageFullPathForHeader(url, param) {
	$.get(url, param, function(data) {
		$("#xyzHeader").html(data);
	});
}
function ajaxSubmitCheckBalance(form) {
	var options = {
		success: function(data) {
			$("#xyzHeader").html(data);
			$("#remainingBalanceId").show();
		}
	};
	$("#" + form).ajaxSubmit(options);
}
function ajaxSubmitCheckBalanceCheckout(form) {
	var options = {
		success: function(data) {
			$(".giftCardErrorCont")
				.html(data)
				.show("400", function() {
					$("#remainingBalanceId").show();
					$("#xyzHeader").hide();
					$(".ppMethodRadioContent").show();
					$(
						"form#check_gift_card_balance div.message.haserror>div, form#check_gift_card_balance p.message.haserror"
					)
						.removeAttr("style")
						.css("color", "#ef423f");
				});
			//$('#xyzHeader').html(data);
			$("#remainingBalanceId").show();
		}
	};

	$("#" + form).ajaxSubmit(options);
}
function ajaxSubmitCheckBalance2(form, htmlDiv) {
	var options = {
		success: function(data) {
			var la = $(data).find("#acctCheckCardBalanceLookup");
			$("#" + htmlDiv).html(la);
			// open up the form
			$("#acctCheckCardBalanceLookup").show("slow");
			if ($("#giftCardBalanceLookupFormErrors").text().length == 0) {
				// replace the buttons with the Clear button
				$("#checkBlanceButtonId").hide();
				$("#acctCheckCardBalanceLookup .cancel").hide();
				$("#acctCheckCardBalanceLookup .clear").show();
				$("#remainingBalanceId").show(); // show the balance on the form
			}
		},
		error: function(e) {}
	};
	$("#" + form).ajaxSubmit(options);
}
