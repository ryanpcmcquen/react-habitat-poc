import { createStore } from "redux";
import sltReducers from "../reducers/sltReducers";
import { loadState, saveState } from "./localStorage";
const sltStore = () => {
	const persistedState = loadState();

	const store = createStore(
		sltReducers,
		persistedState
		// Enable DevTools:
		// window.__REDUX_DEVTOOLS_EXTENSION__ &&
		// window.__REDUX_DEVTOOLS_EXTENSION__()
	);

	store.subscribe(() => {
		saveState({
			cart: store.getState().cart
		});
	});
	return store;
};
export default sltStore;
