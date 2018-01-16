// These cookie items are included because the jquery cookie plugin only accepts 'days' for expiry

// Some pages require expiry in minutes instead.

function setCustomCookie(name, value, min) {
	if (min) {
		var date = new Date();
		date.setTime(date.getTime() + min * 60 * 1000);
		var expires = "; expires=" + date.toGMTString();
	} else {
		var expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/;";
}

function getCustomCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function deleteCustomCookie(name) {
	setCustomCookie(name, "", -1);
}
/*
	// Create/write a cookie and store it for 1 day
	setCookie('myCookie', 'myValue', 1);

	// Get my cookie
	getCookie('myCookie');

	// Delete/erase my cookie
	deleteCookie('myCookie');
*/
