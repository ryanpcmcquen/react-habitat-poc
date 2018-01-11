$(document).ready(function() {
	//    $("#datepicker").datepicker();

	// Get tomorrow's date
	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);

	$("#datepicker").datepicker({
		showOn: "button",
		buttonText: "Click to select a delivery date.",
		buttonImageOnly: true,
		buttonImage: "/styles/images/calender_off.gif",
		minDate: tomorrow,
		defaultDate: +1
	});
});

function QtyNumberConstraintValidator(evt, QtyField, maxLength) {
	QtyField.maxLength = maxLength;

	var charCode = evt.which ? evt.which : evt.keyCode;
	if (charCode == 37 || charCode == 39 || charCode == 46) {
		return true;
	}
	if (QtyField.value.length > maxLength && charCode != 8) {
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
