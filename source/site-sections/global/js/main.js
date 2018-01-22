// *****************************************************
//                 Class Event jQuery
// *****************************************************
(function($) {
	var classEvent = new $.Event("class");
	var addClass = $.fn.addClass;
	var rmClass = $.fn.removeClass;
	var tgClass = $.fn.toggleClass;
	$.fn.addClass = function() {
		var t = addClass.apply(this, arguments);
		this.trigger(classEvent);
		return t;
	};
	$.fn.removeClass = function() {
		var t = rmClass.apply(this, arguments);
		this.trigger(classEvent);
		return t;
	};
	$.fn.toggleClass = function() {
		var t = tgClass.apply(this, arguments);
		this.trigger(classEvent);
		return t;
	};
	$.fn.applyStyle = function(stylefile) {
		if (!$("link[href='" + stylefile + "']").length) {
			$('<link href="' + stylefile + '" rel="stylesheet">').appendTo(
				"head"
			);
		}
	};
})(jQuery);

$(window).on("OnlineCookingClassRedirect", function() {
	$.ajax({
		type: "POST",
		url: "/rest/bean/slt/rest/profile/ProfileActor/buildUserProfile",
		beforeSend: function() {
			//$("body").append('<div id="TIloader" style="position:fixed;width:100%;height:100%;background:rgba(255, 255, 255, 0.7);top:0;z-index:9999;"><h1 style="position:fixed;top:40%;left:37%"><img src="//www.surlatable.com/images/loading_img.gif" alt="Getting your classes ready..." /> Getting your classes ready...</h1></div>');
			global_showMask("Getting your classes ready...");
		},
		success: function(data) {
			if (typeof data.atgResponse == "string") {
				window.location.href = data.atgResponse;
			}
		},
		error: function(error) {
			console.log(
				"Unable to redirect to Online Cooking Classes \r\n" + error
			);
		}
	});
});

// *****************************************************
//           INIT CUSTOM PLUGINS
// *****************************************************
$(document).ready(function() {
	/***** INIT Quantity Morph ******/
	$(".quantityMorph").quantityMorph();

	function actionLazyLoad() {
		$(this)
			.find("img[data-original]")
			.lazyload({
				skip_invisible: true
			});
	}

	$("body")
		.on("shown.bs.modal", ".modal", actionLazyLoad)
		.on("shown.bs.dropdown", ".dropdown", actionLazyLoad);
});
$(window).on("load", function() {
	/*
	This is in window load because for image heavy pages no images
	may have loaded by the time the document is ready
	so all images on the page would be lazy loaded since their dom is in view
	*/
	/***** https://www.appelsiini.net/projects/lazyload *****/
	$("img[data-original]").lazyload({
		threshold: 100,
		skip_invisible: true,
		effect: "fadeIn"
	});
});

$(document).ready(function() {
	if ($.browser.msie) {
		var checkCookie = getCustomCookie("us_ord");
		if (
			checkCookie != "null" &&
			checkCookie != null &&
			typeof checkCookie != "undefined"
		) {
			if (checkCookie.length > 0) {
				setCustomCookie("us_ord", checkCookie, 365 * 24 * 60);
			}
		}
	}
});

// *****************************************************
//           FIRE BREAKPOINT EVENTS
// *****************************************************

function breakpointEvents() {
	var width = $(window).width();
	var bp = base.breakpoints;

	switch (true) {
		case width >= bp.xs && width < bp.sm:
			$(window).trigger("breakpoint-xs", [bp.xs]);

			break;

		case width >= bp.sm && width < bp.md:
			$(window).trigger("breakpoint-sm", [bp.sm]);

			break;

		case width >= bp.md && width < bp.lg:
			$(window).trigger("breakpoint-md", [bp.md]);

			break;

		case width >= bp.lg:
			$(window).trigger("breakpoint-lg", [bp.lg]);

			break;
	}
}
$(document).ready(breakpointEvents);
$(window).on("resize", breakpointEvents);

