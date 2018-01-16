(function($) {
	try {
		//Define the plugin's name here
		var __name = "step1_ppx";
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
				self.step = "1";
				//-
				ignite();
				return self;
			};

			//-- Vars
			//-- ------------------------------------------------------
			var current = base.opc.config.form.current;
			var dig = function(sbj) {
				return self.view.find(sbj);
			};
			var isPayPalInvalidAddr = false;

			var success = function() {
				var cnf = self.options.cnf;
				var data = self.options.data;
				var cartUpdate = self.options.cartUpdate;
				var eScript = $(data).filter("script");
				try {
					!eScript.length || eval(eScript.text());
				} catch (e) {
					console.log("step1_ppx error", e);
				}

				dig("#step1load, #step1form").hide();

				//console.log(data);
				dig("#step1info")
					.hide()
					.on("htmlOverride.done", function(evt) {
						var showForm = dig("#step1info")
							.slideDown(444)
							.find("form#paypalformid")
							.hasClass("paypalInvalidAddr");
						isPayPalInvalidAddr = showForm;

						switch (cnf) {
							case "tpl_single_electronic_ppx":
								!base.opc.isElectronicOnly ||
									dig("#step2head").hide(); // hide the shipping options heading and step2form
								//dig('.stepInfoPPX table tr:nth-child(2)').children('td').html('<p id="ppmessage">' + base.opc.config.copy.noShippingAddrNeeded + '</p>');
								break;
						}

						//-
						bindEvents(!showForm);
					})
					.htmlOverride(data);
			};

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				//- Kill object first
				self.view[__name] = null;

				self.options.success ? success() : bindEvents(false);
			}

			function checkForRegistryValue(val) {
				return parseInt(val) > 9999999999;
			}

			function bindEvents(hideForm) {
				self.view.off("stepErrors").on("stepErrors", function(evt) {
					dig(".stepLoad").hide();
					$(window).trigger("methodRequest", [
						"retainFormValues",
						{
							callback: function() {
								$(window).trigger("methodRequest", [
									"loadTemplate",
									{
										tpl: "tpl_single1_ppx_SILENT",
										clearErrors: false
									}
								]);
							}
						}
					]);
				});
				$(window)
					.off("stepLoaded")
					.on("stepLoaded", function(evt, step) {
						//console.log('stepLoaded');
						if (step == "step2_ppx") bindEvents(hideForm);
					});

				//- REGISTRY AND SAVED ADDRESS
				//- saved address keys are different than destination form's element names:
				var aFormElmMap = {
					fname: "ssfname",
					lname: "sslname",
					address1: "ssaddr1",
					address2: "ssaddr2",
					city: "sscity",
					state: "shipAddressState",
					postalCode: "sszip",
					phone: "ssphone",
					country: "sscountry"
				};
				var eShippingFormId_Operation = dig(
					"#opcShippingFormId_Operation"
				);
				var eUseGiftRegistryAddr = dig("#useGiftRegistryAddr");

				eUseGiftRegistryAddr.unbind("click").on("click", function(evt) {
					var isChecked = $(this).is(":checked");
					var aValues = [];
					var sKeyPrefix = "ss";
					var sDDVal = eShippingFormId_Operation.val(),
						isRegistry = checkForRegistryValue(sDDVal);

					eShippingFormId_Operation.prop("disabled", !isChecked);

					!isRegistry ||
						(function() {
							aValues.push({
								key: "#registryId",
								val: isChecked ? sDDVal : ""
							});
							aValues.push({
								key: "#shippingAddressOperation",
								val: "registry"
							});
						})();

					fnShowHideForm(
						isChecked ? checkForRegistryValue(sDDVal) : false
					);

					isRegistry ||
						aValues.push({
							key: "#shippingAddressOperation",
							val: isChecked
								? dig("#opcShippingFormId_Operation").val()
								: ""
						});

					var aAddresses =
						base.opc.config.form.addresses[
							isChecked
								? dig("#opcShippingFormId_Operation").val()
								: "init"
						];

					if (!base.fn.und(aAddresses)) {
						$.each(aAddresses, function(k, v) {
							aValues.push({
								key: "#" + (isChecked ? aFormElmMap[k] : k),
								val: isRegistry ? "" : v
							});
						});
					}
					//console.log(['base.opc.config.form.addresses', base.opc.config.form.addresses]);
					//console.log(['aValues', aValues]);

					//- Padding values to #singleshipformid form
					$(window).trigger("methodRequest", [
						"passFormValues",
						{
							form: "#singleshipformid",
							values: aValues
						}
					]);
				});

				//- Existing address dropdown

				var fnShowHideForm = function(hide) {
					var s = eShippingFormId_Operation.val();
					s = base.fn.und(s) ? "" : s;

					dig(".name, .address, .citystatezip, .phone")[
						hide || checkForRegistryValue(s)
							? "addClass"
							: "removeClass"
					]("hideThis");
					dig(".savedRegistryAddress")[
						hide ? "removeClass" : "addClass"
					]("hideThis");
				};

				fnShowHideForm(
					!!hideForm ||
						checkForRegistryValue(eShippingFormId_Operation.val())
				);

				eShippingFormId_Operation
					.unbind("change")
					.on("change", function(evt) {
						//var a = base.opc.config.form.addresses[$(this).val()];
						var sDDVal = $(this).val(),
							isRegistry = checkForRegistryValue(sDDVal),
							aAddresses = {},
							aValues = [],
							sKeyPrefix = "ss";
						//-
						if (sDDVal == "" || isRegistry)
							fnShowHideForm(isRegistry);
						if (base.fn.und(sDDVal)) return;

						//- Enter new address
						if (sDDVal == "") {
							$.each(aFormElmMap, function(k, v) {
								aValues.push({
									key: "#" + v,
									val: ""
								});
							});
							$(window).trigger("methodRequest", [
								"passFormValues",
								{
									form: "#paypalformid",
									values: aValues
								}
							]);
							return;
						}

						aValues.push({
							key: "#shippingAddressOperation",
							val: isRegistry ? "registry" : sDDVal
						});

						//console.log(['base.opc.config.form.addresses', base.opc.config.form.addresses[$(this).val()]]);return;
						!isRegistry || dig("#saveAddressPanel").hide();
						isRegistry
							? aValues.push({
									key: "#registryId",
									val: sDDVal
								})
							: (function() {
									if (sDDVal == "") return;
									var aAddresses =
										base.opc.config.form.addresses[sDDVal];
									if (base.fn.und(aAddresses)) return;

									//- Prepare new values
									$.each(aAddresses, function(k, v) {
										aValues.push({
											key: "#" + aFormElmMap[k],
											val: v
										});
									});
								})();

						fnShowHideForm(checkForRegistryValue(sDDVal));

						$(window).trigger("methodRequest", [
							"passFormValues",
							{
								form: "#singleshipformid",
								values: aValues,
								before: function() {
									if (
										base.fn.und(
											base.opc.config.form.addresses.init
										)
									)
										$("#step2_ppx").trigger(
											"saveInitFormAddress"
										);
								}
							}
						]);

						if (base.fn.und(base.opc.config.form.addresses[sDDVal]))
							return;

						aValues.push({
							key: "#ssstate",
							val: base.opc.config.form.addresses[sDDVal]["state"]
						});

						$(window).trigger("methodRequest", [
							"passFormValues",
							{
								form: "#paypalformid",
								values: aValues
							}
						]);

						//$(this).parents('.addrform').find('[id^="shippingAddressOperation"]').val($(this).val());

						/*
				$(window).trigger('methodRequest', [ 'autoFillAddress', {
					elm : $(this)
				}]);*/

						if ($(this).val() && $(this).val().length < 1)
							dig("#saveAddressPanel label")
								.hide()
								.eq(1)
								.show();
						else
							dig("#saveAddressPanel label")
								.hide()
								.eq(0)
								.show();

						$(window).trigger("methodRequest", [
							"clearAllErrors",
							{}
						]);
					});

				if (isPayPalInvalidAddr) {
					var sDDVal = eShippingFormId_Operation
						.prop("disabled", false)
						.val();
					var aValues = [];
					var aKeyMatch = {
						address1: "addr1",
						address2: "addr2",
						postalCode: "zip"
					};

					if (checkForRegistryValue(sDDVal)) {
						dig("#saveAddressPanel").hide();
						dig("#registryId").val(sDDVal);
						dig("#shippingAddressOperation").val("registry");
					} else {
						if (
							!base.fn.und(base.opc.config.form.addresses[sDDVal])
						) {
							$.each(
								base.opc.config.form.addresses[sDDVal],
								function(k, v) {
									aValues.push({
										key:
											"#ss" +
											(base.fn.und(aKeyMatch[k])
												? k
												: aKeyMatch[k]),
										val: v
									});
								}
							);

							$(window).trigger("methodRequest", [
								"passFormValues",
								{
									form: "#paypalformid",
									values: aValues
								}
							]);
						}
					}
				}

				$(window).trigger("methodRequest", [
					"formValuesRetained",
					{
						view: self.view,
						from: __name
					}
				]);
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
