//- STRING FUNCTIONS
//- ---------------------------------------------
(function() {
	//- UCFIRST
	if (typeof String.prototype.ucfirst !== "function") {
		String.prototype.ucfirst = function() {
			var t = this.charAt(0).toUpperCase();
			return t + this.substr(1);
		};
	}

	//- STRIPHTML
	if (typeof String.prototype.stripHTML !== "function") {
		String.prototype.stripHTML = function() {
			var htmlEscapes = {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#x27;"
			};

			// Regex containing the keys listed immediately above.
			var htmlEscaper = /[&<>"']/g;

			// Escape a string for HTML interpolation.

			return ("" + this).replace(htmlEscaper, function(match) {
				return htmlEscapes[match];
			});
		};
	}

	//- CAPITALIZE
	if (typeof String.prototype.capitalize !== "function") {
		String.prototype.capitalize = function() {
			return this.replace(/\w\S*/g, function(e) {
				return e.charAt(0).toUpperCase() + e.substr(1).toLowerCase();
			});
		};
	}

	//- LOWERIZE
	if (typeof String.prototype.lowerize !== "function") {
		String.prototype.lowerize = function() {
			return this.toLowerCase();
		};
	}

	//- TRIM
	if (typeof String.prototype.trim !== "function") {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, "");
		};
	}

	//- URI PARSING
	String.prototype.parseURI = function() {
		var t = {
			options: {
				strictMode: true,
				key: [
					"source",
					"protocol",
					"authority",
					"userInfo",
					"user",
					"password",
					"host",
					"port",
					"relative",
					"path",
					"directory",
					"file",
					"query",
					"anchor"
				],
				q: { name: "queryKey", parser: /(?:^|&)([^&=]*)=?([^&]*)/g },
				parser: {
					strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
					loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
				}
			}
		};
		var n = t.options,
			r = n.parser[n.strictMode ? "strict" : "loose"].exec(this),
			i = {},
			s = 14;
		while (s--) i[n.key[s]] = r[s] || "";
		i[n.q.name] = {};
		i[n.key[12]].replace(n.q.parser, function(e, t, r) {
			if (t) i[n.q.name][t] = r;
		});
		return i;
	};

	//- LINKIFY
	if (typeof String.prototype.linkify !== "function") {
		String.prototype.linkify = function(blank) {
			// this is a bad regex. It will have many false positives
			var urlRegex = /(https?:\/\/[^\s]+)/g;
			var emailRegex = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;
			return this.replace(urlRegex, function(url) {
				var sEscaper = /,/g;

				return (
					'<a href="' +
					url.replace(sEscaper, "") +
					'"' +
					(blank ? ' target="_blank"' : "") +
					">" +
					url +
					"</a>"
				);
			}).replace(emailRegex, function(mail) {
				return '<a href="mailto:' + mail + '">' + mail + "</a>";
			});
		};
	}
})();
