function hiddenGuestPassword() {
	$("#guestPassword").fadeOut("slow");
	$("#guestPwdText")
		.val("")
		.attr("disabled", true);
	$("#confirmGuestPwdText")
		.val("")
		.attr("disabled", true);
	$("#guestPassword")
		.find("p.message.haserror")
		.each(function() {
			$(this).empty();
		});
}

function showGuestPassword() {
	$("#guestPassword").fadeIn("slow");
	$("#guestPwdText")
		.val("")
		.removeAttr("disabled");
	$("#confirmGuestPwdText")
		.val("")
		.removeAttr("disabled");
	$("#guestPassword")
		.find("p.message.haserror")
		.each(function() {
			$(this).empty();
		});
}

$(document).ready(function() {
	if ($("#privacyRadioFalse").attr("checked")) {
		$("#guestPassword").css("display", "block");
	} else if ($("#privacyRadioTrue").attr("checked")) {
		$("#guestPassword").css("display", "none");
	}
	//--fixed bug:11632 -- begin
	if ($("#firstname_after").val() == $("#firstname_before").val()) {
		$("#address_same").attr("checked", true);
		//--fixed bug:12292 -- begin
		//	$("#firstname_after").attr("readOnly",true);
		//	$("#lastname_after").attr("readOnly",true);
		//	$("#address1_after").attr("readOnly",true);
		//	$("#address2_after").attr("readOnly",true);
		//	$("#city_after").attr("readOnly",true);
		//	$("#state_after").attr("disabled",true);
		//	$("#zip_after").attr("readOnly",true);
		//--fixed bug:12292 --end
	}
	//--fixed bug:11632 --end
});
