$(document).ready(function() {
	var notify = ko.subscribable.fn.notifySubscribers;
	ko.subscribable.fn.notifySubscribers = function() {
		try {
			notify.apply(this, arguments);
		} catch (e) {
			console.error(e);
		}
	};
	ko.applyBindings(null, document.body);
});
