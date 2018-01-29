import { asyncComponent } from "react-async-component";

const Button = asyncComponent({ resolve: () => import("./Button") });

export default Button;
