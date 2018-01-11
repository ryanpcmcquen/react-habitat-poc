// Set up video player
if (!window.console)
	console = {
		log: function(m) {}
	};
$(function() {
	// Keep a scope reference to dig faster in dom. Use: f('selector') instead of $('selector') when possible.
	var $win = $(window),
		$scope = $("#product"),
		f = function(selector) {
			return $scope.find(selector);
		},
		productId = f("#productId").val();

	var _gatrackr = PDPTracking.ga;

	var _productLeft = f("#productLeft").productLeft({
		productId: productId,
		$fluidHopup: $("div#product-fluidPopover"),
		containerWidth: parseInt($("#content").width())
	});

	var _productRight = f("#productRight").productRight({
		_productLeft: _productLeft,
		$sku: f("#product-sku"),
		productId: productId
	});

	f("#productCenter").productCenter({
		$videoPopover: f("#product-videoPopover"),
		_productRight: _productRight,
		productId: productId
	});

	//- TurnTo Google Analytics Tracking
	(function(tracking, context) {
		//- Right links
		var el = context.find("#TT3RightLinks a");
		el.eq(0).on("click", function(evt) {
			var t = tracking["reviewmore"];
			pdpTracker(t[0], t[1], t[2]);
		});
		el.eq(1).on("click", function(evt) {
			var t = tracking["myposts"];
			pdpTracker(t[0], t[1], t[2]);
		});

		//- Sorts
		context.find("#TTreviewSort").on("change", function(evt) {
			var t = tracking["sort"];
			pdpTracker(t[0], t[1], $(this).val());
		});
		context.find("#TT3sortBox").on("change", function(evt) {
			var t = tracking["sort"];
			pdpTracker(t[0], t[1], $(this).val());
		});

		//- Show/hide all answers
		context.find("#TTexUgcR a").on("click", function(evt) {
			var t = tracking["seeall"];
			pdpTracker(t[0], t[1], $(this).text());
		});

		//- Search
		/*
		context.find('#TTreviewSearchTerm').on('change', function(evt) {
			var t = tracking['search'];
			pdpTracker(t[0], t[1], $(this).val());
		});*/
	})(PDPTracking.ga.turnto, f("#product-turnTo"));

	//- Back to top Google Analytics Tracking
	(function(tracking, context) {
		//- Show/hide all answers
		context.on("click", function(evt) {
			var t = tracking["click"];
			pdpTracker(t[0], t[1], productId);
		});

		var $footer = $("#footer"),
			footerTop = $footer.position().top,
			scrolledTracked = false;

		$win.scroll(function() {
			if (
				$(window).scrollTop() + $(window).height() > footerTop &&
				!scrolledTracked
			) {
				pdpTracker(tracking.scroll[0], tracking.scroll[1], productId);
				scrolledTracked = true;
			}
		});
	})(PDPTracking.ga.backtotop, f("#productReturnToTop"));

	//- Accessories, Companion on Load count for Google Analytics
	(function(a) {
		$.each(a, function(k, v) {
			var t = PDPTracking["ga"][k]["load"],
				l = v.length;
			!l ||
				pdpTracker(
					t[0],
					t[1],
					l +
						" " +
						k.ucfirst() +
						" product" +
						(l > 1 ? "s" : "") +
						" for " +
						productId
				);

			//- Track clicks
			v.find("a").on("click", function(evt) {
				//- Google Analytics Tracking
				var e = _gatrackr[k]["click"];
				pdpTracker(
					e[0],
					e[1],
					document.location.href + " > " + $(this).attr("href")
				);
			});
		});
	})({
		accessories: f("#product-accessories > div"),
		companion: f("#product-companions > div")
	});

	/*  
    **    Product link widths
    */
	var $productLinks = f("div#product-links");
	var numLinks = $productLinks.find("a").length;
	if (numLinks > 0) {
		$productLinks.find("a").css("width", (990 - numLinks) / numLinks);
	} else {
		$productLinks.hide();
	}

	/*  
    **    Link boxes
    */
	$productLinks.find("a").click(function(evt) {
		//- Google Analytics Tracking
		var e = _gatrackr.documents;
		pdpTracker(e[0], e[1], e[2] + " " + $(this).text() + " " + productId);
	});

	//- NEED HELP DECIDING?
	f("#product-chat a").on("click", function(evt) {
		//- Google Analytics Tracking
		var e = _gatrackr.needhelp;
		pdpTracker(e[0], productId, e[2]);
	});

	//- NEED HELP DECIDING?
	f("#product-chat a").on("click", function(evt) {
		//- Google Analytics Tracking
		var e = _gatrackr.needhelp;
		pdpTracker(e[0], productId, e[2]);
	});

	/*  
	**    Carousel - http://kenwheeler.github.io/slick/
	*/

	try {
		f("#product-recipeSlides-carousel")
			.slick({
				infinite: true,
				slidesToShow: 8,
				slidesToScroll: 8,
				variableWidth: true,
				arrows: true,
				nextArrow: f("#product-recipeSlides a.arrow.right"),
				prevArrow: f("#product-recipeSlides a.arrow.left")
			})
			.on("swipe", function(evt, slick, direction) {
				//- Google Analytics Tracking
				var e = _gatrackr.recipes.swipe;
				pdpTracker(e[0], e[1], e[2] + direction);
			});
	} catch (err) {
		console.log("Slick carousel err: " + err);
	}

	try {
		f("#product-recipeSlides1-carousel1")
			.slick({
				infinite: true,
				slidesToShow: 8,
				slidesToScroll: 8,
				variableWidth: true,
				arrows: true,
				nextArrow: f("#product-recipeSlides1 a.arrow.right"),
				prevArrow: f("#product-recipeSlides1 a.arrow.left")
			})
			.on("swipe", function(evt, slick, direction) {
				//- Google Analytics Tracking
				var e = _gatrackr.recipes.swipe;
				pdpTracker(e[0], e[1], e[2] + direction);
			});
	} catch (err) {
		console.log("Slick carousel err: " + err);
	}

	f("#product-recipeSlides,#product-recipeSlides1")
		.find(".arrow")
		.click(function(evt) {
			//- Google Analytics Tracking
			var e = _gatrackr.recipes.arrows;
			pdpTracker(
				e[0],
				e[1],
				e[2] + ($(this).hasClass("right") ? " Next" : "Prev")
			);
		});

	f(
		'div#product-recipeSlides div.slick-slide:not([data-link=""]),div#product-recipeSlides1 div.slick-slide:not([data-link=""])'
	).click(function() {
		//- Google Analytics Tracking
		var e = _gatrackr.recipes.link;
		pdpTracker(
			e[0],
			e[1],
			e[2] + productId + " - " + $(this).attr("data-link")
		);

		document.location = $(this).attr("data-link");
	});

	/*  
	**    Companion/Accessories products div click
	*/

	f("div.product-otherItems > div").on("click", function(evt) {
		base.fn.redirect(
			$(this)
				.find("a:last-child")
				.attr("href")
		);
	});

	/*  
	**    Return to top
	*/
	var $returnToTop = f("div#productReturnToTop");
	$win.scroll(function() {
		$returnToTop[
			$scope.offset().top < $(this).scrollTop() ? "show" : "hide"
		]();
	});

	$returnToTop.click(function() {
		$scope.scroll2();
	});
});
