(function($) {
	try {
		//Define the plugin's name here
		var __name = "thankyou";
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
			var dig = function(sbj) {
				return self.view.find(sbj);
			};

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				//- Kill object first
				self.view[__name] = null;

				bindEvents();
			}

			function bindEvents() {
				console.log("load thankyou");
				dig(".acctmanagementshippinginfotrigger").on("click", function(
					evt
				) {
					evt.preventDefault();
					//-
					var url = base.opc.config.modals[$(this).attr("rel")];
					self.loadPage(url);
					/*
				base.fn.und(url) || modal({
					param : {
						url : url
					}
				});*/
				});
			}

			//- Function taken from previous js code which was present in many pages. Ideally, we would use a different modal system (Simple Modal!) Styles are already implemented. Leaving as is for now...

			var loadPage = (self.loadPage = function(url) {
				$.get(url, function(data) {
					dig("#xyz").html(data);
				});
			});

			/*
		function modal(args) {

			var opt = {
				model : 'modal-ajax',
				param : {
					url : url
				}
			};

			opt = $.extend({}, opt, args);

			$.fn.SimpleModal({
				model: opt.model,
				param : opt.param
			}).showModal();
		}*/

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
