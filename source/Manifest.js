import "babel-polyfill";
import ReactHabitat from "react-habitat";
import sltStore from "./store/sltStore";
import reducer from "./reducers/sltReducers";
import ReduxDomFactory from "./ReduxDomFactory";

class Manifest extends ReactHabitat.Bootstrapper {
	constructor() {
		super();

		// Create a new container:
		const containerBuilder = new ReactHabitat.ContainerBuilder();

		// Set the container to use our redux factory:
		containerBuilder.factory = new ReduxDomFactory(sltStore);

		// Register our components that we want to expose to the DOM:
		containerBuilder
			// .registerAsync(System.import("./components/Button/Button"))
			// .as("Button");
			.registerAsync(
				new Promise((resolve) => {
					require.ensure(["./components/Button/Button"], () => {
						resolve(require("./components/Button/Button"));
					});
				})
			)
			.as("Button");
		containerBuilder
			// .registerAsync(System.import("./components/Card/Card"))
			// .as("Card");
			.registerAsync(
				new Promise((resolve) => {
					require.ensure(["./components/Card/Card"], () => {
						resolve(require("./components/Card/Card"));
					});
				})
			)
			.as("Card");

		// Register our containers that we want to expose to the DOM:
		containerBuilder
			// .registerAsync(System.import("./containers/Cart/Cart"))
			// .as("Cart");
			.registerAsync(
				new Promise((resolve) => {
					require.ensure(["./containers/Cart/Cart"], () => {
						resolve(require("./containers/Cart/Cart"));
					});
				})
			)
			.as("Cart");

		containerBuilder
			// .registerAsync(
			// System.import("./containers/ProductCard/ProductCard")
			// )
			// .as("ProductCard");
			.registerAsync(
				new Promise((resolve) => {
					require.ensure(
						["./containers/ProductCard/ProductCard"],
						() => {
							resolve(
								require("./containers/ProductCard/ProductCard")
							);
						}
					);
				})
			)
			.as("ProductCard");

		// Set the DOM container:
		this.setContainer(containerBuilder.build());
	}
}

// Export single instance:
export default new Manifest();
