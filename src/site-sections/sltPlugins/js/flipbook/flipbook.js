(function($) {
	try {
		//Define the plugin's name here
		var __name = "flipbook";
		//--
		$.fn[__name] = function(options) {
			//-- Plugin gymnastics - Part 1/3
			//-- ------------------------------------------------------
			var self = this; // prevent from loosing the scope
			self.view = $(this);
			self.view.data(__name, self); // store the plugin instance into the element
			self.el = $(self.selector);
			//-- ------------------------------------------------------

			//-- init
			//-- ------------------------------------------------------
			self.defaults = {
				pages: 20,
				imgSrc: "/images/turnjs/",
				downloadSrc: ""
			};

			self.initialize = function() {
				// merging defaults with passed arguments
				self.options = $.extend({}, self.defaults, options);
				//-
				ignite();
				return self;
			};

			//-- Vars
			//-- ------------------------------------------------------
			var flipPages;
			var flipImgSrc;
			var flipDownloadSrc;
			window.flipbookFirstLoaded =
				window.flipbookFirstLoaded == undefined
					? false
					: window.flipbookFirstLoaded;
			var dig = function(sbj) {
				return self.view.find(sbj);
			};

			//-- Start
			//-- ------------------------------------------------------

			function ignite() {
				//console.log('flipbook ignite');

				//- Kill object first
				self.view[__name] = null;

				/* LOADED GLOBALLY
            if(!window.flipbookFirstLoaded){
                        
                $.getScript('http://www.surlatable.com/images/_scripts/turnjs/hash.js');   
                $.getScript('http://www.surlatable.com/images/_scripts/turnjs/zoom.min.js');
                $.getScript('http://www.surlatable.com/images/_scripts/turnjs/magazine3.js');
                $.getScript('http://www.surlatable.com/images/_scripts/turnjs/turn.js');
                $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'http://www.surlatable.com/images/_scripts/turnjs/css/magazine.css') );           

            }
            */

				buildDOM();
				bindEvents();
			}

			function bindEvents() {
				$(self.selector).on("click", function() {
					//get data
					//console.log('click');
					flipPages = $(self.selector).attr("data-pages");
					flipImgSrc = $(self.selector).attr("data-imgSrc");
					flipDownloadSrc = $(self.selector).attr("data-downloadSrc");
					flipWidth = $(self.selector).attr("data-flipWidth");
					flipHeight = $(self.selector).attr("data-flipHeight");

					imagePathHandler();
					downloadHandler();

					//loadApp();
				});

				//console.log('flipbook bindEvents');
				//console.log( self.selector);
				$(document).ready(function() {
					//get data from
					flipPages = $(self.selector).attr("data-pages");
					flipImgSrc = $(self.selector).attr("data-imgsrc");
					flipDownloadSrc = $(self.selector).attr("data-downloadSrc");
					flipWidth = $(self.selector).attr("data-flipWidth");
					flipHeight = $(self.selector).attr("data-flipHeight");

					//set links in popup
					imagePathHandler();
					downloadHandler();

					window.flipbookFirstPop = false;
					$("#flipBookPopup").jqm({
						overlay: 50,
						trigger: self.selector,
						closeClass: "popupclose",
						modal: true,
						onShow: function(hash) {
							var maskWidth = $(window).width();
							var maskHeight = $(document).height();

							//temporary
							if (!window.flipbookFirstPop) {
								window.flipbookFirstPop = true;

								loadApp();
							}

							hash.o.css({
								position: "absolute",
								height: maskHeight + "px",
								width: maskWidth + "px",
								backgroundColor: "#f1f1f1"
							});
							hash.o.prependTo("body");
							hash.o.fadeIn("1000");
							hash.w.fadeIn("1000");
						},
						onHide: function(hash) {
							hash.w.fadeOut("1000");
							hash.o.fadeOut("1000");
							hash.o.remove();
						}
					});
				});
			}

			function imagePathHandler() {
				if (flipImgSrc) {
					//console.log('set image');
					//console.log(flipImgSrc);
					$(".magazine").attr("data-imgsrc", flipImgSrc);
				}
			}
			function downloadHandler() {
				if (flipDownloadSrc) {
					var downloadAnchor =
						' <a href="' +
						flipDownloadSrc +
						'" style=" position: absolute;right: 150px;top: 20px;border-radius: 5px;background: #6D8B19;padding: 5px 15px;color:#fff;" id="flipbookDownload">Download</a> ';

					$(".flipbookDownloadLink").html(downloadAnchor);
				}
			}

			function loadApp() {
				//console.log('flipbook loadApp');

				var flipbook = $(".magazine");

				// Check if the CSS was already loaded

				if (flipbook.width() == 0 || flipbook.height() == 0) {
					setTimeout(loadApp, 10);
					return;
				}

				// Create the flipbook

				flipbook.turn({
					// Magazine width

					width: flipWidth,

					// Magazine height

					height: flipHeight,

					// Duration in millisecond

					duration: 1000,

					// Hardware acceleration

					acceleration: !flipisChrome(),

					// Enables gradients

					gradients: true,

					// Auto center this flipbook

					autoCenter: true,

					// Elevation from the edge of the flipbook when turning a page

					elevation: 50,

					// The number of pages

					pages: flipPages,

					// Events

					when: {
						turning: function(event, page, view) {
							var book = $(this),
								currentPage = book.turn("page"),
								pages = book.turn("pages");

							// Update the current URI

							Hash.go("page/" + page).update();

							// Show and hide navigation buttons

							flipdisableControls(page);

							$(".thumbnails .page-" + currentPage)
								.parent()
								.removeClass("current");

							$(".thumbnails .page-" + page)
								.parent()
								.addClass("current");
						},

						turned: function(event, page, view) {
							flipdisableControls(page);

							$(this).turn("center");

							if (page == 1) {
								$(this).turn("peel", "br");
							}
						},

						missing: function(event, pages) {
							// Add pages that aren't in the magazine

							for (var i = 0; i < pages.length; i++)
								flipaddPage(pages[i], $(this));
						}
					}
				});

				// Zoom.js

				$(".magazine-viewport").zoom({
					flipbook: $(".magazine"),

					max: function() {
						return (
							fliplargeMagazineWidth() / $(".magazine").width()
						);
					},

					when: {
						swipeLeft: function() {
							$(this)
								.zoom("flipbook")
								.turn("next");
						},

						swipeRight: function() {
							$(this)
								.zoom("flipbook")
								.turn("previous");
						},

						resize: function(event, scale, page, pageElement) {
							if (scale == 1)
								fliploadSmallPage(page, pageElement);
							else fliploadLargePage(page, pageElement);
						},

						zoomIn: function() {
							$(".thumbnails").hide();
							$(".made").hide();
							$(".magazine")
								.removeClass("animated")
								.addClass("zoom-in");
							$(".zoom-icon")
								.removeClass("zoom-icon-in")
								.addClass("zoom-icon-out");

							if (!window.escTip && !$.isTouch) {
								escTip = true;

								$("<div />", {
									class: "exit-message"
								})
									.html("<div>Press ESC to exit</div>")
									.appendTo($("body"))
									.delay(2000)
									.animate(
										{
											opacity: 0
										},
										500,
										function() {
											$(this).remove();
										}
									);
							}
						},

						zoomOut: function() {
							$(".exit-message").hide();
							$(".thumbnails").fadeIn();
							$(".made").fadeIn();
							$(".zoom-icon")
								.removeClass("zoom-icon-out")
								.addClass("zoom-icon-in");

							setTimeout(function() {
								$(".magazine")
									.addClass("animated")
									.removeClass("zoom-in");
								flipresizeViewport();
							}, 0);
						}
					}
				});

				// Zoom event

				if ($.isTouch)
					$(".magazine-viewport").bind("zoom.doubleTap", flipzoomTo);
				else $(".magazine-viewport").bind("zoom.tap", flipzoomTo);

				// Using arrow keys to turn the page

				$(document).keydown(function(e) {
					var previous = 37,
						next = 39,
						esc = 27;

					switch (e.keyCode) {
						case previous:
							// left arrow
							$(".magazine").turn("previous");
							e.preventDefault();

							break;
						case next:
							//right arrow
							$(".magazine").turn("next");
							e.preventDefault();

							break;
						case esc:
							$(".magazine-viewport").zoom("zoomOut");
							e.preventDefault();

							break;
					}
				});

				// URIs - Format #/page/1

				Hash.on("^page/([0-9]*)$", {
					yep: function(path, parts) {
						var page = parts[1];

						if (page !== undefined) {
							if ($(".magazine").turn("is"))
								$(".magazine").turn("page", page);
						}
					},
					nop: function(path) {
						if ($(".magazine").turn("is"))
							$(".magazine").turn("page", 1);
					}
				});

				$(window)
					.resize(function() {
						flipresizeViewport();
					})
					.bind("orientationchange", function() {
						flipresizeViewport();
					});

				// Events for thumbnails

				$(".thumbnails").click(function(event) {
					var page;

					if (
						event.target &&
						(page = /page-([0-9]+)/.exec(
							$(event.target).attr("class")
						))
					) {
						$(".magazine").turn("page", page[1]);
					}
				});

				$(".thumbnails li")
					.bind($.mouseEvents.over, function() {
						$(this).addClass("thumb-hover");
					})
					.bind($.mouseEvents.out, function() {
						$(this).removeClass("thumb-hover");
					});

				if ($.isTouch) {
					$(".thumbnails")
						.addClass("thumbanils-touch")
						.bind($.mouseEvents.move, function(event) {
							event.preventDefault();
						});
				} else {
					$(".thumbnails ul")
						.mouseover(function() {
							$(".thumbnails").addClass("thumbnails-hover");
						})
						.mousedown(function() {
							return false;
						})
						.mouseout(function() {
							$(".thumbnails").removeClass("thumbnails-hover");
						});
				}

				// Regions

				if ($.isTouch) {
					$(".magazine").bind("touchstart", flipregionClick);
				} else {
					$(".magazine").click(flipregionClick);
				}

				// Events for the next button

				$(".next-button")
					.bind($.mouseEvents.over, function() {
						$(this).addClass("next-button-hover");
					})
					.bind($.mouseEvents.out, function() {
						$(this).removeClass("next-button-hover");
					})
					.bind($.mouseEvents.down, function() {
						$(this).addClass("next-button-down");
					})
					.bind($.mouseEvents.up, function() {
						$(this).removeClass("next-button-down");
					})
					.click(function() {
						$(".magazine").turn("next");
					});

				// Events for the next button

				$(".previous-button")
					.bind($.mouseEvents.over, function() {
						$(this).addClass("previous-button-hover");
					})
					.bind($.mouseEvents.out, function() {
						$(this).removeClass("previous-button-hover");
					})
					.bind($.mouseEvents.down, function() {
						$(this).addClass("previous-button-down");
					})
					.bind($.mouseEvents.up, function() {
						$(this).removeClass("previous-button-down");
					})
					.click(function() {
						$(".magazine").turn("previous");
					});

				flipresizeViewport();

				$(".magazine").addClass("animated");

				$(".zoom-icon")
					.bind("mouseover", function() {
						if ($(this).hasClass("zoom-icon-in"))
							$(this).addClass("zoom-icon-in-hover");

						if ($(this).hasClass("zoom-icon-out"))
							$(this).addClass("zoom-icon-out-hover");
					})
					.bind("mouseout", function() {
						if ($(this).hasClass("zoom-icon-in"))
							$(this).removeClass("zoom-icon-in-hover");

						if ($(this).hasClass("zoom-icon-out"))
							$(this).removeClass("zoom-icon-out-hover");
					})
					.bind("click", function() {
						if ($(this).hasClass("zoom-icon-in"))
							$(".magazine-viewport").zoom("zoomIn");
						else if ($(this).hasClass("zoom-icon-out"))
							$(".magazine-viewport").zoom("zoomOut");
					});
			}

			function buildDOM() {
				//console.log('flipbook buildDOM');

				if (window.flipbookFirstLoaded) {
					return;
				}

				$("body").append(
					'<div id="flipBookPopup" style="display: none;position: fixed;top: 5%;left: 10%;width: 70%;height:90%;background:#fff;padding: 35px 12px 12px 12px;-webkit-box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.5);-moz-box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.5);box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.5);border-radius:5px;"> <div class="flipbookDownloadLink"></div>' +
						'<a onclick=\'$("#flipBookPopup").jqmHide();\' class="close popupclose" style="color:#000; position: absolute;right: 75px;top: 20px;border-radius: 5px;background: #DEDEDE;padding: 5px 15px;">Close</a> ' +
						' <div id="canvas">                                                   ' +
						"                                                                     " +
						'    <div class="zoom-icon zoom-icon-in"></div>                       ' +
						"                                                                     " +
						'    <div class="magazine-viewport">                                  ' +
						'        <div class="container">                                                 ' +
						'            <div class="magazine" data-imgsrc="' +
						flipImgSrc +
						'">    ' +
						"                <!-- Next button -->                                            " +
						'                <div ignore="1" class="next-button"></div>          ' +
						"                <!-- Previous button -->                            " +
						'                <div ignore="1" class="previous-button"></div>      ' +
						"            </div>                                                  " +
						"        </div>                                                      " +
						"    </div>                                                          " +
						"                                                                    " +
						"    <!-- Thumbnails -->                                             " +
						'    <div class="thumbnails">                                        ' +
						"        <div>                                                       " +
						"            <ul>                                                    " +
						'                <li class="i">                                      ' +
						"                                                                    " +
						"                </li>                                               " +
						"                                                                    " +
						"             </ul>                                                  " +
						"                    <div>                                           " +
						"                    </div>                                          " +
						"        </div>                                                      " +
						"  </div>                                                            " +
						" </div>                                                             " +
						"</div>                                                              "
				);

				imagePathHandler();
				downloadHandler();

				window.flipbookFirstLoaded = true;
			}

			//-
			return self.initialize();
		};
	} catch (e) {
		base.fn.err(e);
	}
})(jQuery);
