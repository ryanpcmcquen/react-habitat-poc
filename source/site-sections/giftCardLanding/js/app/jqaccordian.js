//
//  Uses jQuery Accordion UI
//

$(document).ready(function() {
	$("#recipenav .head").each(function() {
		$(this).click(function() {
			$(this)
				.next()
				.animate({ height: "toggle", opacity: "toggle" }, "slow");
			return false;
		});
		if (
			$(this)
				.next()
				.hasClass("initial-selected")
		) {
			$(this)
				.next()
				.animate({ height: "toggle", opacity: "toggle" }, "fast");
		} else {
			$(this)
				.next()
				.hide();
		}
	});
});

$(document).ready(function() {
	$("#giftnav .head")
		.click(function() {
			$(this).toggleClass("openned");
			$(this)
				.next()
				.animate({ height: "toggle", opacity: "toggle" }, "slow");
			return false;
		})
		.next()
		.hide();
});

//
//  Uses jQuery Accordion UI
//
$(document).ready(function() {
	$("#acctsummaries .head")
		.click(function() {
			$(this).toggleClass("openned"); // add 'openned' css class to the current element being clicked
			$(this)
				.next()
				.animate({ height: "toggle", opacity: "toggle" }, "slow");
			return false; // return false so nothing hides when an element is clicked
		})
		.next()
		.hide(); // start off by hiding everything
});

//
//  Uses jQuery Accordion UI
//     don't use this js , this js fragment will put in cmpyInTheNews.jsp , when load static html, call the js

/*  $(document).ready(function() {
            $('#cmpyinthenews .head').click(function() {
                $(this).toggleClass('openned');             
                $(this).next().animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
                return false;                               
            }).next().hide();                             
        });  */

//
//  Uses jQuery Accordion UI
//
$(document).ready(function() {
	$(".checkoutGiftWrap .head")
		.click(function() {
			$(this).toggleClass("openned"); // add 'openned' css class to the current element being clicked
			$(this)
				.next()
				.animate({ height: "toggle", opacity: "toggle" }, "slow");
			return false; // return false so nothing hides when an element is clicked
		})
		.next()
		.hide(); // start off by hiding everything
});

//
//  Uses jQuery Accordion UI
//
$(document).ready(function() {
	$("#shopping .head")
		.click(function() {
			$(this).toggleClass("openned"); // add 'openned' css class to the current element being clicked
			$(this)
				.next()
				.animate({ height: "toggle", opacity: "toggle" }, "slow"); // slowly expose the contents of the next element
			return false; // return false so nothing hides when an element is clicked
		})
		.next()
		.hide(); // start off by hiding everything
});
//
//  Uses jQuery Accordion UI
//
$(document).ready(function() {
	$("#giftregistrylist .head")
		.click(function() {
			$(this).toggleClass("openned"); // add 'openned' css class to the current element being clicked
			$(this)
				.next()
				.animate({ height: "toggle", opacity: "toggle" }, "slow"); // slowly expose the contents of the next element
			return false; // return false so nothing hides when an element is clicked
		})
		.next()
		.hide(); // start off by hiding everything
});

//
//  Uses jQuery Accordion UI
//
$(document).ready(function() {
	$("#tipnav .head")
		.click(function() {
			$(this).toggleClass("openned"); // add 'openned' css class to the current element being clicked
			$(this)
				.next()
				.animate({ height: "toggle", opacity: "toggle" }, "slow"); // slowly expose the contents of the next element
			return false; // return false so nothing hides when an element is clicked
		})
		.next()
		.hide(); // start off by hiding everything
});

//
//  Uses jQuery Accordion UI
//
$(document).ready(function() {
	$("#giftregistrysummaries .head")
		.click(function() {
			$(this).toggleClass("openned"); // add 'openned' css class to the current element being clicked
			$(this)
				.next()
				.animate({ height: "toggle", opacity: "toggle" }, "slow"); // slowly expose the contents of the next element
			return false; // return false so nothing hides when an element is clicked
		})
		.next()
		.hide(); // start off by hiding everything
});

//
//  Uses jQuery Accordion UI
//
$(document).ready(function() {
	$("#giftregistrylist_merchandise .head")
		.click(function() {
			$(this).toggleClass("openned"); // add 'openned' css class to the current element being clicked
			$(this)
				.next()
				.animate({ height: "toggle", opacity: "toggle" }, "slow"); // slowly expose the contents of the next element
			var $allHead = $("#giftregistrylist_merchandise .head");
			if ($allHead.filter(".openned").size() == 0) {
				$("#showAllItems").show();
				$("#hideAllItems").hide();
			} else if ($allHead.filter(".openned").size() == $allHead.size()) {
				$("#showAllItems").hide();
				$("#hideAllItems").show();
			}
			return false; // return false so nothing hides when an element is clicked
		})
		.next()
		.hide(); // start off by hiding everything
});

//
//  Uses jQuery Accordion UI
//
$(document).ready(function() {
	$("#productcategories .head")
		.click(function() {
			$(this).toggleClass("openned"); // add 'openned' css class to the current element being clicked
			$(this)
				.next()
				.animate({ height: "toggle", opacity: "toggle" }, "slow"); // slowly expose the contents of the next element
			return false; // return false so nothing hides when an element is clicked
		})
		.next()
		.hide(); // start off by hiding everything
});
//
//  Uses jQuery Accordion UI
//
$(document).ready(function() {
	$("#storelist .head")
		.click(function() {
			$(this).toggleClass("openned"); // add 'openned' css class to the current element being clicked
			$(this)
				.next()
				.animate({ height: "toggle", opacity: "toggle" }, "slow"); // slowly expose the contents of the next element
			return false; // return false so nothing hides when an element is clicked
		})
		.next()
		.hide(); // start off by hiding everything
});

//
//  Uses jQuery Accordion UI
//
$(document).ready(function() {
	$("#relations #releases .head")
		.click(function() {
			$(this).toggleClass("openned"); // add 'openned' css class to the current element being clicked
			$(this)
				.next()
				.animate({ height: "toggle", opacity: "toggle" }, "slow"); // slowly expose the contents of the next element
			return false; // return false so nothing hides when an element is clicked
		})
		.next()
		.hide(); // start off by hiding everything
});

//
//  Uses jQuery Accordion UI
//
$(document).ready(function() {
	$("#giftreportlist .details .link")
		.click(function() {
			$(this).toggleClass("openned"); // add 'openned' css class to the current element being clicked
			$(this)
				.parent()
				.parent()
				.next()
				.animate({ height: "toggle", opacity: "toggle" }, "slow"); // slowly expose the contents of the next element
			return false; // return false so nothing hides when an element is clicked
		})
		.parent()
		.parent()
		.next()
		.hide(); // start off by hiding everything
});
