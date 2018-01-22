/**
 * Creates and dispatches an event trigger
 * @param {String} evt - The name of the event
 */
function sendCustomEvent(evt) {
	if (document.createEvent && document.body.dispatchEvent) {
		var event = document.createEvent("Event");
		event.initEvent(evt, true, true); //can bubble, and is cancellable
		document.body.dispatchEvent(event);
	} else if (window.CustomEvent && document.body.dispatchEvent) {
		var event = new CustomEvent(evt, {
			bubbles: true,
			cancelable: true
		});
		document.body.dispatchEvent(event);
	}
}
