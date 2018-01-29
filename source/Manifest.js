// import "babel-polyfill";
import ReactHabitat from "react-habitat";
import sltStore from "./store/sltStore";
import reducer from "./reducers/sltReducers";
import { ReduxDomFactory } from "react-habitat-redux";

class Manifest extends ReactHabitat.Bootstrapper {
	constructor() {
		super();

		// Create a new container:
		const containerBuilder = new ReactHabitat.ContainerBuilder();

		// Set the container to use the React Habitat Redux factory:
		containerBuilder.factory = new ReduxDomFactory(sltStore);

		// Register our components that we want to expose to the DOM:
		containerBuilder
			.registerAsync(() => import("./components/Button/Button"))
			.as("Button");

		containerBuilder
			.registerAsync(() => import("./components/Card/Card"))
			.as("Card");

		// Register our containers that we want to expose to the DOM:
		containerBuilder
			.registerAsync(() => import("./containers/Cart/Cart"))
			.as("Cart");

		containerBuilder
			.registerAsync(() => import("./containers/ProductCard/ProductCard"))
			.as("ProductCard");

		// Set the DOM container:
		this.setContainer(containerBuilder.build());

		// Allow legacy components to be built as 'one-offs':
		window.updateHabitat = this.update.bind(this);
		// ^ To use this, do:
		//     window.updateHabitat();
	}
}

// Export single instance:
export default new Manifest();
