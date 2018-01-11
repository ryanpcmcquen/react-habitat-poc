webpackJsonp([0],{

/***/ 510:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = __webpack_require__(206);

var _extends3 = _interopRequireDefault(_extends2);

var _react = __webpack_require__(52);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(207);

var ReactRedux = _interopRequireWildcard(_reactRedux);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activeCartStyle = {
	color: "#E57D24"
};

// Because this component only has a `render` it
// can be a function, rather than a class.
var Cart = function Cart(props) {
	var cart = props.cart || [];

	return _react2.default.createElement(
		"div",
		null,
		_react2.default.createElement("i", {
			className: "glyphicon glyphicon-shopping-cart",
			style: cart.length ? activeCartStyle : null
		}),
		_react2.default.createElement(
			"span",
			{ className: "shopping-cart-count" },
			"(",
			cart.length || 0,
			")"
		)
	);
};

// This allows us to access the `state` object
// as a property inside of the `Cart` container.
Cart = ReactRedux.connect(function (state, ownProps) {
	return (0, _extends3.default)({ cart: state.cartReducer.cart }, ownProps);
})(Cart);

// @component
exports.default = Cart;
module.exports = exports["default"];

/***/ })

});