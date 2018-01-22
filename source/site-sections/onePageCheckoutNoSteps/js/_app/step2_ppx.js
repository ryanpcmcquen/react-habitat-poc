(function($) {
	try {
		//Define the plugin's name here
		var __name = "step2_ppx";
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
			var current = base.opc.config.form.current;
			var dig = function(sbj) {
				return self.view.find(sbj);
			};

			var success = function() {
				var cnf = self.options.cnf;
				var data = self.options.data;
				var cartUpdate = self.options.cartUpdate;
				var eScript = $(data).filter("script");
				!eScript.length || eval(eScript.text());

				var e = dig("#step2form");
				var f = function() {
					//console.log('stepLoaded b4');
					$(window).trigger("stepLoaded", ["step2_ppx"]);
				};
				dig("#step2head").show();
				e.hide().removeAttr("style");

				e = base.fn.und(cartUpdate)
					? e
							.hide()
							.htmlOverride(data)
							.slideDown()
							.on("htmlOverride.done", f)
					: e.htmlOverride(data).on("htmlOverride.done", f);
				//-
				bindEvents();
			};

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				//- Kill object first
				self.view[__name] = null;

				self.options.success ? success() : bindEvents();
			}

			function bindEvents() {
				$(window).trigger("methodRequest", [
					"formValuesRetained",
					{
						view: self.view,
						from: __name
					}
				]);

				self.view
					.off("saveInitFormAddress")
					.on("saveInitFormAddress", function(evt) {
						saveInitFormAddress();
					});

				saveInitFormAddress();

				self.view.off("stepErrors").on("stepErrors", function(evt) {
					dig(".stepLoad").fadeOut(444);
				});
				//console.log(['bindEvents', self.view]);

				//- On sidebar cart update event
				onCartUpdate();

				dig("#showGiftOptLink")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						//$('*').qtip('destroy');

						//$(this).toggleClass('active');
						dig("#giftopt1").toggle();
						dig("#gobbot1").toggleClass("gobbotcorner");
						dig("#gobbot1").toggleClass("cobbotcorner");
					});
				openShowGiftOptLink();

				//- Gift card allowed chars
				//$('.giftmsgform input[type="text"]').giftCardValidation();

				var eDD = dig("#opcShippingFormId_Operation");
				if (eDD.length) {
					eDD.val(eDD.find("optgroup option:first").val());
					dig(".addrform")
						.find('[id^="shippingAddressOperation"]')
						.val(eDD.val());
					$(window).trigger("methodRequest", [
						"autoFillAddress",
						{
							elm: eDD
						}
					]);
				}

				dig(".goptitem, .shippingMethod")
					.unbind("click")
					.on("click", function(evt) {
						$(window).trigger("methodRequest", [
							"retainFormValues",
							{
								callback: function() {
									$(window).trigger("methodRequest", [
										"submitForm",
										{
											obj: $("#shippingSubmit"),
											cnf: "singleStep1p2_SILENT",
											form: "#singleshipformid",
											callback: function(data) {
												if (data.success !== true) {
													$(window).trigger(
														"errors",
														[
															data,
															base.opc.config.form
																.current.id
														]
													);
													return false;
												}
												$("#cartsummary").trigger(
													"forceUpdateItem",
													[{}]
												);
											}
										}
									]);
								}
							}
						]);
					});
			}

			function saveInitFormAddress() {
				//- retain init address
				base.opc.config.form.addresses["init"] = {};
				dig('#singleshipformid input[type="hidden"]')
					.filter(function() {
						if (base.fn.und($(this).attr("id"))) return false;
						return (
							$(this)
								.attr("id")
								.indexOf("ss") != -1
						);
					})
					.each(function() {
						//- retain previous val
						base.opc.config.form.addresses["init"][
							$(this).attr("id")
						] = $(this).val();
					});
			}

			function openShowGiftOptLink() {
				var hasData = false;
				dig("#giftopt1")
					.find('input[type="text"], input[type="checkbox"]')
					.each(function() {
						if (hasData) return;
						switch ($(this).getInputType()) {
							case "text":
								hasData = $(this).val() != "";
								break;
							case "checkbox":
								hasData = $(this).prop("checked") == true;
								break;
						}
					});
				hasData ? dig("#showGiftOptLink").trigger("click") : "";
			}

			function onCartUpdate() {
				self.view.off("cartUpdate").on("cartUpdate", function(evt) {
					var tpl = [];
					tpl.push("tpl_shippingMethods_ppx");

					$(window).trigger("methodRequest", [
						"loadTemplate",
						{
							tpl: tpl,
							cartUpdate: true
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
