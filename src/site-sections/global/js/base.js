(function(win) {
	win.base = $.extend({}, win.base, {
		breakpoints: {
			//these responsive breakpoints mirror the values set in global/sass/bootstrap/_variables.scss
			xs: 480,
			sm: 768,
			md: 967,
			lg: 1200
		},
		path: {
			root: "/",
			img: "/images/",
			js: "/scripts/"
		},
		fn: {
			und: function(v) {
				return typeof v == "undefined";
			},
			noop: function() {},
			is: function(what) {
				var pl = navigator.platform.toLowerCase();
				switch (what.toLowerCase()) {
					case "mobile":
						return base.fn.mobile();
						break;
					case "ipad":
						return navigator.userAgent.match(/iPad/i) != null;
						break;
					case "windows":
						return pl == "windows" || pl == "win32";
						break;
					case "mac":
						return pl == "mac";
						break;
					case "linux":
						return pl == "linux";
						break;
					case "ie":
						return (function(ua) {
							return ua.indexOf("MSIE") != -1;
						})(navigator.userAgent);
						break;
					case "ie9":
						return (function(ua) {
							return ua.indexOf("MSIE 9") != -1;
						})(navigator.userAgent);
						break;
					case "ie8":
						return (function(ua) {
							return (
								(ua.indexOf("MSIE 8") != -1) != -1 &&
								ua.indexOf("Trident/4") != -1
							);
						})(navigator.userAgent);
						break;
					case "ie7":
						return (function(ua) {
							return (
								ua.indexOf("MSIE 7") != -1 &&
								ua.indexOf("Trident") == -1
							);
						})(navigator.userAgent);
						break;
				}
			},
			/* uncomment if needed for project
            cookie : {
                set : function(name, value, days) {
                    if (days) {
                        var date = new Date();
                        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                        var expires = "; expires=" + date.toGMTString();
                    }
                    else var expires = "";
                    document.cookie = name + "=" + value + expires + "; path=/";
                },
                get : function(name) {
                    var nameEQ = name + "=";
                    var ca = document.cookie.split(';');
                    for(var i = 0; i < ca.length; i++) {
                        var c = ca[i];
                        while (c.charAt(0) == ' ') c = c.substring(1,c.length);
                        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
                    }
                    return null;
                },
                enabled : function() {
                    var cookieEnabled = (navigator.cookieEnabled) ? true : false;
                    if (base.fn.und(navigator.cookieEnabled) && !cookieEnabled) { 
                        document.cookie = "testcookie";
                        cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
                    }
                    return cookieEnabled;
                }
            },*/
			redirect: function(where) {
				document.location.href = where;
			},
			/* uncomment if needed for project
            transitionEndEventName : function() {
                var i,
                    undefined,
                    el = document.createElement('div'),
                    transitions = {
                        'transition':'transitionend',
                        'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
                        'MozTransition':'transitionend',
                        'WebkitTransition':'webkitTransitionEnd'
                    };

                for (i in transitions) {
                    if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
                        return transitions[i];
                    }
                }

                //TODO: throw 'TransitionEnd event is not supported in this browser'; 
            },*/
			host: function() {
				var aURI = document.location.href.parseURI();
				var aDir = aURI["directory"].split("/");
				return (
					aURI["protocol"] +
					"://" +
					aURI["authority"] +
					"/" +
					(aDir[1] == base.path.root ? aDir[1] + "/" : "")
				);
			},
			/* uncomment if needed for project
            browser: {
                version: navigator.userAgent.toLowerCase().match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)[1],
                msie: navigator.userAgent.toLowerCase().indexOf('msie') != -1
            },*/
			err: function(e) {
				if (typeof e === "object") {
					if (e.message) {
						console.log("\nMessage: " + e.message);
					}
					if (e.stack) {
						console.log("\nStacktrace:");
						console.log("====================");
						console.log(e.stack);
					}
				} else {
					console.log("dumpError :: argument is not an object");
				}
			}
		}
	});
})(window);
