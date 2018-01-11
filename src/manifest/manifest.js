import ReactHabitat from "react-habitat";
import ReactHabitatRedux from "react-habitat-redux";
// import { ReduxDOMFactory } from "react-habitat-redux";
import sltStore from "../store/sltStore";
// import { createStore } from "redux";
//
// import configureStore from "./store/configureStore";
import Cart from "../containters/Cart/Cart";
import ProductCard from "../containers/ProductCard/ProductCard";

class MyApp extends ReactHabitat.Bootstrapper {
	constructor() {
		super();

		// Create a store:
		// const store = configureStore();

		const containerBuilder = new ReactHabitat.ContainerBuilder();

		// Set a new 'Redux' factory for the store:
		containerBuilder.factory = new ReactHabitatRedux.ReduxDomFactory(
			sltStore
		);

		// Register your top level components:
		containerBuilder.register(Cart).as("Cart");
		containerBuilder.register(ProductCard).as("ProductCard");

		// Finally, set the container.
		this.setContainer(containerBuilder.build());
	}
}

// Always export a 'new' instance so it immediately evokes.
export default new MyApp();
