function loadQuickView(target) {
	var productId = $(target)
		.children("input:hidden:first")
		.val();
	var ddQuickViewEvent = {
		eventInfo: {
			eventName: "quickView",
			type: "product interaction",
			timeStamp: new Date(),
			processed: {
				adobeAnalytics: false //dtm will change this to true once processed
			}
		},
		product: [
			{
				productInfo: {
					productID: productId
				},
				category: {
					productType: ""
				},
				skuVarient: {}
			}
		]
	};

	$("#productquickview .secondary").load(
		contextPath + "/templates/catalog/product/quickView_secondary.jsp",
		{ qpId: productId }
	);
	$("#productquickview #name").load(
		contextPath + "/templates/catalog/product/quickView_productName.jsp",
		{ qpId: productId }
	);
	$("#productquickview #detailInfo").load(
		contextPath + "/templates/catalog/product/quickView_detail.jsp",
		{ qpId: productId, isInit: true }
	);

	$("#productquickview .qvtabshopping").load(
		contextPath + "/templates/catalog/product/quickViewDetailTab.jsp",
		{ qpId: productId },
		function() {
			$(".qvtabshopping .tabs div").hide(); // Hide all divs
			$(".qvtabshopping .tabs div:first").show(); // Show the first div
			$(".qvtabshopping .tabs div:first div").show(); // Show the div's of the first div
			$(".qvtabshopping .tabs ul li:first").addClass("active"); // Set the class of the first link to active
			$(".qvtabshopping .tabs ul li a").click(function() {
				// When any tab anchor is clicked
				$(".qvtabshopping .tabs ul li").removeClass("active"); // Remove active class from all links
				$(this)
					.parent()
					.addClass("active"); // Set clicked link class to active
				var currentTab = $(this).attr("href"); // Set variable currentTab to value of href attribute of clicked link
				if (currentTab.indexOf("http") != -1) {
					currentTab = $(this).attr("name");
				}
				$(".qvtabshopping .tabs div").hide(); // Hide all divs
				$(currentTab + " div").show(); // Show all contained divs within the currentTab
				$(currentTab).fadeIn("slow"); // Show the tab div with id equal to variable currentTab
				return false;
			});
			//Push it onto the event array on digitalData object
			window.digitalData = window.digitalData || {};
			window.digitalData.event = window.digitalData.event || [];
			window.digitalData.event.push(ddQuickViewEvent);
			sendCustomEvent("quickView");
		}
	);
}

function changeOption(target) {
	var targetId = $(target).attr("id");
	var idSplit = targetId.split("_");
	var sizeElement = "sizeselection_" + idSplit[1] + "_" + idSplit[2];
	var colorElement = "colorselection_" + idSplit[1] + "_" + idSplit[2];
	var product = idSplit[1] + "Id" + idSplit[2];
	var cantainerId = idSplit[1] + "Product" + idSplit[2];
	var size = $("#" + sizeElement).val();
	//variable:if has size or color
	var hasSize = true;
	var hasColor = true;
	if (size == undefined) {
		//size="";
		hasSize = false;
	}
	var color = $("#" + colorElement).val();
	if (color == undefined) {
		//color="";
		hasColor = false;
	}
	var productId = $("#" + product).val();
	var seoProductId = $("#" + productId + "SeoProductId").val();
	var productType = idSplit[1];
	var count = idSplit[2];
	if (hasSize && hasColor) {
		$("#" + cantainerId).load(
			contextPath + "/browse/include/productItemWrapper.jsp",
			{
				optionSize: size,
				optionColor: color,
				seoProductId: seoProductId,
				productId: productId,
				isInit: false,
				productType: productType,
				count: count
			},
			function() {
				clearRecorders(productId);
			}
		);
	}
	if (!hasSize && hasColor) {
		$("#" + cantainerId).load(
			contextPath + "/browse/include/productItemWrapper.jsp",
			{
				optionColor: color,
				seoProductId: seoProductId,
				productId: productId,
				isInit: false,
				productType: productType,
				count: count
			},
			function() {
				clearRecorders(productId);
			}
		);
	}
	if (hasSize && !hasColor) {
		$("#" + cantainerId).load(
			contextPath + "/browse/include/productItemWrapper.jsp",
			{
				optionSize: size,
				seoProductId: seoProductId,
				productId: productId,
				isInit: false,
				productType: productType,
				count: count
			},
			function() {
				clearRecorders(productId);
			}
		);
	}
}

function changeLocation(target) {
	var targetId = $(target).attr("id");
	var idSplit = targetId.split("_");
	var product = "Id" + idSplit[1];
	var cantainerId = "class" + idSplit[1];
	var location = $(target).val();
	var productId = $("#" + product).val();
	var seoProductId = $("#" + productId + "SeoProductId").val();
	var count = idSplit[1];
	$("#" + cantainerId).load(
		contextPath + "/browse/include/classItemWrapper.jsp",
		{
			seoProductId: seoProductId,
			classId: productId,
			isInit: false,
			location: location,
			count: count
		},
		function() {
			clearRecorders(productId);
		}
	);
}

function promptUserToChoose(productId, sizeId, colorId) {
	if (sizeId == "" || colorId == "") {
		return 0;
	}
	var size = $(".product-optionsSize-current > span").html();
	var color = $(".product-optionsColor-current > span").html();

	var suff = "ChooseError";
	var suffix = "ChooseErrorMessage";
	var selectColor = "Please choose a color.";
	var selectSize = "Please choose a size.";

	if (sizeId == "notHasThisSizeId" && colorId != undefined) {
		if (color == "") {
			$("#" + productId + suffix).html(selectColor);
			$("#" + productId + suff).show();
			return 1;
		}
		return 0;
	}
	if (sizeId != undefined && colorId == "notHasThisColorId") {
		if (size == "") {
			$("#" + productId + suffix).html(selectSize);
			$("#" + productId + suff).show();
			return 1;
		}
		return 0;
	}
	if (size != undefined && color != undefined) {
		if (size == "") {
			$("#" + productId + suffix).html(selectSize);
			$("#" + productId + suff).show();
			return 1;
		}
		if (color == "") {
			$("#" + productId + suffix).html(selectColor);
			$("#" + productId + suff).show();
			return 1;
		}
		return 0;
	}
}

function promptChooseLocation(productId, locationId) {
	var location = $("#" + locationId);

	var suff = "ChooseError";
	var suffix = "ChooseErrorMessage";
	var selectLocation = "Please choose a location.";

	if (location != undefined) {
		if (location.val() == "") {
			$("#" + productId + suffix).html(selectLocation);
			$("#" + productId + suff).show();
		}
	}
}

function promptChooseDesign(productId) {
	var suff = "ChooseError";
	var suffix = "ChooseErrorMessage";
	var design = "Please choose a design.";
	$("#" + productId + suffix).html(design);
	$("#" + productId + suff).show();
}

//- Turnto calls this function. Needs to be removed from TurnTo in next TurnTo update.
window.showRnRTab = function(evt) {
	//- emptiness...
};

var pdpTracker = (window.pdpTracker = function(category, action, title) {
	//console.log('category: ' + category + ', action: ' + action + ', title: ' + title);
	if (typeof _gaq == "undefined") return;
	// e.g: _gaq.push(['_trackEvent', 'Videos', 'Play', 'Baby\'s First Birthday']);
	_gaq.push(["_trackEvent", category, action, title]);
});
