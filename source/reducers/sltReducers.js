import * as Redux from "redux";
import cartReducer from "./cartReducer";

// This combines all reducers, so they can be modular:
const sltReducers = Redux.combineReducers({
	cartReducer
});

export default sltReducers;
