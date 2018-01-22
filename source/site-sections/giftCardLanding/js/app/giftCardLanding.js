$(function() {
	/*** Reload ***/
	// Scroll to top on refresh
	window.onload = function() {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	};

	// Validation variables
	var validType = false;
	var validTypeSet = "";
	var validAmount = false;
	var validDesign = true;
	var validQuantity = false;
	var validName = true;
	var validEmail = false;
	// Set validDate to true since default state is with "SEND ASAP" selected
	var validDate = true;
	// add rlp
	$("#dialog-message").dialog({
		modal: true,
		buttons: {
			Ok: function() {
				$(this).dialog("close");
			}
		}
	});

	//- Google Analytics tracking
	var $scope = $("#giftCardsForm"),
		_t = GCTracking.ga,
		isLabel = function(evt) {
			return evt.target.nodeName.toLowerCase() == "label";
		},
		f = function(s) {
			return $scope.find(s);
		};

	// Initialize Product drop-downs
	displayProductDropDown("classic", "giftCardsProductSelect-classic");
	displayProductDropDown("eGift", "giftCardsProductSelect-eGift");
	/*** Review fixed element ***/

	$("fieldset#giftCardsReview").css(
		"left",
		$("div.giftCardsSidebar").position().left
	);
	$(window).resize(function() {
		$("fieldset#giftCardsReview").css(
			"left",
			$("div.giftCardsSidebar").position().left
		);
	});
	$(window).scroll(function() {
		$("fieldset#giftCardsReview").css(
			"top",
			Math.max(0, 870 - $(this).scrollTop()) + 10
		);
	});

	/*** Disable form submission on Enter press ***/
	$("form#giftCardsForm").on("keyup keypress", function(e) {
		var code = e.keyCode || e.which;
		if (code == 13) {
			e.preventDefault();
			return false;
		}
	});
	$(".deactivateSubmitButton").on("click", function(e) {
		e.preventDefault();
	});
	$("#giftCardsSubmit .addToRegistry").on("click", function(e) {
		//addToRegistryGiftCard();
	});
	// Check GC Balance event handlers
	$("body").on("click", "#checkBalance", function(evt) {
		//- GA
		var e = _t.checkbalance.showForm;
		_t.track(e[0], e[1], e[2]);

		$("#checkBalance").hide("slow");
		$("#acctCheckCardBalanceLookup").show("slow");
		$("#checkBalance").addClass("selected");
		$("#giftCardBalanceNumberId").show();
		$("#giftCrdBanlancePinNumberId").show();

		$("#heckBlanceButtonId").show();
		$("#acctCheckCardBalanceLookup .cancel").show();
		$("#acctCheckCardBalanceLookup .clear").hide();
		$("#remainingBalanceId").hide();
	});
	$("body").on("click", "#acctCheckCardBalanceLookup .cancel", function(e) {
		e.preventDefault();
		$("#giftCardBalanceNumberId").val("");
		$("#giftCardBanlancePinNumberId").val("");
		$("#checkBalance").show("slow");
		$("#acctCheckCardBalanceLookup").hide("slow");
		$("#checkBalance").removeClass("selected");
		$(".message.haserror").remove();
		return false;
	});
	$("body").on("click", "#acctCheckCardBalanceLookup .clear", function(e) {
		e.preventDefault();
		$("#giftCardBalanceNumberId").val("");
		$("#giftCardBanlancePinNumberId").val("");
		$("#remainingBalanceId").empty();
		$("#checkBlanceButtonId").show();
		$("#acctCheckCardBalanceLookup .clear").hide();
		$("#acctCheckCardBalanceLookup .cancel").show();
		$(".message.haserror").remove();
		return false;
	});

	/*** Hero ***/
	// Input switching and class setting for gift card type selection
	$("fieldset#giftCardsType .giftCardsTypeWrap")
		.off("click")
		.on("click", function(evt) {
			$(this)
				.children("input")
				.prop("checked", true);
			$(this).addClass("giftCardType-selected");
			$("#giftCardsReview").css("visibility", "visible");
			$(this)
				.siblings()
				.removeClass("giftCardType-selected");
			// Show hidden form below amount field
			$("form#giftCardsForm fieldset").show();
			// Update visible form and review section
			$("form#giftCardsForm fieldset").show();
			// Validate type
			validType = true;
			validTypeSet = $(this).attr("id");
			var productType = validTypeSet.substring(10);

			switch ($(this).attr("id")) {
				case "giftCards-classic":
					//- GA
					var e = _t.select.classic;
					isLabel(evt) || _t.track(e[0], e[1], e[2]);

					$("#type").val("classic");
					$("form#giftCardsForm .giftCards-eGiftOnly").hide();
					$("form#giftCardsForm .giftCards-classicOnly").show();
					// Set review quantity
					validateQuantity();
					$(
						"fieldset#giftCardsReview span#giftCardsReview-type"
					).text("classic");
					$(
						"div#giftCardsReview-preview>img#giftCardsReview-previewPackage"
					).attr(
						"src",
						"/images/2014_giftcard_slices/giftcards_classic_preview.jpg"
					);
					$(
						"div#giftCardsReview-preview>img#giftCardsReview-previewPackage"
					).attr(
						"onerror",
						"this.onerror=null;this.src='/images/2014_giftcard_slices/giftcards_classic_preview.jpg'"
					);
					$("div#giftCardsReview-preview").removeClass(
						"egiftPreview"
					);
					$("div#giftCardsReview-preview").addClass("classicPreview");

					$("#giftCardsProductSelect-classic").show();
					$("#giftCardsProductSelect-classic").addClass("active");
					$("#giftCardsProductSelect-eGift").hide();
					$("#giftCardsProductSelect-eGift").removeClass("active");
					validateGiftCardForm();
					break;
				case "giftCards-eGift":
					//- GA
					var e = _t.select.egift;
					isLabel(evt) || _t.track(e[0], e[1], e[2]);

					$("#type").val("eGift");
					$("form#giftCardsForm .giftCards-eGiftOnly").show();
					$("form#giftCardsForm .giftCards-classicOnly").hide();
					// Set review quantity
					$("span#giftCardsReview-quantity").text("1");
					$(
						"fieldset#giftCardsReview span#giftCardsReview-plural"
					).text("");
					$(
						"fieldset#giftCardsReview span#giftCardsReview-pluralEach"
					).text("");
					$(
						"fieldset#giftCardsReview span#giftCardsReview-type"
					).text("E-Gift");
					$(
						"div#giftCardsReview-preview>img#giftCardsReview-previewPackage"
					).attr(
						"src",
						"/images/2014_giftcard_slices/giftcards_egift_preview.jpg"
					);
					$(
						"div#giftCardsReview-preview>img#giftCardsReview-previewPackage"
					).attr(
						"onerror",
						"this.onerror=null;this.src='/images/2014_giftcard_slices/giftcards_egift_preview.jpg'"
					);
					$("div#giftCardsReview-preview").addClass("egiftPreview");
					$("div#giftCardsReview-preview").removeClass(
						"classicPreview"
					);

					$("#giftCardsProductSelect-eGift").show();
					$("#giftCardsProductSelect-eGift").addClass("active");
					$("#giftCardsProductSelect-classic").hide();
					$("#giftCardsProductSelect-classic").removeClass("active");
					validateGiftCardForm();
					break;
			}
			// add rlp
			var $this = $("#giftCardsDesignSelect .active select");
			var firstOption = $this.first().val();
			$this.val("all-" + productType);
			displayProductDesigns("giftCardsDesignSelectCarousel-designs");
			$("div#giftCardsDesignSelectCarousel-designs img").hide();
			$(
				"div#giftCardsDesignSelectCarousel-designs img.giftCardCategory-all-" +
					$("#type").val()
			).show();
			// Scroll page to amount selection
			$("html, body").animate(
				{
					scrollTop: $("fieldset#giftCardsAmount").offset().top
				},
				1000
			);
		});
	/*** Amount selection ***/
	// Reset custom input
	$(
		"fieldset#giftCardsAmount div#giftCardsAmountCustom input#giftCardsAmountSelect-custom"
	).val("");
	// Value copying and class setting for gift card amount selection
	$("fieldset#giftCardsAmount div#giftCardsAmountSelection label").click(
		function(evt) {
			$(this).addClass("giftCardAmount-selected");
			$(this)
				.siblings()
				.removeClass("giftCardAmount-selected");
			$(
				"fieldset#giftCardsAmount div#giftCardsAmountCustom input#giftCardsAmountSelect-custom"
			).val(
				$(this)
					.children("input")
					.attr("value")
			);

			//- GA
			var e = _t.amount.predefined;
			isLabel(evt) ||
				_t.track(
					e[0],
					e[1],
					e[2] +
						$(this)
							.find('input[name="giftCardsAmountSelect"]')
							.val()
				);

			validateCustomAmount("blur");
			// Copy amount to review section
			$("fieldset#giftCardsReview span#giftCardsReview-amount")
				.text(
					"in the amount of $" +
						$(this)
							.children("input")
							.attr("value")
				)
				.show();
			validAmount = true;
			validateGiftCardForm();
		}
	);
	// Value validation, non-numeric character stripping from beginning of input, and selection activation for custom gift card amounts
	// Get possible values for pre-set gift card amounts
	var giftCardValues = [];
	$("div#giftCardsAmountSelection label").each(function() {
		giftCardValues.push($.trim($(this).text()).replace("$", ""));
	});
	// Watch for blur and input custom amount
	$(
		"fieldset#giftCardsAmount div#giftCardsAmountCustom input#giftCardsAmountSelect-custom"
	).on({
		// keyup: function() {
		// 	validateCustomAmount("keyup");  // Removed for SLT-1617
		// },
		blur: function() {
			validateCustomAmount();

			//- GA
			var e = _t.amount.custom;
			_t.track(e[0], e[1], e[2] + $(this).val());
		},
		change: function() {
			var el = $(this);
			validateCustomAmount() ||
				(function(e, f) {
					f(e[0], e[1], e[2] + el.val());
				})(_t.amount.error, _t.track);
		}
	});
	// Function to validate custom amount entry and perform correct UI changes on result
	function validateCustomAmount(type) {
		var giftCardCustomRegex = /^[0-9]*$/;
		var customEntry = $(
			"fieldset#giftCardsAmount div#giftCardsAmountCustom input#giftCardsAmountSelect-custom"
		);
		// // Don't validate if entry by keyup and only one digit
		// if(type == "keyup" && customEntry.val().length <= 1) { return false; } // Removed for SLT-1617
		// // Strip $ from first character, if present
		// if(customEntry.val().charAt(0) == "$") {
		//     customEntry.val(customEntry.val().replace("$",""));
		// }  // Removed per SLT-1629
		// Custom amount validation
		if (customEntry.val() == "") {
			// Blank amount: Remove selected amount, hide pre-set selections, invalidate form
			$(
				"fieldset#giftCardsAmount div#giftCardsAmountSelection label"
			).removeClass("giftCardAmount-selected");
			$("span#giftCardsReview-previewAmount").text("");
			validAmount = false;
			validateGiftCardForm();
		} else if (
			!giftCardCustomRegex.test(customEntry.val()) ||
			customEntry.val() < 10 ||
			customEntry.val() > 500
		) {
			// Failed validation: show error message, change input border, deactivate active pre-set card amounts, hide review total
			$(
				"form#giftCardsForm fieldset#giftCardsAmount div#giftCardsAmountCustom span#giftCardsAmountCustomError"
			).show();
			$(
				"fieldset#giftCardsAmount div#giftCardsAmountCustom input#giftCardsAmountSelect-custom"
			).css({ border: "1px solid red", color: "red" });
			$(
				"fieldset#giftCardsAmount div#giftCardsAmountSelection label"
			).removeClass("giftCardAmount-selected");
			$("fieldset#giftCardsReview span#giftCardsReview-amount").hide();
			$("span#giftCardsReview-previewAmount").text("");
			validAmount = false;
			validateGiftCardForm();
		} else {
			// Passed validation: hide error message, revert input border, and activate pre-set card amounts if applicable
			$(
				"form#giftCardsForm fieldset#giftCardsAmount div#giftCardsAmountCustom span#giftCardsAmountCustomError"
			).hide();
			$(
				"fieldset#giftCardsAmount div#giftCardsAmountCustom input#giftCardsAmountSelect-custom"
			).css({ border: "", color: "" });
			// Copy amount to review section
			$("fieldset#giftCardsReview span#giftCardsReview-amount")
				.text("in the amount of $" + customEntry.val())
				.show();
			$("span#giftCardsReview-previewAmount").text(
				"$" + customEntry.val()
			);
			// Handle activating and deactivating preset amounts
			if (giftCardValues.indexOf(customEntry.val()) != -1) {
				var giftCardAmountSelectionLabel =
					"fieldset#giftCardsAmount div#giftCardsAmountSelection label[for='giftCardsAmountSelect-" +
					customEntry.val() +
					"']";
				$(giftCardAmountSelectionLabel)
					.addClass("giftCardAmount-selected")
					.siblings()
					.removeClass("giftCardAmount-selected");
			} else {
				$(".giftCardAmount-selected").removeClass(
					"giftCardAmount-selected"
				);
			}
			validAmount = true;
			validateGiftCardForm();
		}

		return validAmount;
	}
	/*** Design selection ***/
	// Reset category dropdown
	$("div#giftCardsDesignSelect select").val("giftCardCategory-all");
	// Reset quantity fiel
	$("div#giftCardsDesignQuantity input").val("1");
	// Hide design area if there is only one design available
	function countDesigns() {
		if ($("div#giftCardsDesignSelectCarousel-designs>img").length <= 1) {
			$("fieldset#giftCardsDesign").hide();
		} else {
			$("fieldset#giftCardsDesign").show();
		}
	}
	// Set default class image as initial design selection
	setGiftCardDesignChoice(
		$("div#giftCardsDesignSelectCarousel-designs img.giftCardDesignDefault")
	);
	// Watch for  new design image click
	$("body").on(
		"click",
		"#giftCardsDesignSelectCarousel-designs img",
		function() {
			// Update classes and selections
			$(this)
				.siblings()
				.removeClass("giftCardDesignSelected");
			$(this).addClass("giftCardDesignSelected");

			//- GA
			var e = _t.design.select;
			_t.track(e[0], e[1], e[2] + $(this).attr("data-name"));

			setGiftCardDesignChoice($(this));
		}
	);

	// Watch for category change
	$("body").on("change", "div#giftCardsDesignSelect select", function() {
		//- GA
		var e = _t.design.filter;
		_t.track(e[0], e[1], e[2] + $(this).val());

		// Update available designs
		$("div#giftCardsDesignSelectCarousel-designs img").hide();
		$(
			"div#giftCardsDesignSelectCarousel-designs img." +
				"giftCardCategory-" +
				$(this).val()
		).show();
		// Re-count available designs, de/activate arrows appropriately
		adjustGiftCardDesigns("giftCardCategory-" + $(this).val());
	});
	// Watch for arrow click
	$("div.giftCardsDesignSelectCarousel-arrow div").click(function() {
		// Bump design image locations left/right depending on arrow
		var designImages = $(
			"div#giftCardsDesignSelectCarousel-designs>img:visible"
		);
		switch ($(this).attr("class")) {
			case "arrow-left":
				designImages.css("left", "+=354");
				break;
			case "arrow-right":
				designImages.css("left", "-=354");
				break;
		}
		// Handle display of arrows
		var imageLoc = parseInt(designImages.css("left"));
		if (imageLoc < 0) {
			$("div.giftCardsDesignSelectCarousel-arrow div.arrow-left").show();
		} else if (imageLoc == 0) {
			$("div.giftCardsDesignSelectCarousel-arrow div.arrow-left").hide();
		}
		var farRight =
			Math.round(
				$("div#giftCardsDesignSelectCarousel-designs img:visible")
					.length / 2
			) *
				-118 +
			354;
		if (imageLoc <= farRight) {
			$("div.giftCardsDesignSelectCarousel-arrow div.arrow-right").hide();
		} else {
			$("div.giftCardsDesignSelectCarousel-arrow div.arrow-right").show();
		}
	});
	// Function to handle available design count and arrow display
	function adjustGiftCardDesigns(category) {
		// Remove previous <br> tags
		if (category.indexOf("-all") < 0) {
			// filter by eGift or classic types in addition to the them
			category =
				category + "." + "giftCardCategory-all-" + $("#type").val();
		}
		$("div#giftCardsDesignSelectCarousel-designs")
			.find("br")
			.remove();
		// Reset previous image left attribute
		$("div#giftCardsDesignSelectCarousel-designs>img").css("left", "");
		// Get number of design images
		var designCount = $(
			"div#giftCardsDesignSelectCarousel-designs img." + category
		).length;
		if (designCount <= 6) {
			$(
				"div#giftCardsDesignSelectCarousel-designs img." +
					category +
					":eq(2)"
			).after("<br />");
		}
		if (designCount > 6) {
			// Add <br /> after every (n/2) [rounded up] design choices (allows for correct wrapping) if more than 3
			$(
				"div#giftCardsDesignSelectCarousel-designs img." +
					category +
					":eq(" +
					Math.floor(designCount / 2) +
					")"
			).after("<br />");
			// Show right arrow
			$("div.giftCardsDesignSelectCarousel-arrow div.arrow-left").hide();
			$("div.giftCardsDesignSelectCarousel-arrow div.arrow-right").show();
		} else {
			// Hide arrows
			$("div.giftCardsDesignSelectCarousel-arrow div").hide();
		}
	}
	// add rlp
	// Design type dropdown is generated whenever the user selects a product type
	function displayProductDropDown(productType, htmlDiv) {
		var grId = $("#grId").val();
		var productId = "";
		var themeId = "";
		switch (productType) {
			case "classic":
				var productIds = $("#classicProductIds").val();
				var themeIds = $("#classicThemeIds").val();
				break;
			case "eGift":
				var productIds = $("#eGiftProductIds").val();
				var themeIds = $("#eGiftThemeIds").val();
				break;
		}
		var includeURL = contextPath + "/browse/include/productSelect.jsp?";
		$.post(
			includeURL,
			{
				productType: "all-" + productType,
				themeIds: themeIds,
				themeId: themeId,
				productIds: productIds,
				productId: productId,
				grId: grId
			},
			function(result) {
				$("#" + htmlDiv).html(result);
			}
		);
	}
	// Gift Card designs are generated whenever the user selects a product type
	function displayProductDesigns(htmlDiv) {
		var productId = $("#giftCardsDesignSelect .active select")
			.find(":selected")
			.val();
		var themeId = $("#giftCardsDesignSelect .active select")
			.find(":selected")
			.val();
		var productType = $("#type").val();
		// if no product is selected, default to all products, otherwise just use the skus for the selected product
		if (1 == 0 && (themeId > "" && themeId.indexOf("all-") < 0)) {
			var themeIds = themeId;
			var productIds = "";
		} else {
			switch (productType) {
				case "classic":
					var productIds = "classic," + $("#classicProductIds").val();
					var themeIds = "classic," + $("#classicThemeIds").val();
					break;
				case "eGift":
					var productIds = "eGift," + $("#eGiftProductIds").val();
					var themeIds = "eGift," + $("#eGiftThemeIds").val();
					break;
			}
		}
		// use all product ids
		var skuId = "";
		var grId = $("#grId").val();
		var includeURL =
			contextPath + "/browse/include/productDesignSelect.jsp?";
		$.post(
			includeURL,
			{
				themeIds: themeIds,
				themeId: themeId,
				productIds: productIds,
				skuId: skuId,
				grId: grId
			},
			function(result) {
				$("#" + htmlDiv).html(result);
				var productType = $("#type").val();
				adjustGiftCardDesigns("giftCardCategory-all-" + productType);
				var $defaultSelected = $(
					"div#giftCardsDesignSelectCarousel-designs img.giftCardCategory-all-" +
						productType
				).first();
				setGiftCardDesignChoice($defaultSelected);
				$defaultSelected
					.siblings()
					.removeClass("giftCardDesignSelected");
				$defaultSelected.addClass("giftCardDesignSelected");
				// Check number of designs
				countDesigns();
			}
		);
	}
	// Function to set the design choice image and name
	function setGiftCardDesignChoice(choice) {
		if ($("#type").val() == "eGift" && choice.length > 0) {
			var imageName = $(choice).attr("src");
			var pos = imageName.lastIndexOf(".");
			var previewImageName = imageName.substring(0, pos) + "_preview.jpg";
			$(
				"div#giftCardsReview-preview>img#giftCardsReview-previewPackage"
			).attr("src", previewImageName);
			$(
				"div#giftCardsReview-preview>img#giftCardsReview-previewPackage"
			).attr(
				"onerror",
				"this.src='/images/2014_giftcard_slices/giftcards_egift_preview.jpg'"
			);
		}

		$("div#giftCardDesignSelectChoice>img").attr(
			"src",
			$(choice).attr("src")
		);
		var productId = $(choice).data("productid");
		$("div#giftCardDesignSelectChoice").data("productid", productId);
		var skuId = $(choice).data("skuid");
		$("div#giftCardDesignSelectChoice").data("skuid", skuId);
		$("fieldset#giftCardsReview>img").attr("src", $(choice).attr("src"));
		$("div#giftCardsReview-preview>img#giftCardsReview-previewDesign").attr(
			"src",
			$(choice).attr("src")
		);
		$("div#giftCardsDesignChoice span").text(choice.data("name"));
		$("fieldset#giftCardsReview p#giftCardsReview-design span").text(
			choice.data("name")
		);
	}
	// Watch for quantity change
	$("div#giftCardsDesignQuantity input").on({
		// keyup: function() { validateQuantity(); },
		blur: function() {
			validateQuantity();
		}
	});
	function validateQuantity() {
		// Check if input is valid number
		var quantityRegex = /^([1-9]|[1-9][0-9])$/;
		if (!quantityRegex.test($("div#giftCardsDesignQuantity input").val())) {
			// Invalid input
			$("div#giftCardsDesignQuantity input").css(
				"border",
				"1px solid red"
			);
			$("div#giftCardsDesignQuantity span").text(
				"Please enter a number between 1 and 99"
			);
			$("fieldset#giftCardsReview span#giftCardsReview-quantity").text(
				"1"
			);
			$("fieldset#giftCardsReview span#giftCardsReview-plural").text("");
			$("fieldset#giftCardsReview span#giftCardsReview-pluralEach").text(
				""
			);
			validQuantity = false;
		} else {
			// Valid input
			$("div#giftCardsDesignQuantity input").css("border", "");
			$("div#giftCardsDesignQuantity span").text("");
			$("fieldset#giftCardsReview span#giftCardsReview-quantity").text(
				$("div#giftCardsDesignQuantity input").val()
			);
			if ($("div#giftCardsDesignQuantity input").val() > 1) {
				$("fieldset#giftCardsReview span#giftCardsReview-plural").text(
					"s"
				);
				$(
					"fieldset#giftCardsReview span#giftCardsReview-pluralEach"
				).text(" each");
			} else {
				$("fieldset#giftCardsReview span#giftCardsReview-plural").text(
					""
				);
				$(
					"fieldset#giftCardsReview span#giftCardsReview-pluralEach"
				).text("");
			}
			validQuantity = true;
			validateGiftCardForm();
		}
	}

	/*** Personalize ***/
	// Clear message inputs and email
	$("fieldset#giftCardsPersonalize input").val("");
	// Name validation regex
	var nameRegex = /^([a-zA-Z0-9\s'.-])+$/;
	$(
		"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientName"
	).change(function() {
		// Check that name format is acceptable
		if (
			$(
				"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientName"
			).val() != "" &&
			!nameRegex.test(
				$(
					"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientName"
				).val()
			)
		) {
			// Failed name validation
			$(
				"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientName"
			).css("border", "1px solid red");
			$(
				"div#giftCardsPersonalizeRecipient span#giftCardsPersonalize-recipientNameError"
			).text(
				"Limit 40 alphanumeric characters, '.', ''', '-' and blank space"
			);
			$("span#giftCardsReview-previewRecipent").text("");
			$("p#giftCardsReview-recipient span#giftCardsReview-recipientName")
				.text("")
				.hide();
			validName = false;
			validateGiftCardForm();
		} else {
			// Passed name validation
			$(
				"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientName"
			).css("border", "");
			$(
				"div#giftCardsPersonalizeRecipient span#giftCardsPersonalize-recipientNameError"
			).text("");
			// Copy name to review
			$("p#giftCardsReview-recipient span#giftCardsReview-recipientName")
				.text(
					"to " +
						$(
							"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientName"
						).val()
				)
				.css("display", "block");
			$("span#giftCardsReview-previewRecipent").text(
				$(
					"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientName"
				).val()
			);
			validName = true;
			validateGiftCardForm();
		}
	});
	// Email validation regex
	var emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	$("div#giftCardsPersonalizeRecipient input:nth-child(n+3)").on(
		"blur",
		function() {
			// Check that initial email format is correct
			if (
				$(
					"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientEmail"
				).val() != "" &&
				!emailRegex.test(
					$(
						"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientEmail"
					).val()
				)
			) {
				// Failed email validation
				$(
					"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientEmail"
				).css("border", "1px solid red");
				$(
					"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientEmailConfirm"
				).css("border", "");
				$("span#giftCardsPersonalize-emailError").text(
					"Please enter a valid email address"
				);
				$(
					"p#giftCardsReview-recipient span#giftCardsReview-recipientEmail"
				).hide();
				$("span#giftCardsPersonalize-emailConfirmError").text("");
				validEmail = false;

				//- GA
				var e = _t.email.error;
				_t.track(e[0], e[1], e[2]);

				return false;
			} else {
				// Passed validation
				$(
					"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientEmail"
				).css("border", "");
				$("span#giftCardsPersonalize-emailError").text("");
			}
			// Check that email and confirmation match
			if (
				$(
					"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientEmail"
				).val() !=
				$(
					"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientEmailConfirm"
				).val()
			) {
				if (
					$(
						"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientEmailConfirm"
					).val() == ""
				) {
					validEmail = false;
					return false;
				}
				// Failed match
				$(
					"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientEmailConfirm "
				).css("border", "1px solid red");
				$("span#giftCardsPersonalize-emailConfirmError").text(
					"Both emails should be the same"
				);
				$(
					"p#giftCardsReview-recipient span#giftCardsReview-recipientEmail"
				).hide();
				validEmail = false;

				//- GA
				var e = _t.email.mismatch;
				_t.track(e[0], e[1], e[2]);

				validateGiftCardForm();
			} else {
				// Don't allow blank entries
				if (
					$(
						"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientEmailConfirm"
					).val() == ""
				) {
					validEmail = false;
					return false;
				}
				// Passed match
				$(
					"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientEmailConfirm"
				).css("border", "");
				$("span#giftCardsPersonalize-emailConfirmError").text("");
				// Copy email to Review
				$(
					"p#giftCardsReview-recipient span#giftCardsReview-recipientEmail"
				)
					.text(
						"at " +
							$(
								"div#giftCardsPersonalizeRecipient input#giftCardsPersonalize-recipientEmail"
							).val()
					)
					.css("display", "block");
				$(
					"p#giftCardsReview-recipient span#giftCardsReview-recipientEmail"
				).css("display", "block");
				validEmail = true;
				// Damn race conditions
				// no swearing!!
				validateGiftCardForm();
			}
		}
	);
	// Watch for message input
	$("div#giftCardsPersonalizeMessage input")
		.change(function() {
			var messageLine = $(this)
				.attr("id")
				.substr($(this).attr("id").length - 1);
			$(
				"p#giftCardsReview-message span#giftCardsReview-messageLine" +
					messageLine
			).text($(this).val());
			$(
				"div#giftCardsReview-preview span#giftCardsReview-previewMessageLine" +
					messageLine
			).text($(this).val());
			// Check if inputs are blank for review display
			var inputContent = false;
			$("div#giftCardsPersonalizeMessage input").each(function() {
				if ($.trim($(this).val()) != "") {
					inputContent = true;
				}
			});
			if (inputContent) {
				$("p#giftCardsReview-message").show();
			} else {
				$("p#giftCardsReview-message").hide();
			}
		})
		.blur(function(evt) {
			//- GA
			var e = _t.message;
			_t.track(
				e[0],
				e[1] + " " + $("#type").val(),
				"Line: " + $(this).index()
			);
		});

	/*** Datepicker ***/
	// Reset inputs
	$("input#giftCardsDate-sendNow").prop("checked", true);
	$("input#giftCardDatepicker").val("");
	// setRecipientDate(null); // Removed for SLT-1624
	// Setup Datepicker
	// Get tomorrow's date
	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	$("#giftCardDatepicker").datepicker({
		showOn: "button",
		buttonImage: "/styles/images/calender_off.gif",
		buttonImageOnly: true,
		buttonText: "Select date",
		showAnim: "slideDown",
		defaultDate: +1,
		minDate: tomorrow
	});
	// Watch for custom input, select radio if typing
	$(
		"form#giftCardsForm fieldset#giftCards-eGiftDate input#giftCardDatepicker"
	).on("keyup", function() {
		$("input#giftCardsDate-sendLater").prop("checked", true);
	});
	// Check inputted date for past dates and incorrect formats, show error
	$(
		"form#giftCardsForm fieldset#giftCards-eGiftDate input#giftCardDatepicker"
	).change(function() {
		checkDateFormat();
	});
	// Check for date format
	function checkDateFormat() {
		var selectedDate = $("#giftCardDatepicker").datepicker("getDate");
		var dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
		// Check that date passes regex test
		if (!dateRegex.test($("#giftCardDatepicker").val())) {
			// Failed format validation
			$("span#giftCardDatepicker-error").text(
				"Please correct the date's format."
			);
			//$("input#giftCardsDate-sendNow").prop("checked", true);
			$(
				"p#giftCardsReview-recipient span#giftCardsReview-recipientDate"
			).css("display", "none");
			validDate = false;
			validateGiftCardForm();
			return false;
		}
		// Check for past date
		var allowedDate = new Date();
		allowedDate.setDate(allowedDate.getDate() - 1);
		if (selectedDate < allowedDate && selectedDate != null) {
			$("span#giftCardDatepicker-error").text(
				"We can't send gifts to the past (yet).  Please select a future date."
			);
			//$("input#giftCardsDate-sendNow").prop("checked", true);
			$(
				"p#giftCardsReview-recipient span#giftCardsReview-recipientDate"
			).css("display", "none");
			validDate = false;
			validateGiftCardForm();
			return false;
		} else {
			// Date is OK
			$("span#giftCardDatepicker-error").text("");
			$("input#giftCardsDate-sendLater").prop("checked", true);
			setRecipientDate($("#giftCardDatepicker").val());
			validDate = true;
			validateGiftCardForm();
			return true;
		}
	}
	// Watch Send Now select for date reset
	$("input#giftCardsDate-sendNow").change(function() {
		if ($(this).is(":checked")) {
			// setRecipientDate(null);  // Removed for SLT-1624
			// Added ASAP text for SLT-1684
			$("p#giftCardsReview-recipient span#giftCardsReview-recipientDate")
				.text("as soon as possible")
				.css("display", "block");
			$("span#giftCardDatepicker-error").text("");
			validDate = true;
			validateGiftCardForm();
		}

		//- GA
		var e = _t.sendwhen;
		_t.track(e[0], e[1], e[2] + $(this).attr("id"));
	});
	// Select send later input and calendar link for radio button activation - SLT-1696
	$("input#giftCardDatepicker, img.giftCardDatepicker").click(function() {
		$("input#giftCardsDate-sendLater").prop("checked", true);
		if (
			$(this)
				.siblings("input#giftCardDatepicker")
				.val() != ""
		) {
			checkDateFormat();
		} else {
			// Otherwise, form isn't complete
			$(
				"p#giftCardsReview-recipient span#giftCardsReview-recipientDate"
			).css("display", "none");
			validDate = false;
			validateGiftCardForm();
		}
	});
	// Watch Send Later
	$("input#giftCardsDate-sendLater").change(function() {
		if ($(this).is(":checked")) {
			// If there's already a date, check it
			if (
				$(this)
					.siblings("input#giftCardDatepicker")
					.val() != ""
			) {
				checkDateFormat();
			} else {
				// Otherwise, form isn't complete
				$(
					"p#giftCardsReview-recipient span#giftCardsReview-recipientDate"
				).css("display", "none");
				validDate = false;
				validateGiftCardForm();
			}
		}

		//- GA
		var e = _t.sendwhen;
		_t.track(e[0], e[1], e[2] + $(this).attr("id"));
	});

	f("#giftCards-eGiftDate")
		.find("a.big-link")
		.on("click", function(evt) {
			//- GA
			var e = _t.moreinfo;
			_t.track(e[0], e[1], e[2]);
		});

	f("#giftCardsSubmit")
		.find("span")
		.on("click", function(evt) {
			//- GA
			var e = _t.clearall;
			_t.track(e[0], e[1], e[2]);
		});

	// Function to format and display date for recipient
	// Calling function with a null argument will set the date to today's date
	function setRecipientDate(inputDate) {
		if (inputDate == null) {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1;
			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = "0" + dd;
			}
			if (mm < 10) {
				mm = "0" + mm;
			}
			inputDate = mm + "/" + dd + "/" + yyyy;
		}
		var m_names = new Array(
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		);
		var split = inputDate.split("/");
		var date =
			"on " +
			m_names[parseInt(split[0]) - 1] +
			" " +
			split[1] +
			", " +
			split[2];
		$("p#giftCardsReview-recipient span#giftCardsReview-recipientDate")
			.text(date)
			.css("display", "block");
		validDate = true;
		validateGiftCardForm();
	}

	//- add to cart, add to registry, check balance submit
	$("body").on("click", "a.button", function(evt) {
		var e = null,
			cl = evt.target.className;
		switch (true) {
			// add to registry
			case cl.indexOf("addToRegistry") != -1:
				e = _t.addtoregistry;
				break;
			//- add to cart
			case cl.indexOf("addToCart") != -1:
				e = _t.addtocart;
				break;
			// check balance submit
			case evt.target.parentElement.className.indexOf(
				"checkcardcheckbalance"
			) != -1:
				e = _t.checkbalance.submit;
				break;
		}
		e == null || _t.track(e[0], e[1], e[2]);
	});

	/*** Preview slide-out ***/
	$("span#giftCardsReview-previewActivate").click(function(evt) {
		evt.stopPropagation();

		//- GA
		var e = _t.preview;
		_t.track(e[0], e[1], e[2] + $("#type").val());

		previewToggle();
	});
	$("div#giftCardsReview-preview span.giftCardsReview-previewClose").click(
		function(event) {
			previewToggle();
		}
	);

	f("#giftCardsDesignQuantityInput").on("blur", function(evt) {
		//- GA
		var e = _t.quantity;
		_t.track(e[0], e[1], e[2] + $(this).val());
	});

	// Watch for clicks outside of preview
	$("body").click(function() {
		if ($("div#giftCardsReview-preview").is(":visible")) {
			previewToggle();
		}
	});
	// Watch for esc key press
	$(document).keyup(function(e) {
		if (
			e.keyCode == 27 &&
			$("div#giftCardsReview-preview").is(":visible")
		) {
			previewToggle();
		}
	});
	// Prevent events from getting past preview
	$("div#giftCardsReview-preview").click(function(e) {
		e.stopPropagation();
	});
	// Preview slide out behavior
	function previewToggle() {
		$("div#giftCardsReview-preview").slideToggle(300);
		if (
			$("span#giftCardsReview-previewActivate").html() ==
			"<a class='buttonalt'>Preview ›</a>"
		) {
			$("span#giftCardsReview-previewActivate").html(
				"<a class='buttonalt'>Preview ‹</a>"
			);
		} else {
			$("span#giftCardsReview-previewActivate").html(
				"<a class='buttonalt'>Preview ›</a>"
			);
		}
	}
	/*** Submit section activation ***/
	$("form#giftCardsForm fieldset input").change(function() {
		validateGiftCardForm();
	});
	// Function to check all required fields for submit activation
	function validateGiftCardForm() {
		if (validTypeSet == "giftCards-classic") {
			// Classic requirements
			if (validType && validAmount && validDesign && validQuantity) {
				// Page passes validation
				$("form#giftCardsForm fieldset a.button").removeClass(
					"deactivateSubmitButton"
				);
			} else {
				// Page fails validation
				$("form#giftCardsForm fieldset a.button").addClass(
					"deactivateSubmitButton"
				);
			}
		} else {
			// Virtual requrements
			if (
				validType &&
				validAmount &&
				validDesign &&
				validName &&
				validEmail &&
				validDate
			) {
				// Page passes validation
				$("form#giftCardsForm fieldset a.button").removeClass(
					"deactivateSubmitButton"
				);
			} else {
				// Page fails validation
				$("form#giftCardsForm fieldset a.button").addClass(
					"deactivateSubmitButton"
				);
			}
		}
	}
});
