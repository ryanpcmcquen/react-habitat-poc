import { asyncComponent } from "react-async-component";

const Button = asyncComponent({
	resolve: () => import("./Button" /*webpackChunkName:"Button"*/)
});

export default Button;
