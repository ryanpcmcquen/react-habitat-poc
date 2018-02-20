const addedToCart = (props) => ({
	quantity: 1,
	sku: props.sku,
	type: "ADD_TO_CART"
});

export { addedToCart };
