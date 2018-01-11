// we'll want to disable the modal on some pages, store rules here.
function allowLoginModal() {
	var pagePath = window.location.pathname,
		allowModal = true;
	if (pagePath.indexOf("login.jsp") > -1) {
		allowModal = false;
	} else if (pagePath.indexOf("anonymousOrderTracking.jsp") > -1) {
		allowModal = false;
	} else if (pagePath.indexOf("register.jsp") > -1) {
		allowModal = false;
	} else if (pagePath.indexOf("anonymousCheckout.jsp") > -1) {
		allowModal = false;
	} else if (pagePath.indexOf("anonymousCheckout.jsp") > -1) {
		allowModal = false;
	} else if (pagePath.indexOf("/opc/") > -1) {
		allowModal = false;
	}
	return allowModal;
}

// *****************************************************
//                 Dynamic Load Popup
// *****************************************************

// check to see if this link is external (on a different domain or a different protocol).
function isExternal(url) {
	var match = url.match(
		/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/
	);
	if (
		typeof match[1] === "string" &&
		match[1].length > 0 &&
		match[1].toLowerCase() !== location.protocol
	) {
		return true;
	}
	if (
		typeof match[2] === "string" &&
		match[2].length > 0 &&
		match[2].replace(
			new RegExp(
				":(" + { "http:": 80, "https:": 443 }[location.protocol] + ")?$"
			),
			""
		) !== location.host
	) {
		return true;
	}
	return false;
}

function loadPopup(url, params, callback) {
	console.log("loadPopup");

	if (isExternal(url)) {
		if (window["postMessage"]) {
			// postMessage Proxy
			console.log("isExternal");
			loadIframe.call(this, url);
		} else {
			window.location = url;
		}
	} else {
		console.log("not external");
		if (url.indexOf("deleteregistry_popup.jsp") >= 0) {
			$("#dynamicLoadWrapper").load(url, params, callback);
			return;
		}
		// add rlp
		if (url.indexOf("viewGiftRegistry.jsp") >= 0) {
			$("#dynamicLoadWrapper").load(url, params);
			return;
		}
		$("#dynamicLoadWrapper").load(url);
	}
}

function createPopupPNG(selector, modal) {
	$(selector).jqm({
		overlay: 50,
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: modal,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	$(".jqmOverlay").remove();
	$(selector).jqmShow();
}

function createPopupGIF(selector, modal) {
	$(selector).jqm({
		overlay: 50,
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: modal,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	$(".jqmOverlay").remove();
	$(selector).jqmShow();
}

// iFrame Proxy
//  because cross-domain restrictions apply to cross-protocol, we'll use an iframe to get secure content
function loadIframe(url) {
	var $iframe;

	if (url.indexOf("?") > 0) {
		url = url + "&proxy=true";
	} else {
		url = url + "?proxy=true";
	}

	// if the iframe already exists, we will use that, otherwise create the iframe and the postmessage function.
	if (document.getElementById("sltIframeProxy")) {
		$iframe = $("#sltIframeProxy");
	} else {
		$iframe = $(
			'<iframe id="sltIframeProxy" name="sltIframeProxy" class="" style="visibility:hidden; float:left;" width="0" height="0" frameborder="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no"></iframe>'
		).appendTo("body");

		//put content into wrapper and show it.
		pm.bind("setModalContent", function(data) {
			$("#dynamicLoadWrapper")
				.empty()
				.html(data.content);
			createPopupGIF(data.modalId, false);
		});

		// general communication problem. show form-level message and re-enable form
		pm.bind("showErrorMessage", function(data) {
			var $form = $(data.formId);
			$form
				.find(".formErrorMessage")
				.empty()
				.html(data.content);
			$form.find(".button").show();
			$form.find(".waitingBtn").hide();
		});
	}
	$iframe.attr("src", url);
}

// global click event that can be referenced elsewhere for binding and unbinding
// to click events
function loginModalClickEvent(e) {
	loadPopup($(this).attr("data-popupurl"));
	e.preventDefault();
}

// *****************************************************
//             Modal Login
// *****************************************************

var loginModalFunctions = {
	showFormError: function($form) {
		$form
			.find(".formErrorMessage")
			.empty()
			.html(
				'<p class="message haserror">There were problems completing your request.</p>'
			);
		$form.find(".button").show();
		$form.find(".waitingBtn").hide();
	},
	showFieldErrors: function($form, content) {
		$form.empty().html(content);
	},
	updateLoginStatus: function(modalId, content) {
		$(modalId).jqmHide();
		$("#topHeader")
			.empty()
			.html(content);
		//make call for profile data
		loadProfileData();
		loadCartData();
		$(".js-trigger-loginModal").unbind("click", loginModalClickEvent);
		if (typeof initializeHeaderNav == "function") {
			initializeHeaderNav();
		} else {
			console.log("initializeHeaderNav() is undefined");
		}
	},
	loginEnforcePasswordChange: function(content) {
		$("#loginPopup").jqmHide();
		$("#dynamicLoadWrapper").append(content);
		createPopupGIF("#resetpasswd", false);
	},
	redirectOnSucess: function(url) {
		window.location = url;
	}
};
