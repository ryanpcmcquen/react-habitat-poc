(function($) {
	try {
		//Define the plugin's name here
		var __name = "stepAccount_common";
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

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				bindEvents();
			}

			function bindEvents() {
				//- Create my account link

				var eCreateAccount = dig('[name="createaccount"]');
				var eACwrapper = dig("#cAwrapper");

				dig("#aclink, #aclinkCancel")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						//-
						$(window).trigger("methodRequest", [
							"clearAllErrors",
							{}
						]);

						killStyle(dig("#step3ACform"));
						eCreateAccount.val(
							eCreateAccount.val() == "false" ? "true" : "false"
						);
						eACwrapper.slideToggle(250);
						return false;
					});

				//- create account checkbox
				/*
			var eCheckbox = dig('input[name="createaccount"]');
			eCheckbox
			.unbind('click')
			.on('click', function(evt) {
				killStyle(dig('#step3ACform'));
				eACwrapper[$(this).is(':checked') ? 'slideDown' : 'slideUp'](250);
			});
			eACwrapper[eCheckbox.is(':checked') ? 'slideDown' : 'slideUp'](250);*/

				//- Create account link
				dig(".editLink")
					.unbind("click")
					.on("click", function(evt) {
						evt.preventDefault();
						isSubmitted = false;
						$(window).trigger("methodRequest", [
							"collapseSteps",
							{
								steps: [
									base.opc.isPPX ? "#step4form" : "#step3form"
								]
							}
						]);
						dig("#step3ACinfo").slideUp(500);
						dig("#step3ACform").slideDown(500, function() {
							killStyle($(this));
							//eCheckbox.prop('checked', true);
							eCreateAccount.val("true");
							eACwrapper.slideDown(250);
						});
					});
			}

			function killStyle(el) {
				el.removeAttr("style");
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
