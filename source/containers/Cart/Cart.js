import React from "react";
import { connect } from "react-redux";

const activeCartStyle = {
	color: "#E57D24"
};

let Cart = (props) => {
	let cart = props.cart || [];

	return (
		<div>
			<i
				className="glyphicon glyphicon-shopping-cart"
				style={cart.length ? activeCartStyle : null}
			/>
			(<span className="shopping-cart-count">{cart.length || 0}</span>)
		</div>
	);
};

// This allows us to access the `state` object
// as a property inside of the `Cart` container.
Cart = connect((state, ownProps) => {
	return { cart: state.cartReducer.cart, ...ownProps };
})(Cart);

// @component
export default Cart;
