webpackJsonp([1],{

/***/ 509:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(52);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./Badge.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var _propTypes = __webpack_require__(136);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Card = function Card(props) {
	var badge = props.badge,
	    href = props.href,
	    sku = props.sku,
	    src = props.src,
	    wrapperClasses = props.wrapperClasses;

	if (!src && sku) {
		src = "https://www.surlatable.com/images/customers/c1079/PRO-" + sku + "/PRO-" + sku + "_pdp/main_variation_Default_view_1_425x425.";
	}
	if (!href && sku) {
		href = "https://www.surlatable.com/product/PRO-" + sku + "/";
	}

	return _react2.default.createElement(
		"div",
		{ className: wrapperClasses, style: { position: "relative" } },
		href ? _react2.default.createElement(
			"div",
			null,
			badge && _react2.default.createElement(
				"span",
				{ className: "slt-badge" },
				badge
			),
			_react2.default.createElement(
				"a",
				{ href: href },
				_react2.default.createElement("img", props)
			)
		) : _react2.default.createElement(
			"div",
			null,
			badge && _react2.default.createElement(
				"span",
				{ className: "slt-badge" },
				badge
			),
			_react2.default.createElement("img", props)
		)
	);
};

Card.propTypes = {
	/** A colored badge that overlays on the image. */
	badge: _propTypes2.default.string,
	/** A url that the image will link to. */
	href: _propTypes2.default.string,
	/** The path to the image (url). */
	src: _propTypes2.default.string,
	/** The SKU of the product. This populates the default image. Specifying an image will overwrite the default. */
	sku: _propTypes2.default.string,
	/** Classes to apply to the wrapping `<div>`. */
	wrapperClasses: _propTypes2.default.string
};
Card.defaultProps = {};

// @component
exports.default = Card;
module.exports = exports["default"];

/***/ })

});