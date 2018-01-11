(function() {
	if (typeof window.base == "undefined") return;

	window.base.opc.config.copy = {
		allowedChars: {
			title: "Note:",
			msg:
				"We can only print standard English letters, numbers, and punctuation marks. Please remove any diacritical marks, nonstandard punctuation, or characters from other languages."
		},
		confirmDelete:
			"Are you sure you want to remove this item from your cart?",
		accountCreatedStepLabel: "Step 3 of 4 : My Account",
		leavingCart: {
			title: "Wait!",
			msg:
				" Are you sure you want to leave this page? You'll have to re-enter any checkout information when you come back.\r\n\r\nIf you still want to go, click <b>OK</b>. To stay and keep your data, click <b>Cancel</b>."
		},
		ajaxError: {
			msg:
				'A server error has occured. Pressing "OK" will restart your checkout.',
			title: "Oops"
		},
		previewOrder: {
			default: "Preview order",
			createAccount: "Create account and Preview order"
		},
		noShippingAddrNeeded:
			"Virtual orders do not require a shipping address.",
		empty: ""
	};
})();
