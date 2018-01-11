/*
This is an email signup event used for emarsys email signups
Even if a user didn't opt in to recieve emails, we still want to collect their email
*/
$(window).on("emailsignup", function(e, options) {
	if (!options) {
		//for some reason we didn't send any data here.
		console.error(
			"SurLaTable/workspace/ui_sources/global/js/head/emailSignUp.js : emailsignup event was executed"
		);
		return;
	}
	//Construct the data object jquery uses for the query parameters
	var data = {
		"3": options.email,
		"13": options.zip || "", //[Optional]
		"7791": options.source,
		"31": options.opt === undefined ? 1 : options.opt ? 1 : 0 //defaults to opt in
	};
	$.ajax({
		url: "//emarsys-subscribe.herokuapp.com/subscribe/",
		type: "get",
		headers: {
			//authentication required to use the emarsys api
			Authorization: "Basic c2x0X3VzZXI6NHdoY3kyWXdnbWhFRU1qZk02TFF4aW9C"
		},
		data: data
	})
		.done(function(res) {
			//A callback to know when this has finished
			//This could be done differently
			if (typeof options.done == "function") options.done(res);
		})
		.error(function(xhr) {
			//A callback to know when there is an error
			//This could be done differently
			if (typeof options.error == "function") options.error(xhr);
		});
});
//END OF EMARSYS EMAIL SIGNUP
