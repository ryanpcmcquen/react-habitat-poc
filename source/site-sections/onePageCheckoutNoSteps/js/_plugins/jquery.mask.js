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
