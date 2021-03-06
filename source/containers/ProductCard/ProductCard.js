import React from "react";

import Button from "../../components/Button/async";
import Card from "../../components/Card/async";

import { connect } from "react-redux";
import { addedToCart } from "../../actions/cartActions.js";
import PropTypes from "prop-types";

let ProductCard = (props) => {
	let { addToCart, cart, dispatch, price, sku } = props;
	// Determine 'on-the-fly' if the sku is inside
	// of our cart object. This keeps us from having
	// a needless boolean and wasting memory.
	// It also ensures our determination does not suffer
	// from caching or any other latency.
	let isInCart = cart.find((item) => item.hasOwnProperty(sku));
	let badge = isInCart ? "ADDED TO CART" : null;

	// HACK: Remove `addToCart` to avoid confusing Habitat:
	const cardProps = Object.assign({}, props);
	delete cardProps.addToCart;
	// TODO:
	// Determine which props are actually needed by Card
	// and pass those explicitly.

	return (
		<div>
			<Card style={{ width: "250px" }} badge={badge} {...cardProps} />
			{price ? <div>{price}</div> : <div />}
			{addToCart && (
				<Button
					color="primary"
					classes="btn-primary addToCart"
					onClick={() => dispatch(addedToCart(props))}
				>
					ADD TO CART
				</Button>
			)}
		</div>
	);
};
ProductCard.propTypes = {
	/** Adds the _ADD TO CART_ button and functionality. */
	addToCart: PropTypes.bool
};
ProductCard.defaultProps = {
	addToCart: false
};

// This allows us to access the `state` object
// as a property inside of the `ProductCard` container.
ProductCard = connect((state, ownProps) => {
	return {
		cart: state.cartReducer.cart,
		...ownProps
	};
})(ProductCard);

// @component
export default ProductCard;
