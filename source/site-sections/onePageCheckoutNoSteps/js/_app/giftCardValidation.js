(function($) {
	try {
		//Define the plugin's name here
		var __name = "giftCardValidation";
		//--
		$.fn[__name] = function(options) {
			//-- Plugin gymnastics - Part 1/3
			//-- ------------------------------------------------------
			var self = this; // prevent from loosing the scope
			self.view = $(this);
			self.view.data(__name, self); // store the plugin instance into the element
			//-- ------------------------------------------------------

			//-- init
			//-- ------------------------------------------------------
			self.defaults = {};

			self.initialize = function() {
				// merging defaults with passed arguments
				self.options = $.extend({}, self.defaults, options);
				//-
				ignite();
				return self;
			};

			//-- Vars
			//-- ------------------------------------------------------

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				bindEvents();
			}

			function bindEvents() {
				self.view.unbind("keyup").on("keyup", function(evt) {
					var sMsg = base.opc.config.copy.allowedChars.msg;
					var sTitle = base.opc.config.copy.allowedChars.title;
					var b = false;
					var c = evt.keyCode;
					var sReturnText = "";
					var sCurrentText = $(this).val();
					var isPuncOrCtlrChar = function(c) {
						var aChars = [
							8,
							16,
							17,
							20,
							27,
							127,
							188,
							186,
							187,
							189,
							190,
							191,
							219,
							220,
							221,
							222
						];
						var b = false;
						$.each(aChars, function(k, v) {
							if (c == v) b = true;
						});
						return b;
					};
					/*
				c = String.fromCharCode(c).charCodeAt(0);
				//console.log(c);
				if((c < 32 || c > 126) && !isPuncOrCtlrChar(c)) {
					alert(sMsg);
					evt.preventDefault();
					$(this).val(sCurrentText);
					return false;
				}
				/**/
					var a = sCurrentText.split("");
					$.each(a, function(k, v) {
						var n = sCurrentText.charCodeAt(k);
						//console.log('n: ' + n);
						if ((n < 32 || n > 126) && !isPuncOrCtlrChar(n))
							b = true;
						else sReturnText += String.fromCharCode(n);
					});
					$(this).val(sReturnText);
					if (b)
						$(window).trigger("methodRequest", [
							"warn",
							{
								msg: sMsg,
								title: sTitle
							}
						]);
				});
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
