import React from "react";
import { Provider } from "react-redux";
import sltStore from "../store/sltStore";

export default class Wrapper extends React.Component {
	render() {
		return <Provider store={sltStore}>{this.props.children}</Provider>;
	}
}
