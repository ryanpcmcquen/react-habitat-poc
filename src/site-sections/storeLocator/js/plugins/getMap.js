// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
(function($, window, document, undefined) {
	try {
		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "getMap",
			defaults = {
				propertyName: "value"
			};

		// The actual plugin constructor
		function Plugin(element, options) {
			this.element = element;
			this.el = $(element);

			this.selector = this.element.id;

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend({}, defaults, options);
			this._defaults = defaults;
			this._name = pluginName;
			// create shortcut for searching faster within the element
			this.dig = function(sbj) {
				return $(this.element).find(sbj);
			};
			this.init();
		}

		/***********************************
		 * PLUGIN LOGIC GOES HERE
		 ***********************************/
		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
			myLatLng: { lat: 37.7882742, lng: -122.4046895 },
			init: function() {
				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like the example below
				this.bindEvents();
				this.getStoreLatLng();
			},
			bindEvents: function() {
				var me = this;

				$(document).ready(function() {
					//Handle "Get Directions" click
					$("#getDirectionLinkId").on("click", function(event) {
						me.getDirections();
					});

					//Deselect "Use my location" when address field is changed
					$("#startAddressControl").on("change keydown", function(
						event
					) {
						if ($(this).is(":checked")) {
							$("#useCurrentLocation").prop("checked", false);
						}

						if (!$("#addressMSG").hasClass("hide")) {
							$("#addressMSG").addClass("hide");
						}
					}); //Enable/Disable address field based on checkbox

					/*//Enable address field on click and uncheck "use my location"
                    $("#startAddressControlWrap").on('click', function(event) {
                        //console.log('click');
                        //console.log($(this).prop("disabled"));
                        if($("#startAddressControl").prop("disabled")){
                            $("#useCurrentLocation").prop("checked",false);
                            $("#startAddressControl").prop('disabled', false).focus();;
                        }

                    });

*/ $(
						"#useCurrentLocation"
					).on("change", function() {
						if (!$(this).is(":checked")) {
							$("#startAddressControl").prop("disabled", false);
						} else {
							$("#startAddressControl").prop("disabled", true);
						}
					});
				});
			},
			getStoreLatLng: function() {
				var me = this;
				var selector = this.selector;
				var address = $("#address").val();
				var geocoder = new google.maps.Geocoder();

				//console.log(address);

				geocoder.geocode({ address: address }, function(
					results,
					status
				) {
					if (status == google.maps.GeocoderStatus.OK) {
						//console.log(results);
						// do something with the geocoded result
						//
						// console.log(results[0].geometry.location.lat());
						me.myLatLng = {
							lat: results[0].geometry.location.lat(),
							lng: results[0].geometry.location.lng()
						};
						me.loadMap();
					}
				});
			},
			getCustAddress: function() {
				/* Discovered we can just use "saddr=Current%20Location" parameter and it's more accurate. 
                ** This function is not currently being used 2/1/2017 TF
                */

				var key = $("#googleApiKeyStoreLocator").val();

				$.ajax({
					url:
						"https://www.googleapis.com/geolocation/v1/geolocate?key=" +
						key,
					type: "POST"
				})
					.done(function(response) {
						//console.log("success");
						//console.log(response);

						var latlng = response.location;
						/* convert latlng to address

                    var geocoder = new google.maps.Geocoder();

                    geocoder.geocode({'location': latlng}, function(results, status) {
                        if (status === 'OK') {
                          if (results[1]) {
                            console.log('got address');
                            console.log(results);
                          } else {
                            window.alert('No results found');
                          }
                        } else {
                          window.alert('Geocoder failed due to: ' + status);
                        }
                    });*/

						//
					})
					.fail(function(response) {
						//console.log("error");
						//console.log(response);
					})
					.always(function() {
						//console.log("complete");
					});
			},
			loadMap: function() {
				var me = this;
				var selector = this.selector;
				var storeName = $("#storeName").val() || "";
				//console.log(loadMap);
				//console.log(this);

				var mapProp = {
					center: me.myLatLng,
					zoom: 15
				};
				var map = new google.maps.Map(
					document.getElementById(selector),
					mapProp
				);

				var marker = new google.maps.Marker({
					position: me.myLatLng,
					map: map,
					title: storeName
				});
			},
			getDirections: function() {
				//Use current location or entered address
				var startAddress = $("#useCurrentLocation").is(":checked")
					? "Current Location"
					: $("#startAddressControl")
							.val()
							.trim();
				var address = $("#address").val();
				var mapURL = "";

				//null check
				if (startAddress == "") {
					$("#addressMSG").removeClass("hide");
					return;
				}

				//Build Google link
				/* Display directions
                **
                ** Use this scheme to request and display directions between two locations. You can also specify the transportation mode.
                ** Parameters:

                ** saddr: Sets the starting point for directions searches. This can be a latitude,longitude or a query formatted address. If it is a query string that returns more than one result, the first result will be selected. If the value is left blank, then the user’s current location will be used.
                ** daddr: Sets the end point for directions searches. Has the same format and behavior as saddr.
                ** directionsmode: Method of transportation. Can be set to: driving, transit, bicycling or walking.
                **
                ** ex: //maps.google.com/?saddr=Google+Inc,+8th+Avenue,+New+York,+NY&daddr=John+F.+Kennedy+International+Airport,+Van+Wyck+Expressway,+Jamaica,+New+York&directionsmode=driving
                */

				mapURL =
					"//maps.google.com/?saddr=" +
					encodeURI(startAddress) +
					"&daddr=" +
					encodeURI(address) +
					"&directionsmode=driving";
				var win = window.open(mapURL, "_blank");
				win.focus();
			}
		});

		/***********************************
		 * END PLUGIN LOGIC
		 ***********************************/

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[pluginName] = function(options) {
			return this.each(function() {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(
						this,
						"plugin_" + pluginName,
						new Plugin(this, options)
					);
				}
			});
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery, window, document);
