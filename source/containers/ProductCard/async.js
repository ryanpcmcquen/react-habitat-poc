import { asyncComponent } from "react-async-component";

const ProductCard = asyncComponent({
	resolve: () => System.import("./ProductCard")
});
export default ProductCard;
