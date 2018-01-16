/* Handle hover functionality for all nav and top header drop downs.
** Overrides bootstraps 'click'
*/

$(document).ready(function() {
	//make call for profile data
	loadProfileData();
	loadCartData();
});

(function() {
	$("html").on("mouseenter", ".dropdown", function(e) {
		var me = $(this);
		var myTimer = me.data("hoverTimeout");
		var toggle = me.find("[data-toggle='dropdown']");
		var menu = me.find(".dropdown-menu");

		clearTimeout(myTimer);
		//intent to hover
		myTimer = setTimeout(function() {
			if (toggle.attr("aria-expanded") !== "true") {
				toggle.dropdown("toggle");
				toggle.focus();
			}
		}, 180);

		me.data("hoverTimeout", myTimer);

		menu.off("click").on("click", function(e) {
			e.stopPropagation();
		});
		toggle.off("click").on("click", function(ev) {
			e.stopPropagation();
			e.preventDefault();
			e.stopImmediatePropagation();
			return false;
		});
	});
	$("html").on("mouseleave", ".dropdown", function(e) {
		var me = $(this);
		var myTimer = me.data("hoverTimeout");
		var toggle = me.find("[data-toggle='dropdown']");

		clearTimeout(myTimer);
		//intent to leave
		myTimer = setTimeout(function() {
			if (toggle.attr("aria-expanded") === "true") {
				toggle.dropdown("toggle");
				toggle.blur();
			}
		}, 200);

		me.data("hoverTimeout", myTimer);
	});
})();

function loadProfileData() {
	$.ajax({
		type: "GET",
		url: contextPath + "/includes/headerProfileLinks.jsp",
		success: function(data) {
			$("#topNavAcctLinks").html(data);

			//only bind the click event on pages where we will allow the modal.
			if (allowLoginModal()) {
				$("#topNavAcctLinks .js-trigger-loginModal").click(
					loginModalClickEvent
				);
			}
		}
	});
}

function loadCartData() {
	$.ajax({
		type: "GET",
		url: contextPath + "/includes/headerCartItemsNoShopCartWord.jsp",
		success: function(data) {
			$("#topHeaderItemCount").html(" (" + data + ")");
		}
	});
}
