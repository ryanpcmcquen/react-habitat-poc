//send TI data

//Only fire on the thank you page...
if (location.pathname.indexOf("/checkout/thankYou.jsp") != -1) {
	$(document).ready(function() {
		if (JWTOnlineClass == "undefined" || !JWTOnlineClass) {
			return;
		}

		(function() {
			//console.log('get classes ready...');
			$.ajax({
				type: "POST",
				url:
					"/rest/bean/slt/rest/profile/ProfileActor/buildUserProfile",
				data: { orderId: JWTOrderId },
				beforeSend: function() {
					//global_showMask("Getting your classes ready...");
				},
				success: function(data) {
					console.log("JWT API Call");
					console.log(data);

					//global_hideMask();
				},
				error: function(error) {
					//console.log('Unable to redirect to Online Cooking Classes \r\n' + error);
					$(document).ready(function() {
						$("#orderError")
							.html(
								"We're sorry. Due to an unforeseen error, we're unable to complete your Online Cooking Class order. To prevent duplicate charges to your account, do not attempt to re-order through the website. Instead, contact Customer Service at 1-800-243-0852 to complete or cancel your order."
							)
							.show();
					});
					global_hideMask();
				}
			});
		})();
	});
}
/*
 * @build  : 20-07-2013
 * @author : Ram swaroop
 * @site   : Compzets.com
 */
