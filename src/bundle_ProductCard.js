import "babel-polyfill";
import ReactHabitat from "react-habitat";
import sltStore from "./store/sltStore";
import reducer from "./reducers/sltReducers";
import ReduxDomFactory from "./ReduxDomFactory";

class ProductCard extends ReactHabitat.Bootstrapper {
	constructor() {
		super();

		// Create a new container:
		const containerBuilder = new ReactHabitat.ContainerBuilder();

		// Set the container to use our redux factory:
		containerBuilder.factory = new ReduxDomFactory(sltStore);

		// Register our component that we want to expose to the DOM:
		containerBuilder
			.registerAsync(
				System.import("./containers/ProductCard/ProductCard")
			)
			.as("ProductCard");

		// Set the DOM container:
		this.setContainer(containerBuilder.build());
	}
}

// Export single instance:
export default new ProductCard();
