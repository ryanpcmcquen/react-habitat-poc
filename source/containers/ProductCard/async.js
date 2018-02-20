import { asyncComponent } from "react-async-component";

const ProductCard = asyncComponent({
	resolve: () => import("./ProductCard" /*webpackChunkName:"ProductCard"*/)
});
export default ProductCard;
