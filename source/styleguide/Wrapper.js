import React from "react";
import * as ReactRedux from "react-redux";
import sltStore from "../store/sltStore";

export default class Wrapper extends React.Component {
	render() {
		return (
			<ReactRedux.Provider store={sltStore}>
				{this.props.children}
			</ReactRedux.Provider>
		);
	}
}
