//send TI data

//Only fire on the thank you page...
if (location.pathname.indexOf("/checkout/thankYou.jsp") != -1) {
	$(document).ready(function() {
		if (JWTOnlineClass == "undefined" || !JWTOnlineClass) {
			return;
		}

		(function() {
			//console.log('get classes ready...');
			$.ajax({
				type: "POST",
				url:
					"/rest/bean/slt/rest/profile/ProfileActor/buildUserProfile",
				data: { orderId: JWTOrderId },
				beforeSend: function() {
					//global_showMask("Getting your classes ready...");
				},
				success: function(data) {
					console.log("JWT API Call");
					console.log(data);

					//global_hideMask();
				},
				error: function(error) {
					//console.log('Unable to redirect to Online Cooking Classes \r\n' + error);
					$(document).ready(function() {
						$("#orderError")
							.html(
								"We're sorry. Due to an unforeseen error, we're unable to complete your Online Cooking Class order. To prevent duplicate charges to your account, do not attempt to re-order through the website. Instead, contact Customer Service at 1-800-243-0852 to complete or cancel your order."
							)
							.show();
					});
					global_hideMask();
				}
			});
		})();
	});
}
