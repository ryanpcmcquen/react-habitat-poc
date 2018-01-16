(function() {
	if (typeof window.base == "undefined") return;

	window.base.opc.config.modals = {
		shipping: "/checkout/include/shippingRates.jsp",
		taxes: "/images/html/estimatedTaxes.htm",
		empty: ""
	};
})();
