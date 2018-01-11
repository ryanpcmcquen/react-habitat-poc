var GCTracking = {
	ga: {
		select: {
			classic: ["Gift Card", "Select", "Classic"],
			egift: ["Gift Card", "Select", "E-Gift"]
		},
		amount: {
			predefined: ["Gift Card", "Predefined Amount", ""],
			custom: ["Gift Card", "Custom Amount", ""],
			error: ["Gift Card", "Custom Amount Error", ""]
		},
		preview: ["Gift Card", "Preview", ""],
		design: {
			select: ["Gift Card", "Design Select", ""],
			filter: ["Gift Card", "Design Filter", ""]
		},
		email: {
			error: ["Gift Card", "Email", "Error"],
			mismatch: ["Gift Card", "Email", "Mismatch"]
		},
		message: ["Gift Card", "Message", ""],
		addtocart: ["Gift Card", "Add to cart", ""],
		addtoregistry: ["Gift Card", "Add to Registry", ""],
		checkbalance: {
			showForm: ["Gift Card", "Check Balance", "Show Form"],
			submit: ["Gift Card", "Check Balance", "Submit"]
		},
		quantity: ["Gift Card", "Quantity Change", ""],
		sendwhen: ["Gift Card", "Send When", ""],
		moreinfo: ["Gift Card", "More Info", "Click"],
		clearall: ["Gift Card", "Clear All", "Click"],

		//-
		track: function(category, action, title) {
			//console.log('category: ' + category + ', action: ' + action + ', title: ' + title);
			if (typeof _gaq == "undefined") return;
			// e.g: _gaq.push(['_trackEvent', 'Videos', 'Play', 'Baby\'s First Birthday']);
			_gaq.push(["_trackEvent", category, action, title]);
		}
	}
};
