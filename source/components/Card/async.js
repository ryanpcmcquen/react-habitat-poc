import { asyncComponent } from "react-async-component";

const Card = asyncComponent({
	resolve: () => import("./Card" /*webpackChunkName:"Card"*/)
});

export default Card;
