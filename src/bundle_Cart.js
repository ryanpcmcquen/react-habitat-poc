import "babel-polyfill";
import ReactHabitat from "react-habitat";
import sltStore from "./store/sltStore";
import reducer from "./reducers/sltReducers";
import ReduxDomFactory from "./ReduxDomFactory";

class Cart extends ReactHabitat.Bootstrapper {
	constructor() {
		super();

		// Create a new container:
		const containerBuilder = new ReactHabitat.ContainerBuilder();

		// Set the container to use our redux factory:
		containerBuilder.factory = new ReduxDomFactory(sltStore);

		// Register our components that we want to expose to the DOM:
		containerBuilder
			.registerAsync(System.import("./containers/Cart/Cart"))
			.as("Cart");

		// Set the DOM container:
		this.setContainer(containerBuilder.build());
	}
}

// Export single instance:
export default new Cart();
