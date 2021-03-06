import React from "react";
import "./Button.css";
import PropTypes from "prop-types";

const Button = (props) => {
	let { children, classes = "", color, size = "", text = "" } = props;
	var sizes = {
		large: "lg",
		medium: "md",
		small: "sm",
		xsmall: "xs"
	};
	return (
		<span>
			<a
				className={`btn btn-${color} btn-${sizes[size]} ${classes}`}
				{...props}
			>
				{children || text}
			</a>
		</span>
	);
};
Button.propTypes = {
	/** Apply any css classes using this. */
	classes: PropTypes.string,
	/** Accepts Bootstrap colors. */
	color: PropTypes.string,
	/** A url that the button will link to. */
	href: PropTypes.string,
	/** Follows Bootstrap sizing. */
	size: PropTypes.oneOf(["xsmall", "small", "medium", "large"])
};
Button.defaultProps = {
	color: "primary"
};

// @component
export default Button;
