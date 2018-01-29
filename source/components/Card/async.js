import { asyncComponent } from "react-async-component";

const Card = asyncComponent({ resolve: () => import("./Card") });

export default Card;
