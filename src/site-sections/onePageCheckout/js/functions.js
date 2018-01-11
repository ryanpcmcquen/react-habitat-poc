function logout() {
	var url = document.URL;

	if ($.browser.msie) {
		var checkCookie = getCustomCookie("us_ord");
		if (
			checkCookie != "null" &&
			checkCookie != null &&
			typeof checkCookie != "undefined"
		) {
			if (checkCookie.length > 0) {
				setCustomCookie("us_ord", "0", 365 * 24 * 60);
			}
		}
	}

	var logoutTo = $("#logoutTo").val();
	if (logoutTo == null || logoutTo == "" || logoutTo == undefined) {
		$("#logoutbutton").click();
		return;
	}
	if (logoutTo == 0 || logoutTo == "0") {
		logoutTo = document.URL;
	}

	// This url is used for displaying in the url.
	$("#logoutSuccessURL").attr("action", logoutTo);
	$("#logoutbutton").click();
}

function KillAllAsyncRequests() {
	for (var i = 0; i < asyncRequests.length; i++) {
		asyncRequests[i].abort();
	}
}
// End Async Management

// DEPRECATED
// This function is only to be used by existing code.
// Do not otherwise utilize this function. It will be
// removed in the very near future.
function loadPage(url) {
	$.get(url, function(data) {
		$("#xyz").html(data);
		$("#estimatedTaxes,#checkoutcvv2").css({
			margin: "0px",
			width: "100%"
		});
		$(".popupheader").css({
			margin: "0px auto",
			width: "567px"
		});
		$(".popupmain").css({
			margin: "0px auto"
		});
	});
}

function openPanel(which) {
	$(".step").hide();
	$("#step" + which + "form").slideDown(500);
}

function clearInfoDivSingle() {
	$("#step1info").slideUp(500);
	$("#step1info").empty();
}

function clearInfoDiv() {
	$.ajax({
		url: "/checkout/opc/includes/clearInfoDiv.jsp",
		type: "POST",
		success: function(data) {
			$("#step1info").slideUp(500);
			$("#step1info").empty();
		}
	});
}

function showDetails(whichItem, whichArea) {
	$(this)
		.parents("#edelivery_col_" + whichItem + " > ." + whichArea)
		.css("display", "table-row");
	return false;
}

function loadScript(url) {
	jQuery.getScript(url);
}

function loadCachedScript(url, options) {
	// allow user to set any option except for dataType, cache, and url
	options = jQuery.extend(options || {}, {
		dataType: "script",
		cache: true,
		url: url
	});

	// Use $.ajax() since it is more flexible than $.getScript
	// Return the jqXHR object so we can chain callbacks
	return jQuery.ajax(options);
}

function editConfig(currEditIndex) {
	base.opc.config.form.handlers["tpl_single"]["url"] =
		"/checkout/opc/includes/singleShipInclude.jsp?isEditAddress=true&editListIndex=" +
		currEditIndex;
}

function resetConfig() {
	base.opc.config.form.handlers["tpl_single"]["url"] =
		"/checkout/opc/includes/singleShipInclude.jsp";
}
