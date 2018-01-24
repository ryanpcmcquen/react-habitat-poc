import { createStore } from "redux";
import sltReducers from "../reducers/sltReducers";

const sltStore = createStore(
	sltReducers,
	// Enable DevTools:
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default sltStore;
