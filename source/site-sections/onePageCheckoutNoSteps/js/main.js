//- LOAD LIBS
//- ---------------------------------------------
(function($) {
	//- Environment variables and references
	var js = base.path.js;

	//  * * *
	//- Libraries
	var aLibs = {
		modernizr: js + "vendor/modernizr.min.js",
		jquery: js + "vendor/jquery-1.7.2.min.js",
		poly: []
	};

	var Ready = {
		modernizr: function() {
			//- GLOBAL INTERACTION EVENTS
			base.events = {
				click: Modernizr.touch ? "touchend" : "click",
				hoverstart: Modernizr.touch ? "touchstart" : "mouseenter",
				hoverend: Modernizr.touch ? "touchend" : "mouseleave"
			};

			//- jQuery loaded from head ?
			typeof jQuery == "function"
				? Ready.jquery()
				: $script(aLibs.jquery, "jquery", function() {
						$ = jQuery;
						$(function() {
							Ready.jquery();
						});
					});
		},
		jquery: function() {
			//- bind global event listeners
			Ready.events();

			//- Load polyfills, plugins then app modules
			Ready.polyfills(function() {
				aLibs["poly"].length
					? $script(aLibs["poly"], "poly", function() {
							$("input, textarea").placeholder();
							Ready.app();
						})
					: Ready.app();
			});
		},
		polyfills: function(callback) {
			//- polyfills
			Modernizr.input.placeholder ||
				aLibs.poly.push(js + "/jquery.placeholder.min.js");
			//-

			callback();
		},
		events: function() {},
		checkoutStickyMiniCartInit: function() {
			$(document).ready(function() {
				setTimeout(function() {
					$(".orderSumTotalRow").sticky({
						topSpacing: 5,
						zIndex: 999
					});
				}, 1500);
			});
		},
		checkoutPageInit: function() {
			$("#ccBillToShipAddr").change(function() {
				$(".shippingAddressBilling").slideToggle({
					duration: 400,
					easing: "swing"
				});
			});
		},
		shoppingCartPageInit: function() {
			//SHOPPING CART

			//show/hide zip field
			$(".estimateShipTax").click(function() {
				$(".estZipFieldForm").slideToggle({
					duration: 400,
					easing: "swing"
				});
			});

			//if zip field has something in it, make sure it's displayed
			$("#shippingZipCode").val() ? $(".estimateShipTax").click() : "";
		},
		app: function() {
			var me = this;

			//Init checkout sticky miniCart
			me.checkoutStickyMiniCartInit();

			$(document).ready(function() {
				//- --------------------------
				//- Taken from singleShippingGroup.jsp...
				/*
                var n = 420;
                switch(true) {
                    case $.browser.mozilla:
                        n = 390;
                        break;
                    case $.browser.msie:
                        n = 350;
                        break;
                }
                $('html, body').animate({scrollTop:n}, 'slow');*/
				//- /Taken from singleShippingGroup.jsp...

				//- --------------------------

				//Start shopping cart page plugins
				me.shoppingCartPageInit();

				me.checkoutPageInit();

				//- Taken from functions.js...
				if ($.browser.msie) {
					Object.keys = function(that) {
						var returnArr = [];
						for (var x in that) {
							if (typeof that[x] != "undefined") {
								returnArr.push(x);
							}
						}
						return returnArr;
					};
				}
				// This is to ensure that the .change() event fires in IE 6, 7, and 8 for drop down lists.
				// In the future it might become necessary to add this functionality to checkboxes and/or radio buttons
				if ($.browser.msie && parseInt($.browser.version) < 9) {
					$("select").on("blur, keyup, propertychange", function() {
						$(this).trigger("change");
					});
				}

				// Start Async Management

				// To better manager async requests and have more control over them, we are adding the references to an
				// array on request send and removing them on complete.  This allows us to stop all callbacks (ignore return).
				var asyncRequests = [];
				$(document)
					.ajaxSend(function(e, jqxhr, settings) {
						asyncRequests.push(jqxhr);
						return true;
					})
					.ajaxComplete(function(e, xhr, settings) {
						for (var i = 0; i < asyncRequests.length; i++) {
							if (asyncRequests[i] === xhr)
								asyncRequests.splice(i, 1);
						}
						return true;
					});
				//- /Taken from functions.js...

				//- --------------------------
				//- Start app
				var eNode;

				//fire primary opc plugin
				eNode = $("body#checkout");
				!eNode.length ||
					eNode.opc({
						scrollToErrors: true
					});

				eNode = $("body#checkoutconfirmation");
				!eNode.length || eNode.thankyou();

				//fire footer plugin
				$("#footer").footer();
			});
		}
	};

	//- Modernizr loaded in document head ?
	typeof Modernizr == "object"
		? Ready.modernizr()
		: $script(aLibs.modernizr, "modernizr", function() {
				Ready.modernizr();
			});
})(jQuery);