(function($) {
	// defines various easing effects
	$.easing["jswing"] = $.easing["swing"];
	$.extend($.easing, {
		def: "easeOutQuad",
		swing: function(x, t, b, c, d) {
			return $.easing[$.easing.def](x, t, b, c, d);
		},
		easeInQuad: function(x, t, b, c, d) {
			return c * (t /= d) * t + b;
		},
		easeOutQuad: function(x, t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		easeInOutQuad: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t + b;
			return -c / 2 * (--t * (t - 2) - 1) + b;
		},
		easeInCubic: function(x, t, b, c, d) {
			return c * (t /= d) * t * t + b;
		},
		easeOutCubic: function(x, t, b, c, d) {
			return c * ((t = t / d - 1) * t * t + 1) + b;
		},
		easeInOutCubic: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t + 2) + b;
		},
		easeInQuart: function(x, t, b, c, d) {
			return c * (t /= d) * t * t * t + b;
		},
		easeOutQuart: function(x, t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		},
		easeInOutQuart: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		},
		easeInQuint: function(x, t, b, c, d) {
			return c * (t /= d) * t * t * t * t + b;
		},
		easeOutQuint: function(x, t, b, c, d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		},
		easeInOutQuint: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		},
		easeInSine: function(x, t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		},
		easeOutSine: function(x, t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
		},
		easeInOutSine: function(x, t, b, c, d) {
			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
		},
		easeInExpo: function(x, t, b, c, d) {
			return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
		},
		easeOutExpo: function(x, t, b, c, d) {
			return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
		},
		easeInOutExpo: function(x, t, b, c, d) {
			if (t == 0) return b;
			if (t == d) return b + c;
			if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},
		easeInCirc: function(x, t, b, c, d) {
			return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
		},
		easeOutCirc: function(x, t, b, c, d) {
			return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
		},
		easeInOutCirc: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1)
				return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
		},
		easeInElastic: function(x, t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0) return b;
			if ((t /= d) == 1) return b + c;
			if (!p) p = d * 0.3;
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return (
				-(
					a *
					Math.pow(2, 10 * (t -= 1)) *
					Math.sin((t * d - s) * (2 * Math.PI) / p)
				) + b
			);
		},
		easeOutElastic: function(x, t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0) return b;
			if ((t /= d) == 1) return b + c;
			if (!p) p = d * 0.3;
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return (
				a *
					Math.pow(2, -10 * t) *
					Math.sin((t * d - s) * (2 * Math.PI) / p) +
				c +
				b
			);
		},
		easeInOutElastic: function(x, t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0) return b;
			if ((t /= d / 2) == 2) return b + c;
			if (!p) p = d * (0.3 * 1.5);
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			if (t < 1)
				return (
					-0.5 *
						(a *
							Math.pow(2, 10 * (t -= 1)) *
							Math.sin((t * d - s) * (2 * Math.PI) / p)) +
					b
				);
			return (
				a *
					Math.pow(2, -10 * (t -= 1)) *
					Math.sin((t * d - s) * (2 * Math.PI) / p) *
					0.5 +
				c +
				b
			);
		},
		easeInBack: function(x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		easeOutBack: function(x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		easeInOutBack: function(x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			if ((t /= d / 2) < 1)
				return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
			return (
				c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
			);
		},
		easeInBounce: function(x, t, b, c, d) {
			return c - $.easing.easeOutBounce(x, d - t, 0, c, d) + b;
		},
		easeOutBounce: function(x, t, b, c, d) {
			if ((t /= d) < 1 / 2.75) {
				return c * (7.5625 * t * t) + b;
			} else if (t < 2 / 2.75) {
				return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
			} else if (t < 2.5 / 2.75) {
				return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
			} else {
				return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
			}
		},
		easeInOutBounce: function(x, t, b, c, d) {
			if (t < d / 2)
				return $.easing.easeInBounce(x, t * 2, 0, c, d) * 0.5 + b;
			return (
				$.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 +
				c * 0.5 +
				b
			);
		}
	});

	$.fn.animatescroll = function(options) {
		// fetches options
		var opts = $.extend({}, $.fn.animatescroll.defaults, options);

		if (opts.element == "html,body") {
			// Get the distance of particular id or class from top
			var offset = this.offset().top;

			// Scroll the page to the desired position
			$(opts.element)
				.stop()
				.animate(
					{ scrollTop: offset - opts.padding },
					opts.scrollSpeed,
					opts.easing,
					opts.callback
				);
		} else {
			// Scroll the element to the desired position
			$(opts.element)
				.stop()
				.animate(
					{
						scrollTop:
							this.offset().top -
							this.parent().offset().top +
							this.parent().scrollTop() -
							opts.padding
					},
					opts.scrollSpeed,
					opts.easing,
					opts.callback
				);
		}
	};

	// default options
	$.fn.animatescroll.defaults = {
		easing: "swing",
		scrollSpeed: 666,
		padding: 0,
		element: "html,body",
		callback: function() {}
	};
})(jQuery);
(function($) {
	//--
	$.fn.getInputType = function() {
		return !$(this).length
			? ""
			: this[0].tagName == "INPUT"
				? this[0].type.toLowerCase()
				: this[0].tagName.toLowerCase();
	};
})(jQuery);
(function($) {
	$.fn.htmlOverride = function(val) {
		if (
			$.browser.msie &&
			(parseInt($.browser.version) == 7 ||
				parseInt($.browser.version) == 8)
		) {
			return this.each(function() {
				this.innerHTML = val;

				var scriptTagStart = 0;
				var scriptTagEnd = 0;
				var scriptEndTagStart = 0;
				while (scriptTagStart >= 0) {
					scriptTagStart = val.indexOf("<script", scriptEndTagStart);
					if (scriptTagStart >= 0) {
						scriptTagEnd = val.indexOf(">", scriptTagStart) + 1;
						scriptEndTagStart = val.indexOf(
							"</script>",
							scriptTagEnd
						);

						var scriptString = val.substring(
							scriptTagStart,
							scriptEndTagStart
						);
						var scriptSrcIndex = scriptString.indexOf('src="', 0);

						if (scriptSrcIndex >= 0) {
							loadCachedScript(
								scriptString.substring(
									scriptSrcIndex + 5,
									scriptString.indexOf(
										'"',
										scriptSrcIndex + 5
									)
								)
							);
						} else {
							eval(
								val.substring(scriptTagEnd, scriptEndTagStart)
							);
						}
						scriptString = null;
						scriptSrcIndex = null;
					}
				}

				scriptTagStart = null;
				scriptTagEnd = null;
				scriptEndTagStart = null;
				$(this).trigger("htmlOverride.done");
			});
		} else {
			return this.each(function() {
				$(this).html(val);
				$(this).trigger("htmlOverride.done");
			});
		}
	};
})(jQuery);
/**
 * jquery.mask.js
 * @version: v1.6.4
 * @author: Igor Escobar
 *
 * Created by Igor Escobar on 2012-03-10. Please report any bug at http://blog.igorescobar.com
 *
 * Copyright (c) 2012 Igor Escobar http://blog.igorescobar.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*jshint laxbreak: true */
/* global define */

// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/jqueryPlugin.js
(function(factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["jquery"], factory);
	} else {
		// Browser globals
		factory(window.jQuery || window.Zepto);
	}
})(function($) {
	"use strict";
	var Mask = function(el, mask, options) {
		var jMask = this,
			old_value;
		el = $(el);

		mask =
			typeof mask === "function"
				? mask(el.val(), undefined, el, options)
				: mask;

		jMask.init = function() {
			options = options || {};

			jMask.byPassKeys = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91];
			jMask.translation = {
				"0": { pattern: /\d/ },
				"9": { pattern: /\d/, optional: true },
				"#": { pattern: /\d/, recursive: true },
				A: { pattern: /[a-zA-Z0-9]/ },
				S: { pattern: /[a-zA-Z]/ }
			};

			jMask.translation = $.extend(
				{},
				jMask.translation,
				options.translation
			);
			jMask = $.extend(true, {}, jMask, options);

			el.each(function() {
				if (options.maxlength !== false) {
					el.attr("maxlength", mask.length);
				}

				if (options.placeholder) {
					el.attr("placeholder", options.placeholder);
				}

				el.attr("autocomplete", "off");

				var preserveAutocomplete = el.attr("data-autocomplete");
				if (
					typeof preserveAutocomplete == "string" &&
					preserveAutocomplete == "true"
				) {
					el.attr("autocomplete", "on");
				}

				p.destroyEvents();
				p.events();

				var caret = p.getCaret();

				p.val(p.getMasked());
				p.setCaret(caret + p.getMaskCharactersBeforeCount(caret, true));
			});
		};

		var p = {
			getCaret: function() {
				var sel,
					pos = 0,
					ctrl = el.get(0),
					dSel = document.selection,
					cSelStart = ctrl.selectionStart;

				// IE Support
				if (dSel && !~navigator.appVersion.indexOf("MSIE 10")) {
					sel = dSel.createRange();
					sel.moveStart(
						"character",
						el.is("input") ? -el.val().length : -el.text().length
					);
					pos = sel.text.length;
				} else if (cSelStart || cSelStart === "0") {
					// Firefox support
					pos = cSelStart;
				}

				return pos;
			},
			setCaret: function(pos) {
				if (el.is(":focus")) {
					var range,
						ctrl = el.get(0);

					if (ctrl.setSelectionRange) {
						ctrl.setSelectionRange(pos, pos);
					} else if (ctrl.createTextRange) {
						range = ctrl.createTextRange();
						range.collapse(true);
						range.moveEnd("character", pos);
						range.moveStart("character", pos);
						range.select();
					}
				}
			},
			events: function() {
				el.on("keydown.mask", function() {
					old_value = p.val();
				});
				el.on("keyup.mask", p.behaviour);
				el.on("paste.mask drop.mask", function() {
					setTimeout(function() {
						el.keydown().keyup();
					}, 100);
				});
				el.on("change.mask", function() {
					el.data("changeCalled", true);
				});
				el.on("blur.mask", function(e) {
					var el = $(e.target);
					if (el.prop("defaultValue") !== el.val()) {
						el.prop("defaultValue", el.val());
						if (!el.data("changeCalled")) {
							el.trigger("change");
						}
					}
					el.data("changeCalled", false);
				});

				// clear the value if it not complete the mask
				el.on("focusout.mask", function() {
					if (
						options.clearIfNotMatch &&
						p.val().length < mask.length
					) {
						p.val("");
					}
				});
			},
			destroyEvents: function() {
				el
					.off(
						"keydown.mask keyup.mask paste.mask drop.mask change.mask blur.mask focusout.mask"
					)
					.removeData("changeCalled");
			},
			val: function(v) {
				var isInput = el.is("input");
				return arguments.length > 0
					? isInput ? el.val(v) : el.text(v)
					: isInput ? el.val() : el.text();
			},
			getMaskCharactersBeforeCount: function(index, onCleanVal) {
				for (
					var count = 0, i = 0, maskL = mask.length;
					i < maskL && i < index;
					i++
				) {
					if (!jMask.translation[mask.charAt(i)]) {
						index = onCleanVal ? index + 1 : index;
						count++;
					}
				}
				return count;
			},
			determineCaretPos: function(
				originalCaretPos,
				oldLength,
				newLength,
				maskDif
			) {
				var translation =
					jMask.translation[
						mask.charAt(
							Math.min(originalCaretPos - 1, mask.length - 1)
						)
					];

				return !translation
					? p.determineCaretPos(
							originalCaretPos + 1,
							oldLength,
							newLength,
							maskDif
						)
					: Math.min(
							originalCaretPos + newLength - oldLength - maskDif,
							newLength
						);
			},
			behaviour: function(e) {
				e = e || window.event;
				var keyCode = e.keyCode || e.which;

				if ($.inArray(keyCode, jMask.byPassKeys) === -1) {
					var caretPos = p.getCaret(),
						currVal = p.val(),
						currValL = currVal.length,
						changeCaret = caretPos < currValL,
						newVal = p.getMasked(),
						newValL = newVal.length,
						maskDif =
							p.getMaskCharactersBeforeCount(newValL - 1) -
							p.getMaskCharactersBeforeCount(currValL - 1);

					if (newVal !== currVal) {
						p.val(newVal);
					}

					// change caret but avoid CTRL+A
					if (changeCaret && !(keyCode === 65 && e.ctrlKey)) {
						// Avoid adjusting caret on backspace or delete
						if (!(keyCode === 8 || keyCode === 46)) {
							caretPos = p.determineCaretPos(
								caretPos,
								currValL,
								newValL,
								maskDif
							);
						}
						p.setCaret(caretPos);
					}

					return p.callbacks(e);
				}
			},
			getMasked: function(skipMaskChars) {
				var buf = [],
					value = p.val(),
					m = 0,
					maskLen = mask.length,
					v = 0,
					valLen = value.length,
					offset = 1,
					addMethod = "push",
					resetPos = -1,
					lastMaskChar,
					check;

				if (options.reverse) {
					addMethod = "unshift";
					offset = -1;
					lastMaskChar = 0;
					m = maskLen - 1;
					v = valLen - 1;
					check = function() {
						return m > -1 && v > -1;
					};
				} else {
					lastMaskChar = maskLen - 1;
					check = function() {
						return m < maskLen && v < valLen;
					};
				}

				while (check()) {
					var maskDigit = mask.charAt(m),
						valDigit = value.charAt(v),
						translation = jMask.translation[maskDigit];

					if (translation) {
						if (valDigit.match(translation.pattern)) {
							buf[addMethod](valDigit);
							if (translation.recursive) {
								if (resetPos === -1) {
									resetPos = m;
								} else if (m === lastMaskChar) {
									m = resetPos - offset;
								}

								if (lastMaskChar === resetPos) {
									m -= offset;
								}
							}
							m += offset;
						} else if (translation.optional) {
							m += offset;
							v -= offset;
						}
						v += offset;
					} else {
						if (!skipMaskChars) {
							buf[addMethod](maskDigit);
						}

						if (valDigit === maskDigit) {
							v += offset;
						}

						m += offset;
					}
				}

				var lastMaskCharDigit = mask.charAt(lastMaskChar);
				if (
					maskLen === valLen + 1 &&
					!jMask.translation[lastMaskCharDigit]
				) {
					buf.push(lastMaskCharDigit);
				}
				return buf.join("");
			},
			callbacks: function(e) {
				var val = p.val(),
					changed = p.val() !== old_value;
				if (changed === true) {
					if (typeof options.onChange === "function") {
						options.onChange(val, e, el, options);
					}
				}

				if (
					changed === true &&
					typeof options.onKeyPress === "function"
				) {
					options.onKeyPress(val, e, el, options);
				}

				if (
					typeof options.onComplete === "function" &&
					val.length === mask.length
				) {
					options.onComplete(val, e, el, options);
				}
			}
		};

		// public methods
		jMask.remove = function() {
			var caret = p.getCaret(),
				maskedCharacterCountBefore = p.getMaskCharactersBeforeCount(
					caret
				);

			p.destroyEvents();
			p.val(jMask.getCleanVal()).removeAttr("maxlength");
			p.setCaret(caret - maskedCharacterCountBefore);
		};

		// get value without mask
		jMask.getCleanVal = function() {
			return p.getMasked(true);
		};

		jMask.init();
	};

	$.fn.mask = function(mask, options) {
		this.unmask();
		return this.each(function() {
			$(this).data("mask", new Mask(this, mask, options));
		});
	};

	$.fn.unmask = function() {
		return this.each(function() {
			try {
				$(this)
					.data("mask")
					.remove();
			} catch (e) {}
		});
	};

	$.fn.cleanVal = function() {
		return $(this)
			.data("mask")
			.getCleanVal();
	};

	// looking for inputs with data-mask attribute
	$("*[data-mask]").each(function() {
		var input = $(this),
			options = {},
			prefix = "data-mask-";

		if (input.attr(prefix + "reverse") === "true") {
			options.reverse = true;
		}

		if (input.attr(prefix + "maxlength") === "false") {
			options.maxlength = false;
		}

		if (input.attr(prefix + "clearifnotmatch") === "true") {
			options.clearIfNotMatch = true;
		}

		input.mask(input.attr("data-mask"), options);
	});
});

