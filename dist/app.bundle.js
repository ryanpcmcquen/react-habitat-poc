webpackJsonp([0], {
	0: function(e, t, n) {
		e.exports = n(1);
	},
	1: function(e, t, n) {
		"use strict";
		function r(e) {
			return e && e.__esModule ? e : { default: e };
		}
		function o(e, t) {
			if (!(e instanceof t))
				throw new TypeError("Cannot call a class as a function");
		}
		function a(e, t) {
			if (!e)
				throw new ReferenceError(
					"this hasn't been initialised - super() hasn't been called"
				);
			return !t || ("object" != typeof t && "function" != typeof t)
				? e
				: t;
		}
		function u(e, t) {
			if ("function" != typeof t && null !== t)
				throw new TypeError(
					"Super expression must either be null or a function, not " +
						typeof t
				);
			(e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			})),
				t &&
					(Object.setPrototypeOf
						? Object.setPrototypeOf(e, t)
						: (e.__proto__ = t));
		}
		Object.defineProperty(t, "__esModule", { value: !0 }),
			(t.main = void 0);
		var l = n(2),
			i = r(l),
			c = n(175),
			s = r(c),
			f = n(208),
			p = r(f),
			d = (function(e) {
				function t() {
					o(this, t);
					var e = a(
							this,
							(t.__proto__ || Object.getPrototypeOf(t)).call(this)
						),
						n = new i["default"].Container();
					return (
						n.register("RBanner", s["default"]),
						n.register("RFeaturette", p["default"]),
						e.setContainer(n),
						e
					);
				}
				return u(t, e), t;
			})(i["default"].Bootstrapper);
		t.main = new d();
	},
	175: function(e, t, n) {
		"use strict";
		function r(e) {
			return e && e.__esModule ? e : { default: e };
		}
		function o(e, t) {
			if (!(e instanceof t))
				throw new TypeError("Cannot call a class as a function");
		}
		function a(e, t) {
			if (!e)
				throw new ReferenceError(
					"this hasn't been initialised - super() hasn't been called"
				);
			return !t || ("object" != typeof t && "function" != typeof t)
				? e
				: t;
		}
		function u(e, t) {
			if ("function" != typeof t && null !== t)
				throw new TypeError(
					"Super expression must either be null or a function, not " +
						typeof t
				);
			(e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			})),
				t &&
					(Object.setPrototypeOf
						? Object.setPrototypeOf(e, t)
						: (e.__proto__ = t));
		}
		Object.defineProperty(t, "__esModule", { value: !0 });
		var l = (function() {
				function e(e, t) {
					for (var n = 0; n < t.length; n++) {
						var r = t[n];
						(r.enumerable = r.enumerable || !1),
							(r.configurable = !0),
							"value" in r && (r.writable = !0),
							Object.defineProperty(e, r.key, r);
					}
				}
				return function(t, n, r) {
					return n && e(t.prototype, n), r && e(t, r), t;
				};
			})(),
			i = n(176),
			c = r(i),
			s = (function(e) {
				function t(e) {
					return (
						o(this, t),
						a(
							this,
							(t.__proto__ || Object.getPrototypeOf(t)).call(
								this,
								e
							)
						)
					);
				}
				return (
					u(t, e),
					l(t, [
						{
							key: "render",
							value: function() {
								return c["default"].createElement(
									"div",
									{ className: "jumbotron" },
									c["default"].createElement(
										"div",
										{ className: "container" },
										c["default"].createElement(
											"h1",
											null,
											this.props.title
										),
										c["default"].createElement(
											"p",
											null,
											"This page demonstrates how to embed multiple react components into a page using React Habitat."
										),
										c["default"].createElement(
											"p",
											null,
											"This banner and the following featurettes are all React Components. Check out index.html in a text editor to see how they are implemented."
										),
										c["default"].createElement(
											"p",
											null,
											c["default"].createElement(
												"a",
												{
													className:
														"btn btn-primary btn-lg",
													href:
														"https://github.com/DeloitteDigitalAPAC/react-habitat",
													target: "_blank"
												},
												"Check out the docs »"
											)
										)
									)
								);
							}
						}
					]),
					t
				);
			})(c["default"].Component);
		(s.defaultProps = { title: "Welcome" }), (t["default"] = s);
	},
	208: function(e, t, n) {
		"use strict";
		function r(e) {
			return e && e.__esModule ? e : { default: e };
		}
		function o(e, t) {
			if (!(e instanceof t))
				throw new TypeError("Cannot call a class as a function");
		}
		function a(e, t) {
			if (!e)
				throw new ReferenceError(
					"this hasn't been initialised - super() hasn't been called"
				);
			return !t || ("object" != typeof t && "function" != typeof t)
				? e
				: t;
		}
		function u(e, t) {
			if ("function" != typeof t && null !== t)
				throw new TypeError(
					"Super expression must either be null or a function, not " +
						typeof t
				);
			(e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			})),
				t &&
					(Object.setPrototypeOf
						? Object.setPrototypeOf(e, t)
						: (e.__proto__ = t));
		}
		Object.defineProperty(t, "__esModule", { value: !0 });
		var l = (function() {
				function e(e, t) {
					for (var n = 0; n < t.length; n++) {
						var r = t[n];
						(r.enumerable = r.enumerable || !1),
							(r.configurable = !0),
							"value" in r && (r.writable = !0),
							Object.defineProperty(e, r.key, r);
					}
				}
				return function(t, n, r) {
					return n && e(t.prototype, n), r && e(t, r), t;
				};
			})(),
			i = n(176),
			c = r(i),
			s = (function(e) {
				function t() {
					return (
						o(this, t),
						a(
							this,
							(t.__proto__ || Object.getPrototypeOf(t)).apply(
								this,
								arguments
							)
						)
					);
				}
				return (
					u(t, e),
					l(t, [
						{
							key: "imageView",
							value: function() {
								return c["default"].createElement(
									"div",
									{ className: "col-md-5" },
									c["default"].createElement("img", {
										src: this.props.imgSrc
									})
								);
							}
						},
						{
							key: "textView",
							value: function() {
								return c["default"].createElement(
									"div",
									{ className: "col-md-7" },
									c["default"].createElement(
										"h2",
										{ className: "featurette-heading" },
										this.props.title,
										c["default"].createElement(
											"span",
											{ className: "text-muted" },
											this.props.subTitle
										)
									),
									c["default"].createElement(
										"p",
										{ className: "lead" },
										"Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo."
									)
								);
							}
						},
						{
							key: "render",
							value: function() {
								return c["default"].createElement(
									"div",
									{ className: "row" },
									"rtl" === this.props.layout
										? this.imageView()
										: this.textView(),
									"rtl" === this.props.layout
										? this.textView()
										: this.imageView()
								);
							}
						}
					]),
					t
				);
			})(c["default"].Component);
		(s.defaultProps = {
			title: "Donec ullamcorper nulla non",
			imgSrc: "http://placehold.it/400x400",
			layout: "ltr"
		}),
			(t["default"] = s);
	}
});
