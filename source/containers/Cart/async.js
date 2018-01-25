import { asyncComponent } from "react-async-component";

const Cart = asyncComponent({ resolve: () => System.import("./Cart") });

export default Cart;