// myOpenGIF and myCloseGIF are global functions called across the site
// onShow : show+make the window translucent
// callback function for jqmodal
var myOpenGIF = function(hash) {
	var maskWidth = $(window).width();
	var maskHeight = $(document).height();

	hash.o.css({
		position: "absolute",
		height: maskHeight + "px",
		width: maskWidth + "px",
		backgroundColor: "#f1f1f1"
	});
	hash.o.prependTo("body");
	hash.o.fadeIn("1000");
	hash.w.fadeIn("1000");
};

// onClose : remove/hide the windows
// callback function for jqmodal
var myCloseGIF = function(hash) {
	hash.w.fadeOut("1000");
	hash.o.fadeOut("1000");
	hash.o.remove();
};

$(document).ready(function() {
	//
	// jqmodal initialization
	//
	$("#popupemailoptout").jqm({
		overlay: 50,
		trigger: "#emailoptout",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization
	//
	$("#popupcontact").jqm({
		overlay: 50,
		trigger: "#emailsignup",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization
	//
	$("#productquickview").jqm({
		overlay: 50,
		trigger: ".quickviewlink",
		closeClass: "popupclose",
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - cartpopup.htm Shopping cart
	//
	$("#cartpopup").jqm({
		overlay: 50,
		trigger: "a.cartpopuptrigger",
		closeClass: "popupclose",
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctAddAddress.htm
	//
	$("#acctaddaddress").jqm({
		overlay: 50,
		trigger: "a.acctaddaddresstrigger",
		closeClass: "popupclose",
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctEditAddress.htm
	//
	$("#accteditaddress").jqm({
		overlay: 50,
		trigger: "a.accteditaddresstrigger",
		closeClass: "popupclose",
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctRetrievepasswd.htm
	//
	$("#acctretrievepasswd").jqm({
		overlay: 50,
		trigger: "a.acctretrievepasswdtrigger",
		closeClass: "popupclose",
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctRetrievepasswd.htm
	//
	$("div.step2").jqm({
		overlay: 50,
		trigger: "a.acctretrievepasswd_step2trigger",
		closeClass: "popupclose",
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctRetrievepasswd.htm
	//
	$("div.step3").jqm({
		overlay: 50,
		trigger: "a.acctretrievepasswd_step3trigger",
		closeClass: "popupclose",
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctCancelClass.htm
	//
	$("#acctcancelclass").jqm({
		overlay: 50,
		trigger: "a.acctcancelclasstrigger",
		closeClass: "popupclose",
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctCulCancelPolicy.htm
	//
	$("#acctculcancelpolicy").jqm({
		overlay: 50,
		trigger: "a.acctculcancelpolicytrigger",
		closeClass: "popupclose",
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - acctPasswdForgot.htm
	//
	$("#forgotpasswd").jqm({
		overlay: 50,
		trigger: "a.acctforgetpasswdtrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctPasswdTemp.htm
	//
	$("#temppasswd").jqm({
		overlay: 50,
		trigger: "a.accttemppasswdtrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctPasswdReset.htm
	//
	$("#resetpasswd").jqm({
		overlay: 50,
		trigger: "a.acctresetpasswdtrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctPasswdReset_error.htm
	//
	$("#resetpasswd_error").jqm({
		overlay: 50,
		trigger: "a.acctresetpasswderrortrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctPasswdCleared.htm
	//
	$("#clearpasswd").jqm({
		overlay: 50,
		trigger: "a.acctclearpasswdtrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctPasswdTempSent.htm
	//
	$("#tempsentpasswd").jqm({
		overlay: 50,
		trigger: "a.accttempsentpasswdtrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctAddCCardAddress.htm
	//
	$("#acctAddCCAddress").jqm({
		overlay: 50,
		trigger: "a.acctaddccaddresstrigger",
		closeClass: "popupclose",
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctEditCCard.htm
	//
	$("#editccard").jqm({
		overlay: 50,
		trigger: "a.carteditccardtrigger",
		closeClass: "popupclose",
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctRemoveCCard.htm
	//
	$("#removeccard").jqm({
		overlay: 50,
		trigger: "a.acctremoveccardtrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctAddCCard.htm
	//
	$("#addccard").jqm({
		overlay: 50,
		trigger: "a.acctaddccardtrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctRemovedFromWishList.htm
	//
	$("#acctRemovedFromWishList").jqm({
		overlay: 50,
		trigger: "a.acctremovedfromwishlisttrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctShippingPreferences.htm
	//
	$("#acctShippingPreferences").jqm({
		overlay: 50,
		trigger: "a.acctshippingpreferencestrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctHowToRedeemGiftCard.htm
	//
	$("#acctHowToRedeemGiftCard").jqm({
		overlay: 50,
		trigger: "a.accthowtoredeemgiftcardtrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctHowToRedeemGiftCard.htm
	//
	$("#acctCheckCardBalanceLookup").jqm({
		overlay: 50,
		trigger: "a.acctcheckcardbalancetrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - acctHowToRedeemGiftCard.htm
	//
	$("#acctaddaddress").jqm({
		overlay: 50,
		trigger: "a.acctaddaddresstrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - acctHowToRedeemGiftCard.htm
	//
	$("#accteditaddress").jqm({
		overlay: 50,
		trigger: "a.accteditaddresstrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal initialization - acctRemoveAddress.htm
	//
	$("#acctremoveaddress").jqm({
		overlay: 50,
		trigger: "a.acctRemoveAddresstrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftPopCreateRegistry.htm
	//
	$("#giftcreateregistry").jqm({
		overlay: 50,
		trigger: "a.giftcreateregistrytrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftPopChoosePhoto.htm
	//
	$("#giftchoosephoto").jqm({
		overlay: 50,
		trigger: "a.giftchoosephototrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftPopRegistryContent.htm
	//
	$("#giftregistrycontent").jqm({
		overlay: 50,
		trigger: "a.giftregistrycontenttrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftPopRegistryDetails.htm
	//
	$("#giftregistrydetails").jqm({
		overlay: 50,
		trigger: "a.giftregistrydetailstrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftQuestionPrivacy.htm
	//
	$("#giftquestionprivacy").jqm({
		overlay: 50,
		trigger: "a.giftregistryprivacytrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftprivacycheckbox_popup.jsp
	//
	$("#giftprivacycheckboxquestion").jqm({
		overlay: 50,
		trigger: "a.giftprivacycheckboxtrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftQuestionPublish.htm
	//
	$("#giftquestionpublish").jqm({
		overlay: 50,
		trigger: "a.giftregistrypublishtrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftQuestionShipping.htm
	//
	$("#giftquestionshipping").jqm({
		overlay: 50,
		trigger: "a.giftregistryshippingtrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftQuestionMessage.htm
	//
	$("#giftquestionmessage").jqm({
		overlay: 50,
		trigger: "a.giftregistrymessagetrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftQuestionEvents.htm
	//
	$("#giftquestionevents").jqm({
		overlay: 50,
		trigger: "a.giftregistryeventstrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftQuestionInterests.htm
	//
	$("#giftquestioninterests").jqm({
		overlay: 50,
		trigger: "a.giftregistryintereststrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - itemLoginWaitlist.htm
	//
	$("#itemloginwaitlist").jqm({
		overlay: 50,
		trigger: "a.itemloginwaitlisttrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - itemAnonWaitlist.htm
	//
	$("#itemanonwaitlist").jqm({
		overlay: 50,
		trigger: "a.itemanonwaitlisttrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftPopPerfectRegistry.htm
	//
	$("#giftperfectregistry").jqm({
		overlay: 50,
		trigger: "a.giftperfectregistrytrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftPopFreeGifts.htm
	//
	$("#giftpopfreegifts").jqm({
		overlay: 50,
		trigger: "a.giftpopfreegifts",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftPopFreeGifts.htm
	//
	$("#giftpophelp").jqm({
		overlay: 50,
		trigger: "a.giftpophelp",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftDeleteRegistry.htm
	//
	$("#acctdeleteregistry").jqm({
		overlay: 50,
		trigger: "a.acctdeleteregistrytrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftPopItemsAdded.htm
	//
	$("#giftpopitemsadded").jqm({
		overlay: 50,
		trigger: "a.giftpopitemsaddedtrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftPopSelectRegistry.htm
	//
	$("#giftselectregistry").jqm({
		overlay: 50,
		trigger: "a.giftselectregistrytrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	// jqmodal initialization - giftAddGiftCardtoRegistry.htm
	//
	$("#giftaddgiftcardtoregistry").jqm({
		overlay: 50,
		trigger: "a.giftaddgiftcardtoregistrytrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - giftAddGiftCardtoWishlist.htm
	//
	$("#giftaddgiftcardtowishlist").jqm({
		overlay: 50,
		trigger: "a.giftaddgiftcardtowishlisttrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - checkoutCVV2.htm
	//
	$("#checkoutcvv2").jqm({
		overlay: 50,
		trigger: "a.cvvtrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - Taleo Careers popup
	//
	$("#cmpysearchcareer").jqm({
		overlay: 50,
		trigger: "a.taleocareertrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - Account Manage Shipping Information popup
	//
	$("#acctMangementShippingInfo").jqm({
		overlay: 50,
		trigger: "a.acctmanagementshippinginfotrigger",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - As Seen In popup
	//
	$("#asSeenInMagazine").jqm({
		overlay: 50,

		closeClass: "popupclose",
		width: 767,
		height: 536,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});
	//
	// jqmodal initialization - Online class gift
	//
	$("#onlineClassGiftPopup").jqm({
		overlay: 50,
		trigger: "",
		closeClass: "popupclose",
		width: 495,
		height: 300,
		modal: false,
		onShow: myOpenGIF,
		onHide: myCloseGIF
	});

	//
	// jqmodal trigger initialization - As Seen In Popup
	//
	$("a.newsitemtrigger").on("click", function() {
		var url = this.href;
		$.get(url, function(data) {
			$("#asSeenInArticle").html(data); // Update the inner HTML for the As Seen In Popup
			try {
				// If possible use the already initialized As Seen In Popoup
				$("#asSeenInMagazine").jqmShow(); // Show the As Seen In Popup
			} catch (e) {
				// Sometimes the browser looses track of the As Seen In Popoup
				//  so it has to be re-initialized - No idea why this is happenning!!!
				$("#asSeenInMagazine").jqm({
					overlay: 50,
					closeClass: "popupclose",
					width: 767,
					height: 536,
					modal: false,
					onShow: myOpenGIF,
					onHide: myCloseGIF
				});
				$("#asSeenInMagazine").jqmShow(); // Show the As Seen In Popup
			}
		});
		return false;
	});
	//
	// image preloader for popup graphics
	//
	(function($) {
		var cache = [];
		// Arguments are image paths relative to the current page.
		$.preLoadImages = function() {
			var args_len = arguments.length;
			for (var i = args_len; i--; ) {
				var cacheImage = document.createElement("img");
				cacheImage.src = arguments[i];
				cache.push(cacheImage);
			}
		};
	})(jQuery);

	jQuery.preLoadImages(
		"/styles/images/popup_box_top.png",
		"/styles/images/popup_box_btm.png",
		"/styles/images/popup_box_close_x.gif"
	);

	$("#topHeader a.cartpopuptriggerTA").bind("click", function(e) {
		if (e.hasOwnProperty("originalEvent")) {
			$("#tellApart").load(
				"/tellApartTag.jsp?actionType=updateCart&targetPage=Full&rnd=" +
					random_string()
			);
		}
	});
});

//
//   Used with controls.css
//
$(document).ready(function() {
	$(".bgiframe").bgiframe({ opacity: false });
});
//
//   Used with controls.css
//
//      Show input fields with replaceable pale-gray text - aka 'watermark'.
//      Automatically replace the default text with blanks when the
//      user enters the field.
//
$(document).ready(function() {
	$("input.watermark.inactive").each(function() {
		// find all watermark text fields
		$(this)
			.data("default", $(this).val()) // save the current text field value
			.focus(function() {
				// when the text field gains focus, do...
				$(this).removeClass("inactive"); // display the text as regular text
				if ($(this).val() == $(this).data("default") || "") {
					// does the field contain the default text?
					$(this).val(""); // yes - empty out the field.
				}
			})
			.blur(function() {
				// when the text field loses focus, do...
				var default_val = $(this).data("default"); // get the original text value
				if ($(this).val() == "") {
					// did the user leave the field blank?
					$(this).addClass("inactive"); // yes - display the original text applying the .inactive css rule
					$(this).val(default_val);
				}
			});
	});
});

function loadPageFullPathNotifyMe(url, param) {
	var $div = $("#notifyMe_div");
	$.get(url, param, function(data) {
		$("#notifyMe_div").html($(data).show());

		typeof param.callback == "undefined" || param.callback();
	});
}

function notifyMe(skuId, productId, url) {
	loadPageFullPathNotifyMe("/global/inventoryNotifyMe.jsp", {
		isFromEditLink: "true",
		catalogRefId: skuId,
		productId: productId,
		url: url
	});
}

function popupOndocReady(modal, showDivId) {
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

function random_string() {
	var time = String(new Date().getTime()).replace(/\D/gi, "");
	return time;
}

function enterHandler(event, triggerBtn) {
	var keyCode = event.keyCode
		? event.keyCode
		: event.which ? event.which : event.charCode;
	if (keyCode == 13) {
		event.returnValue = false;
		$("#" + triggerBtn).click();
	}
}

$(window).bind("beforeunload", function(event) {
	var e = window.event || event;
	var n = e.screenX - window.screenLeft;
	var b = n > document.documentElement.scrollWidth - 20;
	if ((b && e.clientY < 0) || e.altKey) {
		$.get(contextPath + "/timeout.jsp");
	}
});

$(document).ready(function() {
	// Bind click on login/register to open login modal

	//only bind the click event on pages where we will allow the modal.
	if (allowLoginModal()) {
		$(".js-trigger-loginModal").click(loginModalClickEvent);
	}

	function submitToProxy(buttonId, formId) {
		//hide the button and show a loading progress animation
		$("#" + buttonId)
			.hide()
			.parent()
			.find(".waitingBtn")
			.show();
		proxyFunctions.postForm(document.getElementById(formId));
	}

	// if we are communicating using postmessage, setup listeners
	if ("http:" == document.location.protocol) {
		//TODO: if jQuery gets updated to 1.7+, 'bind' can be changed to 'on'
		// ex:  $("body").on("submit", '#loginForm', function(e){

		$("#dynamicLoadWrapper").bind("click", function(e) {
			// because the submit buttons are actually spans wrapped in an a tag, we need to look at the id of the parent
			// we also have to look at target id because of enterHandler function.
			var parentId = e.target.parentNode.id,
				targetId = e.target.id;
			if (parentId == "loginBtnId" || targetId == "loginBtnId") {
				submitToProxy("loginBtnId", "popupLoginForm");
				e.preventDefault();
			} else if (
				parentId == "registerSubBtn" ||
				targetId == "registerSubBtn"
			) {
				submitToProxy("registerSubBtn", "popupRegisterForm");
				e.preventDefault();
			} else if (
				parentId == "changeTempPasswordSubmit" ||
				targetId == "changeTempPasswordSubmit"
			) {
				submitToProxy("changeTempPasswordSubmit", "changeTempPassword");
				e.preventDefault();
			}
		});

		/*  postmessage functions */

		// success, close modal and update header
		pm.bind("loginFormSuccess", function(data) {
			if (data.previousPage == "") {
				var currentPath = window.location.href;
				if (currentPath.indexOf("culAdd") != -1) {
					loginModalFunctions.redirectOnSucess(currentPath);
				} else {
					if (data.formId == "#popupRegisterForm") {
						loginModalFunctions.redirectOnSucess(
							"/account/acctCreated.jsp"
						);
					} else {
						loginModalFunctions.updateLoginStatus(
							data.modalId,
							data.content
						);
					}
				}
			} else {
				loginModalFunctions.redirectOnSucess(data.previousPage);
			}
		});

		// failure, update modal contents to show form errors.
		pm.bind("loginFormError", function(data) {
			var $form = $(data.formId);
			loginModalFunctions.showFieldErrors($form, data.content);
		});

		// failure, update modal contents to show form errors.
		pm.bind("loginEnforcePasswordChange", function(data) {
			loginModalFunctions.loginEnforcePasswordChange(data.content);
		});

		pm.bind("loginFormSuccessFluid", function(data) {
			$(window).trigger("loggedin", data);
		});
	}

	/* If statement to fix SLT-975 */
	if (navigator.userAgent.match(/iPad/i) != null) {
		/* Allow :active styles to work on a page in Mobile Safari */
		document.addEventListener("touchstart", function() {}, true);
	}

	/* Gift click action */
	$("#topHeaderGiftReg").click(function() {
		window.location = $("#topHeaderRegistryButton").attr("href");
	});

	/* Search click action */
	$("body > #topHeader, body > .mw_header_search_bar").on(
		"click",
		"#topNavSearch",
		function(event) {
			if ($(event.target).is("#topNavSearch>input")) {
				// Input clicked, no action
			} else {
				var searchUrl = $(this).attr("data-nonsecureurl");
				return searchFunctions.submitSimpleSearch(searchUrl);
			}
		}
	);

	/* Product secondary promo SHOP NOW activation */
	$(".topProductSecNavPromo").hover(
		function(event) {
			// When the promo box is hovered, activate SHOP NOW
			$(this)
				.children(".topProductSecNavPromoShop")
				.children("a")
				.css({
					color: "#405700",
					"border-bottom": "1px solid #a8a8a8",
					"text-decoration": "none"
				});
		},
		function(event) {
			// On mouseout, deactvate SHOP NOW
			$(this)
				.children(".topProductSecNavPromoShop")
				.children("a")
				.css({
					color: "",
					"border-bottom": "",
					"text-decoration": ""
				});
		}
	);

	/* Fix for search bar placeholder in IE8/9
    based on http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html */
	$("#topNavSearch>input")
		.focus(function() {
			var input = $(this);
			if (input.val() == input.attr("placeholder")) {
				input.attr("placeholder", "");
				input.val("");
			}
		})
		.blur(function() {
			var input = $(this);
			if (input.val() == "") {
				input.attr("placeholder", "SEARCH");
				input.val(input.attr("placeholder"));
			}
		})
		.blur();

	/* Send the content to searchQuestionDisplayed*/
	$("#searchMobileInput").bind("keyup", function(e) {
		$("#searchQuestionDisplayed").val(e.currentTarget.value);
		searchFunctions.enterHandler(e, "topNavSearch");
	});

	$("#topNavSearchMobile>span").click(function() {
		$("#topNavSearch").click();
	});
});

//Global mask

function global_showMask(msg) {
	$(document).ready(function() {
		if ($("#globalLoader").length > 0) {
			$("#globalLoader").show();
		} else {
			$("body").append(
				'<div id="globalLoader" style="position:fixed;width:100%;height:100%;background:rgba(255, 255, 255, 0.7);top:0;z-index:9999;"><h1 style="position:fixed;top:40%;left:37%"><img src="//www.surlatable.com/images/loading_img.gif" /> ' +
					msg +
					"</h1></div>"
			);
		}
	});
}

function global_hideMask() {
	$(document).ready(function() {
		$("#globalLoader").hide();
	});
}
