(function($) {
	try {
		//Define the plugin's name here
		var __name = "videos";
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
			self.defaults = {
				$popover: null,
				youtubekey: "AIzaSyCTqR-gheMVzAAiNcK8uYVdFqJc7rqEXfs"
			};

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
				},
				videoPlaybackInterval = 0,
				currentVideo = "",
				_gatrackr = PDPTracking.ga,
				$win = $(window),
				$popover,
				$thumbs,
				popoverHiddenClass = "product-videoPopover-hidden";

			var onPlayerStateChange = function(evt) {
				if (self._YTPlayer.getPlayerState() != 1) return;

				//- Google Analytics Tracking
				var e = PDPTracking.ga.video,
					videoData = self._YTPlayer.getVideoData(),
					description = videoData.title + " - " + videoData.video_id;

				pdpTracker(e.play[0], e.play[1], description);

				var duration = self._YTPlayer.getDuration(),
					untracked = true;
				videoPlaybackInterval = setInterval(function() {
					var played = self._YTPlayer.getCurrentTime(),
						t = 0;
					if (played != 0) t = parseInt(played / duration * 100);

					if (t >= 90 && untracked) {
						untracked = false;
						pdpTracker(e.watched[0], e.watched[1], description);
					}
				}, 100);
			};
			var stop = function() {
				clearInterval(videoPlaybackInterval);
				self._YTPlayer.stopVideo();
				self._YTPlayer.clearVideo();
			};
			var play = function(videoId) {
				self._YTPlayer.loadVideoById(videoId);
			};

			//-- Start
			//-- ------------------------------------------------------
			function ignite() {
				$popover = self.options.$popover;
				$thumbs = f("div[data-video]");

				// Load Youtube iframe API - https://developers.google.com/youtube/player_parameters#IFrame_Player_API
				var tag = document.createElement("script");
				tag.src = "https://www.youtube.com/iframe_api";
				var firstScriptTag = document.getElementsByTagName("script")[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

				window.onYouTubeIframeAPIReady = function() {
					console.log("onYouTubeIframeAPIReady");
					self._YTPlayer = new YT.Player(
						"product-videoPopoverPlayer",
						{
							height: "390",
							width: "640",
							enablejsapi: 1,
							origin: document.domain,
							rel: 0,
							events: {
								onReady: function(evt) {
									console.log("onReady");
									setTimeout(loadThumbs, 100);
								},
								onStateChange: onPlayerStateChange,
								onError: function(err) {
									console.log("onError: " + err);
								}
							}
						}
					);
				};

				return self;
			}

			function loadThumbs() {
				console.log("loadThumbs");

				// Set up video images
				var videosPresent = false;

				$thumbs.each(function() {
					var datavideo = $(this).attr("data-video");
					console.log("loadThumbs foreach - " + datavideo);

					if (datavideo != "") {
						videosPresent = true;
						// Create image thumbnail for each video div
						var figure = $("<figure></figure>").appendTo($(this));
						var img = $("<img />", {
							id: "product-videosImage-" + datavideo,
							src:
								"http://img.youtube.com/vi/" +
								datavideo +
								"/mqdefault.jpg",
							alt:
								"Image thumbnail for Youtube video " + datavideo
						}).appendTo($(this).children("figure"));
						$(this).attr("id", datavideo);

						// Get title from Youtube API, add to figure
						var title = "",
							url =
								"https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" +
								datavideo +
								"&key=" +
								self.options.youtubekey;

						try {
							$.getJSON(url, function(data) {
								$(
									"<figcaption>" +
										data.items[0].snippet.title +
										"</figcaption>"
								).appendTo(
									f("div#" + data.items[0].id).children(
										"figure"
									)
								);
								// Copy video images to video popup
								f("div#" + data.items[0].id)
									.clone(true)
									.appendTo("div#product-videoPopoverMenu");
							}).fail(function(err) {
								console.log(
									"Error loading " + url + "\n\n" + err
								);
							});
						} catch (e) {
							console.log("loadThumbs getJSON js error : " + e);
						}
					}
				});

				bindEvents();
			}

			function bindEvents() {
				console.log("bindEvents");

				// Watch for video image click
				$thumbs.click(function(evt) {
					evt.stopPropagation();

					currentVideo = $(this).attr("data-video");
					$popover
						.find("div#product-videoPopoverContainer>span")
						.text(
							$(this)
								.find("figcaption")
								.text()
						);

					setTimeout(function() {
						$popover
							.removeClass(popoverHiddenClass)
							.css(
								"left",
								$win.width() / 2 - $popover.outerWidth() / 2
							)
							.show();
						var videoTop =
							($win.height() - $popover.outerHeight()) / 2;
						if (videoTop < 10) videoTop = 10;
						$popover.css("top", videoTop);

						stop();
						play(currentVideo);
					}, 100);
				});

				// Video overlay close
				$popover.find("span.product-close").click(function() {
					//- Google Analytics Tracking
					var e = _gatrackr.video.closed;
					pdpTracker(e[0], e[1], e[2] + currentVideo);

					stop();
					hidePopover();
				});

				/*  
            **    Closing Popovers
            */
				$(document).keyup(function(e) {
					if (e.keyCode == 27) {
						//esc
						self._YTPlayer.stopVideo();
						hidePopover();
					}
				});
				$("body").click(function(e) {
					var target = e.target;
					if (
						$popover.is(":visible") &&
						$(target).parents(".product-popover").length == 0 &&
						!$(target).hasClass("product-popover")
					) {
						hidePopover();
						self._YTPlayer.stopVideo();
					}
				});
			}

			function hidePopover() {
				$popover.addClass(popoverHiddenClass).attr("style", "");
			}

			//-
			return self.initialize();
		};
	} catch (e) {}
})(jQuery);
