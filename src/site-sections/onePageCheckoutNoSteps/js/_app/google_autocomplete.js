(function() {
	//console.log('google autocomplete');

	var autocomplete = [];
	var autocompletelistener = [];
	var componentForm = [];
	var currentForm = [];
	var ignoreList = []; /* add keys to ignore i.e. ignoreList.push("billingForm");*/

	/* Define if we want to use short / long value for each field */
	var componentFormDefault = {
		street_number: "short_name",
		route: "long_name",
		locality: "long_name",
		administrative_area_level_1: "short_name",
		country: "long_name",
		postal_code: "short_name"
	};

	/* Google expects the fields to be named as the componentForm, but we have our own field names
         so currentForm is used to map google and our form field names. This must be passed in by the caller.

         i.e.
              var currentForm = {
            key: 'uniqueKey'
            street_number: 'ssaddr1',
            route: 'ssaddr1',
            locality: 'sscity',
            administrative_area_level_1: 'ssstate',
            postal_code: 'sszip',
            apartment: 'ssaddr2'
          };

       */

	/* Custom event to initialize the textbox that will trigger the suggestions */
	$(window).on("initGAutocomplete", function(evt, data) {
		if (data) {
			if (data.componentForm) {
				componentForm[data.currentForm.key] = data.componentForm;
			} else {
				componentForm[data.currentForm.key] = componentFormDefault;
			}

			if (data.currentForm) {
				if (ignoreList.indexOf(data.currentForm.key) != -1) {
					return;
				}

				currentForm[data.currentForm.key] = data.currentForm;
			} else {
				console.log("Unable to set up Google Autocomplete");
				return;
			}

			var el = $("#" + data.currentForm.autocompleteBoxId).length;
			if (el > 0) {
				initAutocomplete(data);
			}
		}
	});
	/* Custom event to initialize the textbox that will trigger the suggestions */
	$(window).on("disableGAutocomplete", function(evt, key) {
		disableAutoComplete(key);
	});

	/* Custom event to initialize the textbox that will trigger the suggestions */
	$(window).on("hideGAutocomplete", function(evt) {
		hideGAutocomplete();
	});

	function disableAutoComplete(key) {
		google.maps.event.clearInstanceListeners(autocomplete[key]);
		google.maps.event.clearInstanceListeners(
			document.getElementById(currentForm[key].street_number)
		);

		$(".pac-container").remove();
		currentForm[key].isEnabled = false;
		currentForm[key] = "";

		$(window).trigger("AfterDisableGAutocomplete");
	}

	function hideGAutocomplete() {
		$(".pac-container").remove();
	}

	function initAutocomplete(data) {
		// Create the autocomplete object, restricting the search to geographical
		// location types.
		if (
			currentForm[data.currentForm.key] &&
			currentForm[data.currentForm.key].isEnabled != "undefined" &&
			currentForm[data.currentForm.key].isEnabled
		) {
			//disableAutoComplete(data.currentForm.key);
			//return;
		}
		autocomplete[
			data.currentForm.key
		] = new google.maps.places.Autocomplete(
			document.getElementById(data.currentForm.autocompleteBoxId),
			{ types: ["address"] }
		);

		// When the user selects an address from the dropdown, populate the address
		// fields in the form.

		currentForm[data.currentForm.key].isEnabled = true;
		google.maps.event.addListener(
			autocomplete[data.currentForm.key],
			"place_changed",
			function() {
				console.log("fill address autocomplete");
				fillInAddress(data.currentForm.key);
			}
		);
	}

	function fillInAddress(key) {
		// Get the place details from the autocomplete object.
		var place = autocomplete[key].getPlace();
		for (var component in currentForm[key]) {
			var el = document.getElementById(component);
			if (!el) {
				el = document.getElementById(currentForm[key][component]);
			}

			if (el) {
				el.value = "";
				el.disabled = false;
			}
		}

		// Get each component of the address from the place details
		// and fill the corresponding field on the form.
		for (var i = 0; i < place.address_components.length; i++) {
			var addressType = place.address_components[i].types[0];
			if (currentForm[key][addressType]) {
				var val =
					place.address_components[i][
						componentForm[key][addressType]
					];
				var currentValue = document.getElementById(
					currentForm[key][addressType]
				).value;
				var element = document.getElementById(
					currentForm[key][addressType]
				);
				if (currentValue.length > 0) {
					element.value = currentValue + " " + val;
				} else {
					element.value = val;
				}
				$(element).change();
				if (typeof $(element).valid == "function") {
					$(element).valid();
				}
			}
		}
	}

	function geolocate(key) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var geolocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				var circle = new google.maps.Circle({
					center: geolocation,
					radius: position.coords.accuracy
				});
				autocomplete[key].setBounds(circle.getBounds());
			});
		}
	}
})();
