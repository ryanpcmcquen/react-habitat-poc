// import "babel-polyfill";
import ReactHabitat from "react-habitat";
import sltStore from "./store/sltStore";
import reducer from "./reducers/sltReducers";
import ReduxDomFactory from "./ReduxDomFactory";

class Manifest extends ReactHabitat.Bootstrapper {
	constructor() {
		super();

		// Create a new container:
		const containerBuilder = new ReactHabitat.ContainerBuilder();

		// Set the container to use our Redux factory:
		containerBuilder.factory = new ReduxDomFactory(sltStore);

		// Register our components that we want to expose to the DOM:
		containerBuilder
			.registerAsync(() => System.import("./components/Button/async"))
			.as("Button");

		containerBuilder
			.registerAsync(() => System.import("./components/Card/async"))
			.as("Card");

		// Register our containers that we want to expose to the DOM:
		containerBuilder
			.registerAsync(() => System.import("./containers/Cart/async"))
			.as("Cart");

		containerBuilder
			.registerAsync(() =>
				System.import("./containers/ProductCard/async")
			)
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