/*
    Masked Input plugin for jQuery
    Copyright (c) 2007-2013 Josh Bush (digitalbush.com)
    Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
    Version: 1.3.1
*/
/*
(function($) {
    function getPasteEvent() {
        var el = document.createElement('input'),
            name = 'onpaste';
        el.setAttribute(name, '');
        return (typeof el[name] === 'function')?'paste':'input';
    }

    var pasteEventName = getPasteEvent() + ".mask",
        ua = navigator.userAgent,
        iPhone = /iphone/i.test(ua),
        android=/android/i.test(ua),
        caretTimeoutId;

    $.mask = {
        //Predefined character definitions
        definitions: {
            '9': "[0-9]",
            'a': "[A-Za-z]",
            '*': "[A-Za-z0-9]"
        },
        dataName: "rawMaskFn",
        placeholder: '_',
    };

    $.fn.extend({
        //Helper Function for Caret positioning
        caret: function(begin, end) {
            var range;

            if (this.length === 0 || this.is(":hidden")) {
                return;
            }

            if (typeof begin == 'number') {
                end = (typeof end === 'number') ? end : begin;
                return this.each(function() {
                    if (this.setSelectionRange) {
                        this.setSelectionRange(begin, end);
                    } else if (this.createTextRange) {
                        range = this.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', end);
                        range.moveStart('character', begin);
                        range.select();
                    }
                });
            } else {
                if (this[0].setSelectionRange) {
                    begin = this[0].selectionStart;
                    end = this[0].selectionEnd;
                } else if (document.selection && document.selection.createRange) {
                    range = document.selection.createRange();
                    begin = 0 - range.duplicate().moveStart('character', -100000);
                    end = begin + range.text.length;
                }
                return { begin: begin, end: end };
            }
        },
        unmask: function() {
            return this.trigger("unmask");
        },
        mask: function(mask, settings) {
            var input,
                defs,
                tests,
                partialPosition,
                firstNonMaskPos,
                len;

            if (!mask && this.length > 0) {
                input = $(this[0]);
                return input.data($.mask.dataName)();
            }
            settings = $.extend({
                placeholder: $.mask.placeholder, // Load default placeholder
                completed: null
            }, settings);


            defs = $.mask.definitions;
            tests = [];
            partialPosition = len = mask.length;
            firstNonMaskPos = null;

            $.each(mask.split(""), function(i, c) {
                if (c == '?') {
                    len--;
                    partialPosition = i;
                } else if (defs[c]) {
                    tests.push(new RegExp(defs[c]));
                    if (firstNonMaskPos === null) {
                        firstNonMaskPos = tests.length - 1;
                    }
                } else {
                    tests.push(null);
                }
            });

            return this.trigger("unmask").each(function() {
                var input = $(this),
                    buffer = $.map(
                    mask.split(""),
                    function(c, i) {
                        if (c != '?') {
                            return defs[c] ? settings.placeholder : c;
                        }
                    }),
                    focusText = input.val();

                function seekNext(pos) {
                    while (++pos < len && !tests[pos]);
                    return pos;
                }

                function seekPrev(pos) {
                    while (--pos >= 0 && !tests[pos]);
                    return pos;
                }

                function shiftL(begin,end) {
                    var i,
                        j;

                    if (begin<0) {
                        return;
                    }

                    for (i = begin, j = seekNext(end); i < len; i++) {
                        if (tests[i]) {
                            if (j < len && tests[i].test(buffer[j])) {
                                buffer[i] = buffer[j];
                                buffer[j] = settings.placeholder;
                            } else {
                                break;
                            }

                            j = seekNext(j);
                        }
                    }
                    writeBuffer();
                    input.caret(Math.max(firstNonMaskPos, begin));
                }

                function shiftR(pos) {
                    var i,
                        c,
                        j,
                        t;

                    for (i = pos, c = settings.placeholder; i < len; i++) {
                        if (tests[i]) {
                            j = seekNext(i);
                            t = buffer[i];
                            buffer[i] = c;
                            if (j < len && tests[j].test(t)) {
                                c = t;
                            } else {
                                break;
                            }
                        }
                    }
                }

                function keydownEvent(e) {
                    var k = e.which,
                        pos,
                        begin,
                        end;

                    //backspace, delete, and escape get special treatment
                    if (k === 8 || k === 46 || (iPhone && k === 127)) {
                        pos = input.caret();
                        begin = pos.begin;
                        end = pos.end;

                        if (end - begin === 0) {
                            begin=k!==46?seekPrev(begin):(end=seekNext(begin-1));
                            end=k===46?seekNext(end):end;
                        }
                        clearBuffer(begin, end);
                        shiftL(begin, end - 1);

                        e.preventDefault();
                    } else if (k == 27) {//escape
                        input.val(focusText);
                        input.caret(0, checkVal());
                        e.preventDefault();
                    }
                }

                function keypressEvent(e) {
                    var k = e.which,
                        pos = input.caret(),
                        p,
                        c,
                        next;

                    if (e.ctrlKey || e.altKey || e.metaKey || k < 32) {//Ignore
                        return;
                    } else if (k) {
                        if (pos.end - pos.begin !== 0){
                            clearBuffer(pos.begin, pos.end);
                            shiftL(pos.begin, pos.end-1);
                        }

                        p = seekNext(pos.begin - 1);
                        if (p < len) {
                            c = String.fromCharCode(k);
                            if (tests[p].test(c)) {
                                shiftR(p);

                                buffer[p] = c;
                                writeBuffer();
                                next = seekNext(p);

                                if(android){
                                    setTimeout($.proxy($.fn.caret,input,next),0);
                                }else{
                                    input.caret(next);
                                }

                                if (settings.completed && next >= len) {
                                    settings.completed.call(input);
                                }
                            }
                        }
                        e.preventDefault();
                    }
                }

                function clearBuffer(start, end) {
                    var i;
                    for (i = start; i < end && i < len; i++) {
                        if (tests[i]) {
                            buffer[i] = settings.placeholder;
                        }
                    }
                }

                function writeBuffer() { input.val(buffer.join('')); }

                function checkVal(allow) {
                    //try to place characters where they belong
                    var test = input.val(),
                        lastMatch = -1,
                        i,
                        c;

                    for (i = 0, pos = 0; i < len; i++) {
                        if (tests[i]) {
                            buffer[i] = settings.placeholder;
                            while (pos++ < test.length) {
                                c = test.charAt(pos - 1);
                                if (tests[i].test(c)) {
                                    buffer[i] = c;
                                    lastMatch = i;
                                    break;
                                }
                            }
                            if (pos > test.length) {
                                break;
                            }
                        } else if (buffer[i] === test.charAt(pos) && i !== partialPosition) {
                            pos++;
                            lastMatch = i;
                        }
                    }
                    if (allow) {
                        writeBuffer();
                    } else if (lastMatch + 1 < partialPosition) {
                        input.val("");
                        clearBuffer(0, len);
                    } else {
                        writeBuffer();
                        input.val(input.val().substring(0, lastMatch + 1));
                    }
                    return (partialPosition ? i : firstNonMaskPos);
                }

                input.data($.mask.dataName,function(){
                    return $.map(buffer, function(c, i) {
                        return tests[i]&&c!=settings.placeholder ? c : null;
                    }).join('');
                });

                if (!input.attr("readonly"))
                    input
                    .one("unmask", function() {
                        input
                            .unbind(".mask")
                            .removeData($.mask.dataName);
                    })
                    .bind("focus.mask", function() {
                        clearTimeout(caretTimeoutId);
                        var pos,
                            moveCaret;

                        focusText = input.val();
                        pos = checkVal();

                        caretTimeoutId = setTimeout(function(){
                            writeBuffer();
                            if (pos == mask.length) {
                                input.caret(0, pos);
                            } else {
                                input.caret(pos);
                            }
                        }, 10);
                    })
                    .bind("blur.mask", function() {
                        checkVal();
                        if (input.val() != focusText)
                            input.change();
                    })
                    .bind("keydown.mask", keydownEvent)
                    .bind("keypress.mask", keypressEvent)
                    .bind(pasteEventName, function() {
                        setTimeout(function() {
                            var pos=checkVal(true);
                            input.caret(pos);
                            if (settings.completed && pos == input.val().length)
                                settings.completed.call(input);
                        }, 0);
                    });
                checkVal(); //Perform initial check for existing values
            });
        }
    });
})(jQuery);*/
(function($) {
	try {
		//Define the plugin's name here
		var __name = "scroll2";
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
				!self.view.length ||
					self.view.stop().animatescroll(self.options);
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
/*
---
description: SIMPLE MODAL for jQuery is a small plugin based on original SimpleModal for Mootools. It can be used to generate alert or confirm messages with few lines of code. Confirm configuration involves the use of callbacks to be applied to affirmative action;i t can work in asynchronous mode and retrieve content from external pages or getting the inline content. SIMPLE MODAL is not a lightbox although the possibility to hide parts of its layout may partially make it similar.

license: MIT-style

authors:
- Micha� Buczko
- Marco Dell'Anna

requires:
- jQuery 1.6+

provides:
- SimpleModal
...

* Simple Modal for jQuery
* Version 1.0
*
* Copyright (c) 2011 Micha� Buczko
* Original Simple Modal copyrighted 2011 Marco Dell'Anna - http://www.plasm.it
*
* Requires:
* jQuery http://jquery.com
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*
* Log:
* 1.0 - Initial version [Tested on: ie8/ie9/Chrome/Firefox7/Safari]
*/

(function($) {
	var self = null;

	//Attach this new method to jQuery
	$.fn.extend({
		buttons: null,
		options: null,

		defaults: {
			onAppend: null,
			offsetTop: null,
			overlayOpacity: 0.3,
			overlayColor: "#000000",
			width: 400,
			draggable: true,
			keyEsc: true,
			overlayClick: true,
			closeButton: true, // X close button
			hideHeader: false,
			hideFooter: false,
			btn_ok: "OK", // Label
			btn_cancel: "Cancel", // Label
			template:
				'<div class="simple-modal-header"> \
                <h1>{_TITLE_}</h1> \
            </div> \
                <div class="simple-modal-body"> \
                <div class="contents">{_CONTENTS_}</div> \
            </div> \
                <div class="simple-modal-footer"></div>'
		},

		SimpleModal: function(options) {
			self = this;

			this.buttons = [];
			this.options = $.extend({}, self.defaults, options);

			return this;
		},

		/**
		 * public method showModal
		 * Open Modal
		 * @options: param to rewrite
		 * @return node HTML
		 */
		showModal: function() {
			var node = null;

			// Inserisce Overlay
			this._overlay("show");

			// Switch different modal
			switch (this.options.model) {
				case "modal-ajax":
					node = this._drawWindow(this.options);
					this._loadContents({
						url: self.options.param.url || "",
						onRequestComplete: this.options.param.onRequestComplete
					});
					break;
				case "confirm":
					// Add button confirm
					this.addButton(
						this.options.btn_ok,
						"btn primary btn-margin",
						function() {
							// in oppose to original version, i'm not catching exceptions
							// i want to know what's eventually goes wrong
							self.options.callback();
							self.hideModal();
						}
					);
					// Add button cancel
					this.addButton(this.options.btn_cancel, "btn secondary");
					node = this._drawWindow(this.options);
					break;
				case "modal":
					node = this._drawWindow(this.options);
					break;
				default:
					// Alert
					this.addButton(this.options.btn_ok, "btn primary");
					node = this._drawWindow(this.options);
			}
			if (node) {
				// Custom size Modal
				node.css("width", this.options.width);

				// Hide Header &&/|| Footer
				if (this.options.hideHeader) node.addClass("hide-header");
				if (this.options.hideFooter) node.addClass("hide-footer");

				// Add Button X
				if (this.options.closeButton) this._addCloseButton();

				// Enabled Drag Window
				if (this.options.draggable) {
					var headDrag = node.find(".simple-modal-header"),
						clicked = false,
						dx = 0,
						dy = 0;
					var updatePos = function(pos) {
						node.css({ left: pos.x - dx, top: pos.y - dy });
					};
					var getMousePos = function(e) {
						return { x: e.pageX, y: e.pageY };
					};
					headDrag.bind({
						mousedown: function(e) {
							var mpos = getMousePos(e),
								cpos = node.position();

							e.stopPropagation();
							e.preventDefault();

							dx = mpos.x - cpos.left;
							dy = mpos.y - cpos.top;

							clicked = true;
						},
						mouseup: function(e) {
							e.stopPropagation();
							e.preventDefault();
							clicked = false;
						}
					});
					$(document).mousemove(function(e) {
						e.stopPropagation();
						e.preventDefault();
						if (clicked) updatePos(getMousePos(e));
					});

					// Set handle cursor
					headDrag.css("cursor", "move");
					node.addClass("draggable");
				}
				// Resize Stage
				this._display();
			}
		},

		/**
		 * public method hideModal
		 * Close model window
		 * return
		 */
		hideModal: function() {
			self._overlay("hide");
		},

		/**
		 * private method _drawWindow
		 * Rendering window
		 * return node SM
		 */
		_drawWindow: function(options) {
			// Add Node in DOM
			var node = $("<div>")
				.addClass("simple-modal")
				.attr("id", "simple-modal");

			// Set Contents
			node.html(
				this._template(self.options.template, {
					_TITLE_: options.title || "Untitled",
					_CONTENTS_: options.contents || ""
				})
			);

			$("body").append(node);

			// Add all buttons
			this._injectAllButtons();

			// Callback append
			if (this.options.onAppend) {
				this.options.onAppend.call(this);
			}
			return node;
		},

		/**
		 * public method addButton
		 * Add button to Modal button array
		 * require @label:string, @classe:string, @clickEvent:event
		 * @return node HTML
		 */
		addButton: function(label, classe, clickEvent) {
			var bt = $("<a>")
				.attr({
					title: label,
					class: classe
				})
				.click(
					clickEvent
						? function(e) {
								clickEvent.call(self, e);
							}
						: self.hideModal
				)
				.text(label);

			this.buttons.push(bt);
			return this;
		},

		/**
		 * private method _injectAllButtons
		 * Inject all buttons in simple-modal-footer
		 * @return
		 */
		_injectAllButtons: function() {
			var footer = $("#simple-modal").find(".simple-modal-footer");

			$.each(self.buttons, function(i, e) {
				footer.append(e);
			});
		},

		/**
		 * private method _addCloseButton
		 * Inject Close botton (X button)
		 * @return node HTML
		 */
		_addCloseButton: function() {
			var b = $("<a>")
				.addClass("close")
				.attr({ href: "#" })
				.text("x")
				.click(function(e) {
					self.hideModal();
					e.preventDefault();
				});
			$("#simple-modal").append(b);
			return b;
		},

		/**
		 * private method _overlay
		 * Create/Destroy overlay and Modal
		 * @return
		 */
		_overlay: function(status) {
			switch (status) {
				case "show":
					var overlay = $("<div>")
						.attr("id", "simple-modal-overlay")
						.css({
							"background-color": this.options.overlayColor,
							opacity: 0
						});

					$("body").append(overlay);

					overlay.animate({ opacity: this.options.overlayOpacity });

					// Behaviour
					if (this.options.overlayClick) {
						overlay.click(function(e) {
							self.hideModal();
						});
					}

					// Add Control Resize
					$(window).resize(self._display);
					$(document).keyup(self._escape);
					break;

				case "hide":
					// Remove Overlay
					$("#simple-modal-overlay").remove();
					$("#simple-modal").remove();

					$(window).unbind("resize", self._display);
					$(document).unbind("keyup", self._escape);
			}
		},

		_escape: function(e) {
			if (e.keyCode == 27) self.hideModal();
		},

		/**
		 * private method _loadContents
		 * Async request for modal ajax
		 * @return
		 */
		_loadContents: function(param) {
			// Set Loading
			$("#simple-modal").addClass("loading");
			// Match image file
			var re = new RegExp(/([^\/\\]+)\.(jpg|png|gif)$/i),
				container = $("#simple-modal");
			if (param.url.match(re)) {
				// Hide Header/Footer
				container.addClass("hide-footer");
				// Remove All Event on Overlay
				$("#simple-modal-overlay").unbind(); // Prevent Abort
				// Immagine
				var image = $("<img>")
					.attr("src", param.url)
					.load(function() {
						var content = container
							.removeClass("loading")
							.find(".contents")
							.empty()
							.append($(this).css("opacity", 0));
						var dw = container.width() - content.width(),
							dh = container.height() - content.height();
						var width = $(this).width() + dw,
							height = $(this).height() + dh;

						//self._display();
						container.animate(
							{
								width: width,
								height: height,
								left: ($(window).width() - width) / 2,
								top: ($(window).height() - height) / 2
							},
							200,
							function() {
								image.animate({ opacity: 1 });
							}
						);
					});
			} else {
				$("#simple-modal .contents").load(param.url, function(
					responseText,
					textStatus,
					XMLHttpRequest
				) {
					var container = $(this)
						.parent()
						.parent()
						.removeClass("loading");
					if (textStatus !== "success") {
						container.find(".contents").html("loading failed");

						if (param.onRequestFailure) {
							param.onRequestFailure();
						}
					} else {
						if (param.onRequestComplete) {
							param.onRequestComplete();
						}
						self._display();
					}
				});
			}
		},

		/**
		 * private method _display
		 * Move interface
		 * @return
		 */
		_display: function() {
			// Update overlay
			$("#simple-modal-overlay").css({
				width: $(window).width(),
				height: $(window).height()
			});

			// Update position popup
			var modal = $("#simple-modal"),
				top =
					self.options.offsetTop ||
					($(window).height() - modal.height()) / 2;
			modal.css({
				top: top,
				left: ($(window).width() - modal.width()) / 2
			});
		},

		/**
		 * private method _template
		 * simple template by Thomas Fuchs
		 * @return
		 */
		_template: function(s, d) {
			for (var p in d) {
				s = s.replace(new RegExp("{" + p + "}", "g"), d[p]);
			}
			return s;
		}
	});
})(jQuery);
