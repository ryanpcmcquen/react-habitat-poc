import { asyncComponent } from "react-async-component";

const Button = asyncComponent({ resolve: () => System.import("./Button") });

export default Button;
