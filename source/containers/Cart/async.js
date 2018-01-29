import { asyncComponent } from "react-async-component";

const Cart = asyncComponent({ resolve: () => import("./Cart") });

export default Cart;
