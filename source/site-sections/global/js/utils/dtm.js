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

$(window).on("liveChatPop", function() {
	//Live Chat Invitation Event Example
	//create object with eventInfo and product object
	var ddliveChatInvitationEvent = {
		eventInfo: {
			eventName: "liveChatInvitation",
			type: "online chat",
			timeStamp: new Date(),
			processed: {
				adobeAnalytics: false //dtm will change this to true once processed
			}
		},
		liveChatData: {
			eventType: "invitation shown"
		}
	};

	//Push it onto the event array on digitalData object
	window.digitalData = window.digitalData || {};
	window.digitalData.event = window.digitalData.event || [];
	window.digitalData.event.push(ddliveChatInvitationEvent);

	//Create and dispatch an event trigger (using predefined sendCustomEvent function)
	sendCustomEvent("liveChatInvitation");
});
