import { combineReducers } from "redux";
import cartReducer from "./cartReducer";

// This combines all reducers, so they can be modular:
const sltReducers = combineReducers({
	cartReducer
});

export default sltReducers;
