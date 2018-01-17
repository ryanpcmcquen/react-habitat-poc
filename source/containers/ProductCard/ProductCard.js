import React from "react";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { connect } from "react-redux";
import { addedToCart } from "../../actions/cartActions.js";
import PropTypes from "prop-types";
import { asyncComponent } from "react-async-component";

let ProductCard = (props) => {
	let { add_to_cart, cart, price, sku } = props;
	// Determine 'on-the-fly' if the sku is inside
	// of our cart object. This keeps us from having
	// a needless boolean and wasting memory.
	// It also ensures our determination does not suffer
	// from caching or any other latency.
	let isInCart = cart.find((item) => item.hasOwnProperty(sku));
	let badge = isInCart ? "ADDED TO CART" : null;

	// HACK: Remove `add_to_cart` to avoid confusing Habitat:
	const cardProps = Object.assign({}, props);
	delete cardProps.add_to_cart;

	return (
		<div>
			<Card style={{ width: "250px" }} badge={badge} {...cardProps} />
			{price ? <div>{price}</div> : <div />}
			{add_to_cart && (
				<Button
					color="primary"
					classes="btn-primary add-to-cart"
					onClick={() => addedToCart(props)}
				>
					ADD TO CART
				</Button>
			)}
		</div>
	);
};
ProductCard.propTypes = {
	/** Adds the _ADD TO CART_ button and functionality. */
	add_to_cart: PropTypes.bool
};
ProductCard.defaultProps = {
	add_to_cart: false
};

// This allows us to access the `state` object
// as a property inside of the `ProductCard` container.
ProductCard = connect((state, ownProps) => ({
	cart: state.cartReducer.cart,
	...ownProps
}))(ProductCard);

// @component
export default asyncComponent({ resolve: () => ProductCard });
