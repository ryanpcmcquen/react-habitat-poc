import { asyncComponent } from "react-async-component";

const ProductCard = asyncComponent({
	resolve: () => import("./ProductCard")
});
export default ProductCard;
