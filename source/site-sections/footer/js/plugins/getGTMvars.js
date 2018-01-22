/**
 * getGTMvars will retrieve all vars on page for submission to the GTM dataLayer. Should be fired after DOMready
 *
 * Author: tfritsch 09/14/2015
 *
 * GTMvar - makes this data available to the plugin
 * GTMgroup - is a new array for the data object
 * GTMid - is an object in the GTMgroup array
 *
 * Example and expected input HTML:
 * <input type="hidden" data-GTMvar data-GTMgroup="product" data-GTMid="itemId" name="sku" value="${itemId}" />
 * <input type="hidden" data-GTMvar name="sku" value="${itemId}" />
 *
 * Requires: jQuery
 * Note: Relies on Google Tag Manager, but is not required to be loaded prior to usage.
 *
 **/

(function($) {
	try {
		//Define the plugin's name here
		var __name = "getGTMvars";
		//--
		$.fn[__name] = function(options) {
			//-- ------------------------------------------------------
			var self = this; // prevent from losing the scope
			self.view = $(this);
			self.view.data(__name, self); // store the plugin instance into the element
			//-- ------------------------------------------------------

			//-- init
			//-- ------------------------------------------------------
			self.defaults = {};

			self.initialize = function() {
				// merging defaults with passed arguments
				self.options = $.extend(true, {}, self.defaults, options);
				//-
				return ignite();
			};

			//-- Vars
			//-- ------------------------------------------------------
			var f = function(s) {
				return self.view.find(s);
			};

			//-- Start
			//-- ------------------------------------------------------
			function ignite() {
				bindEvents();
				getVars();
				return self;
			}

			function bindEvents() {}

			function getVars() {
				var data = {};
				$("input[data-GTMvar]").each(function() {
					var val = $(this).val();
					var key = $(this).attr("name");
					var group = $(this).data("gtmgroup");
					var id = $(this).data("gtmid");

					//is there a group? if so, create multi-dimensional array
					if (group) {
						//create group
						data[group] =
							typeof data[group] == "undefined"
								? {}
								: data[group];
						//create id
						data[group][id] =
							typeof data[group][id] == "undefined"
								? {}
								: data[group][id];

						data[group][id][key] = val;
					} else {
						data[key] = val;
					}
				});

				//make sure we actually have data to pass
				if (Object.keys(data).length > 0) {
					submitData(data);
					return data;
				}

				return false;
			}

			function submitData(data) {
				if (typeof dataLayer == "undefined") {
					dataLayer = [];
				}

				dataLayer.push({
					event: data.event ? data.event : "",
					data: data
				});
				dataLayer.push({
					event: "pageDataLayerAvailable"
				});

				return data;
			}

			//-
			return self.initialize();
		};
	} catch (e) {}
})(jQuery);
