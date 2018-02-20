import { asyncComponent } from "react-async-component";

const Cart = asyncComponent({
	resolve: () => import("./Cart" /*webpackChunkName:"Cart"*/)
});

export default Cart;
