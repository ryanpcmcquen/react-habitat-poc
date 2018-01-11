// Because of the way the Redux library
// is set up, it requires a special type of
// import to import the global object.
// Using the global name allows us to
// write code that is more portable to
// a client-side only environment.
import * as Redux from "redux";
import sltReducers from "../reducers/sltReducers";

const sltStore = Redux.createStore(
	sltReducers,
	// Enable DevTools:
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default sltStore;
