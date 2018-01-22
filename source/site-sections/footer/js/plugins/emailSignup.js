(function($) {
	var thanks = "Thank you!";

	function error(msg) {
		$("#signup_thanks")
			.html(msg)
			.css("color", "red")
			.show(300);
	}

	try {
		$("#emailsignupformfooter #emailsignup")
			.off("click")
			.on("click", function(e) {
				$.ajax({
					url: "//emarsys-subscribe.herokuapp.com/subscribe/",
					type: "get",
					headers: {
						Authorization:
							"Basic c2x0X3VzZXI6NHdoY3kyWXdnbWhFRU1qZk02TFF4aW9C"
					},
					data: {
						"3": $("#emailsignupformfooter #signup_email").val(),
						"13": $("#emailsignupformfooter #signup_zip").val(),
						"7791": "FOOTER_SIGNUP",
						"31": 1
					}
				})
					.done(function(res) {
						if (res.replyText == "OK") {
							$("#signup_thanks")
								.html(thanks)
								.css("color", "")
								.show(300);
							$("#signup_email,#signup_zip").val("");
							$("#emailsignupformfooter")[0].reset();
						}
					})
					.error(function(xhr) {
						var e = xhr.responseText.split("(")[0].trim();
						error(e);
					});
				e.preventDefault();
			});
	} catch (e) {
		console.error(e);
	}
})(jQuery);
