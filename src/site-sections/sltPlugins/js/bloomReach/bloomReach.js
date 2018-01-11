//if there's recommendation results from the API call above then hide the div
//Note: can't check for null or empty above because something always comes back in the response
$(document).ready(function() {
	if ($("#br-related-searches-widget").length < 1) {
		$(".bloomReachRecos").hide();
	}
});
