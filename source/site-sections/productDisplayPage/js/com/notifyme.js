(function($) {
	try {
		//Define the plugin's name here
		var __name = "notifyme";
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

				self.view.scroll2();

				return self;
			}

			function bindEvents() {
				var toggleSubmit = function(disable) {
						f("#product-availability-outOfStockPopover-action")
							[disable ? "addClass" : "removeClass"]("disabled")
							.find('input[type="submit"]')
							.prop("disabled", disable);
					},
					validEmail = function(s) {
						var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

						return emailRegex.test(s);
					};

				var t = PDPTracking.ga.notifyme;
				pdpTracker(t.load[0], t.load[1], t.load[2]);

				f("form").on("submit", function(evt) {
					$(this).ajaxSubmit({
						beforeSubmit: function showRequest(
							formData,
							jqForm,
							options
						) {
							// formData is an array; here we use $.param to convert it to a string to display it
							// but the form plugin does this for you automatically when it submits the data
							var queryString = $.param(formData);

							// jqForm is a jQuery object encapsulating the form element.  To access the
							// DOM element for the form do this:
							// var formElement = jqForm[0];

							console.log("About to submit: \n\n" + queryString);

							// here we could return false to prevent the form from being submitted;
							// returning anything other than false will allow the form submit to continue
							return true;
						},
						success: function(data) {
							if (data == "") {
								f("#notifyMeThankyouPopup").show();
								f("#notifyMeFormPopup").hide();
								return;
							}

							self.view.html($(data).show()).show(333);
							self.view.find(".server").show();

							bindEvents();
						}
					});
					return false;
				});

				//- verify email address on keydown
				toggleSubmit(true);

				//- Subscribe to newsletter opt-out
				f("#subscribe").on("click", function(evt) {
					if (!$(this).is(":checked"))
						pdpTracker(
							t.subscribe[0],
							t.subscribe[1],
							t.subscribe[2]
						);
				});

				//- Enable/Disable submit on keyup/focus/blur
				f("#product-availability-outOfStockPopover-email")
					.off("blur")
					.on("blur", function(evt) {
						if (!validEmail($(this).val()))
							return $(this)
								.prev('label[for="' + $(this).attr("id") + '"]')
								.find("span.error:not(.server)")
								.show();
						var em = f(
							"#product-availability-outOfStockPopover-email"
						).val();
						toggleSubmit(em != $(this).val() || !validEmail(em));
					})
					.off("keydown focus")
					.on("keydown focus", function(evt) {
						$(this)
							.parent()
							.find(".error:not(.server)")
							.hide();
					})
					.focus();

				f("#product-availability-outOfStockPopover-confirmEmail")
					.off("keyup blur focus")
					.on("keyup blur focus", function(evt) {
						var em = f(
							"#product-availability-outOfStockPopover-email"
						).val();
						var isMatch = em == $(this).val();
						if (!isMatch)
							$(this)
								.prev('label[for="' + $(this).attr("id") + '"]')
								.find("span.error")
								[evt.type == "blur" ? "show" : "hide"]();
						toggleSubmit(!isMatch || !validEmail(em));
					});

				/*
            **    Notify me
             */
				f(".product-outOfStock").click(function(evt) {
					//- Google Analytics Tracking
					var e = _gatrackr.availability.outofstock;
					pdpTracker(e[0], e[1], e[2] + $(this).attr("data-sku"));
					f("div#product-availability-outOfStockPopover").show();
				});
				f(".product-close").on("click", function(evt) {
					evt.preventDefault();
					kill();
				});

				f(
					"div#product-availability-outOfStockPopover-thankYou a"
				).click(function() {
					f(
						"div#product-availability-outOfStockPopover-thankYou"
					).hide();
				});
				f(
					"div#product-availability-outOfStockPopover-thankYou span.product-close"
				).click(function() {
					f(
						"div#product-availability-outOfStockPopover-thankYou"
					).hide();
				});
			}

			function kill() {
				self.view.empty();
			}

			//-
			return self.initialize();
		};
	} catch (e) {}
})(jQuery);
