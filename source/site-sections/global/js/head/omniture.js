/*
	* author: carl.liu(cliu@aaxischina.com)
	* date: 2010-9-16
	*/

//*****************string tools for omniture***********
String.prototype.endWith = function(str) {
	if (
		str == null ||
		str == "" ||
		this.length == 0 ||
		str.length > this.length
	)
		return false;
	if (this.substring(this.length - str.length) == str) return true;
	else return false;
	return true;
};

String.prototype.startWith = function(str) {
	if (
		str == null ||
		str == "" ||
		this.length == 0 ||
		str.length > this.length
	)
		return false;
	if (this.substring(0, str.length) == str) return true;
	else return false;
	return true;
};
/*
  	String.prototype.trim=function(){
        console.log(this);
        console.trace();
		return $.trim(this);
	}*/
String.prototype.isUrl = function() {
	var strRegex = "^(https|http|ftp|rtsp|mms){1}://.*";
	var re = new RegExp(strRegex);
	return re.test(this);
};
String.prototype.getParse = function() {
	if (this.isUrl()) {
		return this.match(
			/^(([a-z]+):\/\/)?([^\/\?#]+)\/*([^\?#]*)\??([^#]*)#?(\w*)$/i
		); /***********************/
	} else {
		throw this + " is not an url.";
	}
};
String.prototype.getProtocol = function() {
	return this.getParse()[1];
};
String.prototype.getQuery = function() {
	return this.getParse()[5];
};
String.prototype.getHost = function() {
	return this.getParse()[3];
};
String.prototype.getPath = function() {
	return "/" + this.getParse()[4];
};

/** action class**/
OmnitureAction = {
	Action_Page_Category: "SCCategoryAction",
	Action_Page_Product: "SCPDPAction",
	Action_Page_StaticContent: "SCStatictAction",
	Action_ShopppingCartOptimization_CartAdds: "ShoppingCartAddAction",
	Action_ShopppingCartOptimization_CartRemoves: "ShoppingCartRemoveAction",
	Action_ShopppingCartOptimization_CheckOut: "CheckOutAction",
	Action_ShopppingCartOptimization_ThankYouPage: "thankYouAction",
	Action_ShopppingCartOptimization_ProductVeiw: "ProductViewAction",
	Action_Search: "SearchAction",
	Action_CrossSell: "CrossSellAction",
	//****************assemble action*******************

	getAddShoppingCartEventAction: function() {
		return (
			this.Action_Page_StaticContent +
			"," +
			this.Action_ShopppingCartOptimization_CartAdds
		);
	},
	getRemoveShoppingCartEventAction: function() {
		return (
			this.Action_Page_StaticContent +
			"," +
			this.Action_ShopppingCartOptimization_CartRemoves
		);
	},
	getSearchResultEventAction: function() {
		return this.Action_Page_StaticContent + "," + this.Action_Search;
	},
	getProductDetailEventAction: function() {
		return (
			this.Action_Page_Product +
			"," +
			this.Action_ShopppingCartOptimization_ProductVeiw +
			"," +
			this.Action_CrossSell
		);
	},
	getCheckOutEventAction: function() {
		return (
			this.Action_Page_StaticContent +
			"," +
			this.Action_ShopppingCartOptimization_CheckOut
		);
	},
	getCheckOutThankYouEventAction: function() {
		return (
			this.Action_Page_StaticContent +
			"," +
			this.Action_ShopppingCartOptimization_ThankYouPage
		);
	}
};

/** Checkout class**/
Checkout = {
	Step_One: "checkOutStep1",
	Step_One_PageName: "shopping cart: step 1 - shipping information",

	Step_Two: "checkOutStep2",
	Step_Two_PageName: "shopping cart: step 2 - payment information",

	Step_Three: "checkOutStep3",
	Step_Three_PageName: "shopping cart: step 3 - review your order",

	Thank_You_Page: "shopping cart:thank you",

	Check_Out: "shopping cart: checkout"
};

/****/
OmnitureCenter = {
	categoryFlag: "category",
	productFlag: "product",
	searchFlag: "search",
	homePageName: "index.jsp",
	cutFlag: "/",

	start: function() {
		try {
			//search result
			searchResultEvent();
			//site content--> pdp
			productDetailEvent();
			//site content
			siteContentCategoryEvent();
			//site content
			siteContentStaticPageEvent();
			//Shopping Cart Optimization
			checkOutEvent();
			// myAccountEvent
			myAccountEvent();
			// view shoppingCart
			shoppingCartEvent();
			// registrationAndLoginEvent
			registrationAndLoginEvent();

			giftRegistryEvent();

			promotionEvent();
		} catch (e) {
			return;
		}
	},
	getCtx: function() {
		return $("#omn_ctx").val();
	},
	getHomeCategoryId: function() {
		return $("#omn_homeCategoryId").val();
	},
	parseCategory: function(urlStr) {
		if (this.isHomePage(urlStr)) {
			return this.getHomeCategoryId();
		}
		if (urlStr.indexOf(this.categoryFlag) < 0) return;
		var s = urlStr.indexOf(this.categoryFlag);
		var s1 = urlStr.substring(s + this.categoryFlag.length + 1);
		return s1.substring(0, s1.indexOf(this.cutFlag));
	},
	parseProduct: function(urlStr) {
		if (urlStr.indexOf(this.productFlag) < 0) return;
		var s = urlStr.indexOf(this.productFlag);
		var s1 = urlStr.substring(s + this.productFlag.length + 1);
		return s1.substring(0, s1.indexOf(this.cutFlag));
	},
	isHomePage: function(urlStr) {
		var path = urlStr.getPath();
		var ctx = this.getCtx();
		if (ctx == "") {
			ctx = "/";
		}
		if (path == ctx || path == ctx + this.homePageName) {
			return true;
		} else {
			return false;
		}
	},
	removeUrlQueryString: function(urlStr) {
		if (urlStr.indexOf("?") > 0) {
			urlStr = urlStr.substring(0, urlStr.indexOf("?"));
		}
		return urlStr;
	},

	//Shopping Cart Optimization
	removeShoppingCartEvent: function(productID, skuID) {
		try {
			removeShoppingCartEvent(productID, skuID);
		} catch (e) {
			return;
		}
	},

	//Shopping Cart Optimization
	addShoppingCartEvent: function(productID, skuID) {
		try {
			addShoppingCartEvent(productID, skuID);
		} catch (e) {
			return;
		}
	},

	//Shopping Cart Optimization
	addShoppingCartEventType: function(productID, skuID, type) {
		try {
			addShoppingCartEventType(productID, skuID, type);
		} catch (e) {
			return;
		}
	},
	addGREvent: function(productID, skuID) {
		try {
			addGREvent(productID, skuID);
		} catch (e) {
			return;
		}
	},

	sccheckOutEvent: function() {
		try {
			sccheckOutEvent();
		} catch (e) {
			return;
		}
	},
	loginSuccess: function() {
		try {
			loginSuccess();
		} catch (e) {
			return;
		}
	}
};
/******==================================================================*******/

var currentUrl = OmnitureCenter.removeUrlQueryString(window.location.href);
var fromPage = OmnitureCenter.removeUrlQueryString(document.referrer);

$(document).ready(function() {
	try {
		if ($("#omn_isActive").val() == "true") {
			OmnitureCenter.start();
		}
	} catch (e) {
		alert("Omniture process failed : " + e);
	}
});

//**********add function below*******************

//******search result
function searchResultEvent() {
	if (currentUrl.indexOf("search.jsp") < 0) return;
	var trail = $("#omn_facetTrailStr").val();

	if (trail.trim() == "") {
		//var question = $("#omn_search_question").val();
		//var totleCount = $("#omn_searchResultSize").val();
		//var params={};
		//	params.currentActions=OmnitureAction.getSearchResultEventAction();
		//	params.staticContentInfo="search results";
		//	params.staticInfoType="search";

		//	params.totleCount=totleCount;
		//	params.question=question;
		//	sendOmnitureData(params);
		return;
	}
	try {
		var sortBy = $("#sortSelect option:selected").text();
		//var display = $(".pagesize .viewby .active").attr("class");
		var view = $(".pagesize .perpage .active").html();
		var page = $(".pagecontrol .pages a[class*='active']").html();
		var tab = $("#omn_searchChangeTabValue").val();
		var tabName = $("#omn_tabName_" + tab).val();
		var display = $("#omn_search_display").val();
		var totleCount = $("#omn_searchResultSize").val();

		var params = {};
		params.currentActions = OmnitureAction.getSearchResultEventAction();
		params.staticContentInfo = "search results";
		params.staticInfoType = "search";
		params.facetTrail = $("#omn_facetTrailStr").val();
		params.searchResultSize = $("#omn_searchResultSize").val();
		params.searchViewAction = $("#omn_searchViewAction").val();

		params.sortBy = sortBy;
		params.display = display;
		params.view = view;
		params.page = page;
		params.tab = tab;
		params.tabName = tabName;

		params.totleCount = totleCount;
		$("#omn_searchViewAction").val("");
		sendOmnitureData(params);
	} catch (error) {}
}

//remove from shopping cart event,trigger by methods: addToCartStore... which are on the shoppingCart.js file.
function removeShoppingCartEvent(productID, skuID) {
	var params = {};
	params.staticContentInfo = Checkout.Check_Out;
	params.staticInfoType = "shopping cart";
	params.productID = productID;
	params.skuID = skuID;
	params.currentActions = OmnitureAction.getRemoveShoppingCartEventAction();
	sendOmnitureDataAsync(params);
}
//add to shopping cart event ,trigger by methods: addToCartStore... which are on the shoppingCart.js file.
function addShoppingCartEventType(productID, skuID, type) {
	var params = {};
	if (type == "1") {
		params.cartLocation = "product detail page";
	} else if (type == "2") {
		params.cartLocation = "recipe detail pages";
	} else if (type == "3") {
		params.cartLocation = "quick view";
	}
	params.staticContentInfo = Checkout.Check_Out;
	params.staticInfoType = "shopping cart";
	params.productID = productID;
	params.skuID = skuID;
	params.currentActions = OmnitureAction.getAddShoppingCartEventAction();
	sendOmnitureDataAsync(params);
}

//add to shopping cart event ,trigger by methods: addToCartStore... which are on the shoppingCart.js file.
function addShoppingCartEvent(productID, skuID) {
	var params = {};
	params.staticContentInfo = Checkout.Check_Out;
	params.staticInfoType = "shopping cart";
	params.productID = productID;
	params.skuID = skuID;
	params.currentActions = OmnitureAction.getAddShoppingCartEventAction();
	sendOmnitureDataAsync(params);
}

function addGREvent(productID, skuID) {
	var params = {};
	params.product = ";" + productID + ";event11=" + skuID;
	params.events = "event15";
	params.pageName = "gift - gift registry: add item to registry";
	sendOmnitureStatic(params);
}

//*****view productDetail
function productDetailEvent() {
	if (currentUrl.indexOf("product") < 0) return;
	var categoryID = "";

	if (
		fromPage.indexOf(OmnitureCenter.categoryFlag) < 0 &&
		fromPage.indexOf(OmnitureCenter.searchFlag) < 0 &&
		!OmnitureCenter.isHomePage(fromPage)
	) {
		categoryID = "";
	} else {
		if (fromPage.indexOf("searchContainer") > -1) {
			categoryID = "search results";
		} else {
			categoryID = OmnitureCenter.parseCategory(fromPage);
		}
	}
	var productFindMethod = "";

	//if(fromPage.indexOf("surlatable")<0){
	//	productFindMethod = "external non-campaign";
	//}else if(fromPage.indexOf(OmnitureCenter.categoryFlag)>-1){
	//	productFindMethod = "Internal Campaigns";
	//}else
	if (fromPage.indexOf("product") > -1) {
		productFindMethod = "cross sell";
	} else if (fromPage.indexOf("acctWishlistReview") > -1) {
		productFindMethod = "wish list";
	}
	var params = {};
	params.currentActions = OmnitureAction.getProductDetailEventAction();
	params.categoryID = categoryID;
	params.productID = OmnitureCenter.parseProduct(currentUrl);
	params.skuID = $("#omn_skuID").val();
	params.cartLocation = $("#omn_cart_location").val();
	params.productFindMethod = productFindMethod;
	//alert(params.categoryID + " | " +  params.productID  + " | " + params.skuID );
	$("#omn_skuID").val("");
	sendOmnitureData(params);
}

function siteContentCategoryEvent() {
	if (
		currentUrl.indexOf("category") < 0 &&
		!OmnitureCenter.isHomePage(currentUrl)
	)
		return;
	var parentCategoryName = $("#omn_parentCategoryName").val();
	var secondaryCategoryName = $("#omn_secondaryCategoryName").val();
	var params = {};
	params.categoryID = OmnitureCenter.parseCategory(currentUrl);
	params.currentActions = OmnitureAction.Action_Page_Category;
	params.parentCategoryName = parentCategoryName;
	params.secondaryCategoryName = secondaryCategoryName;
	sendOmnitureData(params);
}
function siteContentStaticPageEvent() {
	var params = {};
	if (currentUrl.indexOf("expCatalogOrdering") > -1) {
		params.staticContentInfo = "Request a Catalog";
	} else if (currentUrl.indexOf("cmpyInTheNews") > -1) {
		params.staticContentInfo = "As Seen In ";
	} else if (currentUrl.indexOf("landingPage") > -1) {
		params.staticContentInfo = "Store Locator";
	} else if (currentUrl.indexOf("sitemap") > -1) {
		params.staticContentInfo = "Site Map";
	} else if (currentUrl.indexOf("custContactUs") > -1) {
		params.staticContentInfo = "Contact Us";
	} else if (currentUrl.indexOf("custShipping") > -1) {
		params.staticContentInfo = "shipping";
	} else if (currentUrl.indexOf("custReturnsAndExchanges") > -1) {
		params.staticContentInfo = "Returns & Exchanges";
	} else if (currentUrl.indexOf("custGuarantee") > -1) {
		params.staticContentInfo = "Guarantee";
	} else if (currentUrl.indexOf("custFrequentlyAskedQuestions") > -1) {
		params.staticContentInfo = "FAQ";
	} else if (currentUrl.indexOf("cmpyAboutUs") > -1) {
		params.staticContentInfo = "About Us";
	} else if (currentUrl.indexOf("cmpyCareers") > -1) {
		params.staticContentInfo = "Careers";
	} else if (currentUrl.indexOf("cmpyPrivacy") > -1) {
		params.staticContentInfo = "Privacy";
	} else if (currentUrl.indexOf("cmpyMediaRelations") > -1) {
		params.staticContentInfo = "Media Relations";
	} else if (currentUrl.indexOf("cmpyPhotoCredits") > -1) {
		params.staticContentInfo = "Photography Credits";
	} else return;
	params.currentActions = OmnitureAction.Action_Page_StaticContent;
	params.staticInfoType = "information page";
	sendOmnitureData(params);
}
function checkOutEvent() {
	//if not checkout operation
	if (currentUrl.indexOf("checkout") < 0) return;
	var params = {};
	//judge this page if the first checkOut page.
	if (fromPage.indexOf("shoppingCart") > -1) {
		params.firstCheckoutPage = true;
	}

	if (currentUrl.indexOf("checkoutSelectType") > -1) {
		params.staticContentInfo = Checkout.Check_Out;
		if (params.firstCheckoutPage) {
			params.currentActions = OmnitureAction.getCheckOutEventAction();
		} else {
			return;
		}
	} else if (currentUrl.indexOf("payment") > -1) {
		params.staticContentInfo = Checkout.Step_Two_PageName;
		params.currentActions = OmnitureAction.getCheckOutEventAction();
		params.checkOutStep = Checkout.Step_Two;
	} else if (currentUrl.indexOf("review") > -1) {
		params.staticContentInfo = Checkout.Step_Three_PageName;
		params.currentActions = OmnitureAction.getCheckOutEventAction();
		params.checkOutStep = Checkout.Step_Three;
	} else if (currentUrl.indexOf("thankYou") > -1) {
		params.staticContentInfo = Checkout.Thank_You_Page;
		params.currentActions = OmnitureAction.getCheckOutThankYouEventAction();
		params.purchaseID = $("#omn_thankyou_purchaseID").val();
	} else {
		if (currentUrl.indexOf("checkoutSingleAddress_step2") > -1) {
			if (!params.firstCheckoutPage) {
				return;
			}
		}
		params.staticContentInfo = Checkout.Step_One_PageName;
		params.currentActions = OmnitureAction.getCheckOutEventAction();
		var step = $("#omn_checkout_step").val();
		if (step) {
			params.checkOutStep = step;
		} else {
			return;
		}
	}
	params.staticInfoType = "shopping cart";
	sendOmnitureData(params);
}

function sccheckOutEvent() {
	var params = {};
	params.firstCheckoutPage = true;
	params.currentActions = OmnitureAction.getCheckOutEventAction();
	params.staticInfoType = "shopping cart";
	sendOmnitureDataAsync(params);
}

function myAccountEvent() {
	var path = currentUrl.getPath();
	if (!path.startWith("/account") && !path.startWith("/registry")) return;
	var myAccountPage = "";

	if (
		path.indexOf("giftManageRegistries") > -1 ||
		path.indexOf("giftRegistryReportsPage") > -1
	) {
		myAccountPage = "my account:gift registries";
	} else if (currentUrl.indexOf("acctHome") > -1) {
		myAccountPage = "my account";
	} else if (currentUrl.indexOf("acctAccountSettings") > -1) {
		myAccountPage = "my account:account settings";
	} else if (currentUrl.indexOf("addressBook") > -1) {
		myAccountPage = "my account:address book";
	} else if (currentUrl.indexOf("acctOrderHistory") > -1) {
		myAccountPage = "my account:order history";
	} else if (currentUrl.indexOf("acctWishlistReview") > -1) {
		myAccountPage = "my account:wish list";
	} else if (currentUrl.indexOf("acctCookingClasses") > -1) {
		myAccountPage = "my account:my classes";
	} else if (currentUrl.indexOf("acctAttendees") > -1) {
		myAccountPage = "my account:attendees";
	} else if (currentUrl.indexOf("acctWishlistReview") > -1) {
		myAccountPage = "my account:wish list";
	} else return;

	var params = {};
	params.staticContentInfo = myAccountPage;
	params.staticInfoType = "account";
	params.currentActions = OmnitureAction.Action_Page_StaticContent;
	sendOmnitureData(params);
}

function shoppingCartEvent() {
	var path = currentUrl.getPath();
	if (currentUrl.indexOf("shoppingCart.jsp") < 0) return;
	var params = {};
	params.staticContentInfo = "shopping cart: checkout";
	params.staticInfoType = "shopping cart";
	params.cartLocation = $("#omn_cart_location").val();
	params.currentActions =
		OmnitureAction.Action_Page_StaticContent +
		"," +
		"ShoppingCartViewAction";
	sendOmnitureData(params);
}

function loginSuccess() {
	var params = {};
	params.events = "event6";
	params.pageName = "login success";
	sendOmnitureStatic(params);
}

function registrationAndLoginEvent() {
	var loginSuccess = $("#omn_loginSuccess").val();
	var loggedInSession = sessionStorage.getItem("#omn_loginSuccess");
	if (loginSuccess && !loggedInSession) {
		sessionStorage.setItem("#omn_loginSuccess", "true");

		var params = {};
		params.events = "event6";
		params.pageName = "login success";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("error404.jsp") > -1) {
		var params = {};
		params.pageName = "404 error page";
		sendOmnitureStatic(params);
		return;
	}
}

function giftRegistryEvent() {
	if (currentUrl.indexOf("register.jsp") > -1) {
		var params = {};
		params.events = "event4";
		params.pageName = "create an account";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("acctCreated.jsp") > -1) {
		var params = {};
		params.events = "event5";
		params.pageName = "account created";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("giftRegistryHome.jsp") > -1) {
		var params = {};
		params.pageName = "gift - gift registry";
		params.prop5 = "gift registry";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("viewGiftRegistry.jsp") > -1) {
		var params = {};
		params.pageName = "view gift registry";
		params.prop5 = "gift registry";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("giftSearchPage.jsp") > -1) {
		var params = {};
		params.pageName = "cat360423";
		params.prop5 = "gift registry";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("createGiftRegistry.jsp") > -1) {
		var params = {};
		params.pageName = "cat360421";
		params.prop5 = "gift registry";
		sendOmnitureStatic(params);
		return;
	}

	if (currentUrl.indexOf("createGiftRegistrySingleSetup.jsp") > -1) {
		var params = {};
		params.pageName = "Create Registry, Single Step";
		params.prop5 = "gift registry";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("giftSetup_step1.jsp") > -1) {
		var params = {};
		params.pageName = "Create Registry, Step 1";
		params.prop5 = "gift registry";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("giftSetup_step2.jsp") > -1) {
		var params = {};
		params.pageName = "Create Registry, Step 2";
		params.prop5 = "gift registry";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("giftSetup_step3.jsp") > -1) {
		var params = {};
		params.pageName = "Create Registry, Step 3";
		params.prop5 = "gift registry";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("giftSetup_step4.jsp") > -1) {
		var params = {};
		params.pageName = "Create Registry, Step 4";
		params.prop5 = "gift registry";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("giftRegistryCreated.jsp") > -1) {
		var params = {};
		params.pageName = "Create Registry, Complete";
		params.prop5 = "gift registry";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("giftAddItemsLandingPage.jsp") > -1) {
		var params = {};
		params.pageName = "cat450874";
		params.prop5 = "gift registry";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("giftManageRegistries.jsp") > -1) {
		var params = {};
		params.pageName = "My Account, Manage Registries";
		params.prop5 = "gift registry";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("giftChecklist.jsp") > -1) {
		var params = {};
		params.pageName = " cat340419";
		params.prop5 = "gift registry";
		sendOmnitureStatic(params);
		return;
	}
	if (currentUrl.indexOf("giftTipsGuides.jsp") > -1) {
		var params = {};
		params.pageName = "cat370423";
		params.prop5 = "gift registry";
		sendOmnitureStatic(params);
		return;
	}
	/*		var loginSuccess = $("#omn_createGRSuccess").val();
		if(loginSuccess){
			var params={}; 
			params.events="event14";
			params.pageName="gift registry complete";
			sendOmnitureStatic(params);
			return
		}*/
}

function promotionEvent() {
	if (
		currentUrl.indexOf("shoppingCart.jsp") < 0 &&
		currentUrl.indexOf("payment.jsp") < 0
	)
		return;
	var omnErrormessage = $("#omn_errormessage").val();
	var omnCouponClaimCode = $("#omn_couponClaimCode").val();
	if (omnErrormessage && omnCouponClaimCode) {
		var params = {};
		params.events = "purchase,event13";
		params.eVar12 = "i:" + omnCouponClaimCode;
		if (currentUrl.indexOf("shoppingCart.jsp") > -1) {
			params.pageName = "shopping cart: checkout";
		} else {
			params.pageName = "shopping cart: step 2 - payment information";
		}

		sendOmnitureStatic(params);
	}
}
//------------------------------------------------------------------------------------------------------------------------
function globalAdditionalParam(params) {
	params.referer = document.referrer;
	params.currentUrl = currentUrl;
	params.fromPage = fromPage;
}

function sendOmnitureData(params) {
	globalAdditionalParam(params);
	$.ajax({
		type: "POST",
		url: "/omniture/OmnitureSC.jsp",
		data: params,
		success: function(resp) {
			$("#omnitureContent").append(resp);
		}
	});
}

//use for trigger event ,trigger by js method such as addToCart removeToCart etc..
function sendOmnitureDataAsync(params) {
	globalAdditionalParam(params);
	$.ajax({
		type: "POST",
		async: false,
		url: "/omniture/OmnitureSC.jsp",
		data: params,
		success: function(resp) {
			$("#omnitureContent").append(resp);
		}
	});
}

function sendOmnitureStatic(params) {
	for (var sprop in params) {
		eval("s." + sprop + '="' + params[sprop] + '"');
	}
	var s_code;
	if (s.events) {
		s_code = s.tl();
	} else {
		s_code = s.t();
	}
	if (s_code) {
		document.write(s_code);
	}
}
//------------------------------------------------------------------------------------------------------------------------
