// There is a bit of dark magic here.
// - When calling `store.dispatch`, the object
//   that is passed applies to `action` in this function,
//   not `state`.
// - The default parameter here creates an object with a
//   `cart` array as a property, if it does not exist.
// - The spread operators inside of the `return` make
//   sure that all former keys & values are passed to the new
//   object that is returned.
const cartReducer = (state = { cart: [] }, action) => {
	switch (action.type) {
		case "ADD_TO_CART":
			return {
				...state,
				cart: [...state.cart, { [action.sku]: action.quantity }]
			};
		default:
			return state;
	}
};
export default cartReducer;
