/* APO Military Zip Validation For Ship-to in checkout
*
* NOTES:
* - CSV converted to JSON at http://www.convertcsv.com/csv-to-json.htm
* - Window event handlers set in opc.js
* - triggered in step1.js
*
* REQUIRES: Jquery Mask plugin, opc.js, base.opc.config.form.js
* 
*/

(function($) {
	try {
		//Define the plugin's name here
		var __name = "zipValidation";
		//--
		$.fn[__name] = function(options) {
			//-- Vars
			//-- ------------------------------------------------------
			var f = function(s) {
				return self.view.find(s);
			};
			var zipField;
			var form;
			var data;
			var JSONurl = "/scripts/opc/APOzips.json";
			var fiveZip;
			var zipFourVal;
			var fiveArr;
			var zipBasedObj = {};

			//-- Plugin gymnastics - Part 1/3
			//-- ------------------------------------------------------
			var self = this; // prevent from losing the scope
			self.view = $(this);
			self.view.data(__name, self); // store the plugin instance into the element
			//-- ------------------------------------------------------

			//-- init
			//-- ------------------------------------------------------
			self.defaults = {
				zipField: null
			};

			self.initialize = function() {
				// merging defaults with passed arguments
				self.options = $.extend(true, {}, self.defaults, options);
				//-
				return ignite();
			};

			//-- Start
			//-- ------------------------------------------------------
			function ignite() {
				//console.log('zip ignite');
				//set vars now that we have options
				zipField = f(self.options.zipField);
				form = self.view;

				//require zip code fields to be present
				if (zipField && !zipField.data("loaded")) {
					//mark loaded to prevent multiple events on the same field
					zipField.data("loaded", true);

					//set standard mask on first load
					setMask();

					//trigger
					bindEvents();
				}

				return self;
			}

			function bindEvents() {
				//console.log("zip bind");

				//on 5 digit blur
				form.on("blur", self.options.zipField, function(e) {
					zipCheck();
				});
				//on 5 digit keypress
				form.on("keyup", self.options.zipField, function(e) {
					zipCheck();
				});

				form.on("validate", self.options.zipField, function(e) {
					validate();
				});
				form.on("invalidate", self.options.zipField, function(e) {
					invalidate();
				});
				form.on("requireFour", self.options.zipField, function(e) {
					//pop message saying 4 more are needed
					//console.log('requires 4 more');
					popMessage();
				});
				form.on("reset", self.options.zipField, function(e) {
					//when user starts over and we need to clear requirements
					resetAttr();
				});
			}

			function zipCheck() {
				//console.log("zipcheck");

				var zipVal = zipField.val();
				//stop check if field doesn't contain at least 5 characters
				if (zipVal.length < 5) {
					zipField.trigger("reset");
					return;
				}

				//do the first 5 digits match the APO zips?
				fiveZip = zipVal.substring(0, 5);
				//get JSON reference
				if (!data && data != "fail") {
					getJSON(zipCheck);
					return;
				}

				//check for zip match
				var match = fiveCheck(zipVal.substring(0, 5));

				if (!match) {
					zipField.trigger("reset");
					return;
				}

				//if match and exactly 5 characters, store defaults, change max lengths on field and auto-include dash
				if (zipVal.length == 5) {
					//save original values
					zipField.maxLength = zipField.attr("maxlength");
					zipField.size = zipField.attr("size");

					//set new values
					zipField.attr("maxlength", "10");
					zipField.attr("size", "10");

					//and require that 4 more digits be entered (5 including the dash that is auto included)
					zipField.unmask().mask("00000-0000", {});
					zipField.val(zipField.val() + "-");

					//require four more digits
					zipField.trigger("requireFour");
				}

				//THIS CONDITION CAN'T EXIST WITHOUT THE ATTRIBUTE CHANGES ABOVE
				//run validation on 4 additional digits
				zipFourVal = zipVal.split("-")[1];

				if (!zipFourVal || zipFourVal.length != 4) {
					//test
					return;
				}

				//Do the +4 match a zip?
				//if so, mark field as valid
				//if not, popMessage()
				fourCheck()
					? zipField.trigger("validate")
					: zipField.trigger("invalidate");
			}

			function fiveCheck(zipVal) {
				//returns -1 or index (Bool)
				return data
					.map(function(obj, i, me) {
						return obj["5DigitZip"];
					})
					.indexOf(zipVal) == -1
					? false
					: true;
			}

			function fourCheck() {
				//build zip based array if it doesn't exist
				if (jQuery.isEmptyObject(zipBasedObj)) {
					for (var i = 0; i < data.length; i++) {
						//check for 5zip array key
						if (!zipBasedObj[data[i]["5DigitZip"]]) {
							//create blank entry as array to push to
							zipBasedObj[data[i]["5DigitZip"]] = [];
						}

						//push 4 zip to new 5zip key
						zipBasedObj[data[i]["5DigitZip"]].push(data[i]["Zip4"]);
					}
				}

				//do the inputted 4 digits match the APO zips and belonging to the fiveField?
				//console.log(zipBasedObj[fiveZip]);

				return zipBasedObj[fiveZip].indexOf(zipFourVal) == -1
					? false
					: true;
			}

			function resetAttr() {
				//reset attributes only if they were changed
				//zipField.maxLength is only present if changed
				if (zipField.maxLength) {
					zipField.attr("maxlength", zipField.maxLength);
					zipField.attr("size", zipField.size);
					setMask();
					zipField.firstCheckDone = false;
					validate();
				}
			}

			function popMessage() {
				zipField.data("valid", false);
				$(window).trigger("errors", [
					{
						postalCode0:
							"The USPS requires a valid +4 ZIP code for FPO addresses. To find the correct +4 ZIP code, <a href='https://tools.usps.com/go/ZipLookupAction!input.action?mode=0&refresh=true' target='_blank'>click here</a>."
					},
					"singleshipformid"
				]);
			}

			function validate() {
				// console.log('validate');
				zipField.data("valid", true);
				$(window).trigger("clearErrors");
			}

			function invalidate() {
				//console.log('invalidate');
				zipField.data("valid", false);
				$(window).trigger("errors", [
					{
						postalCode0:
							"Oops! This APO/FPO ZIP is invalid. Please use valid +4 digits. To find the correct +4 ZIP code, <a href='https://tools.usps.com/go/ZipLookupAction!input.action?mode=0&refresh=true' target='_blank'>click here</a>."
					},
					"singleshipformid"
				]);
			}

			function setMask() {
				var options = {
					onKeyPress: function(cep, e, field, options) {
						mask = cep.length < 5 ? "00000" : "00000-0000";
						zipField.mask(mask, options);
					}
				};
				zipField.mask("00000-0000", options);

				//original...
				//zipField.unmask().mask("99999",{});
			}

			function getJSON(callback) {
				$.ajax({
					url: JSONurl,
					complete: function(response) {
						/*
                        EXPECTED SAMPLE RESPONSE:
                        [{"5DigitZip":09501,"Zip4":1503,"UNIT/SHIP":"HSC 9"},
                        {"5DigitZip":09501,"Zip4":1913,"UNIT/SHIP":"PATROL COASTAL CREW D"}]

                    */

						if (response) {
							data = JSON.parse(response.responseText);
							callback();
						} else {
							data = "fail";
						}
					}
				});
			}

			//-
			return self.initialize();
		};
	} catch (e) {}
})(jQuery);
