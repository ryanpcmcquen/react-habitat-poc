import { asyncComponent } from "react-async-component";

const Card = asyncComponent({ resolve: () => System.import("./Card") });

export default Card;
