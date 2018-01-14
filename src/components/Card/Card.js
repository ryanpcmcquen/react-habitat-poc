import React from "react";
import "./Badge.css";
import PropTypes from "prop-types";

const Card = props => {
	let { alt, badge, href, sku, src, wrapperClasses } = props;
	if (!src && sku) {
		src = `https://www.surlatable.com/images/customers/c1079/PRO-${sku}/PRO-${sku}_pdp/main_variation_Default_view_1_425x425.`;
	}
	if (!href && sku) {
		href = `https://www.surlatable.com/product/PRO-${sku}/`;
	}

	return (
		<div className={wrapperClasses} style={{ position: "relative" }}>
			{href ? (
				<div>
					{badge && <span className="slt-badge">{badge}</span>}
					<a href={href}>
						<img alt={alt} src={src} />
					</a>
				</div>
			) : (
				<div>
					{badge && <span className="slt-badge">{badge}</span>}
					<img alt={alt} src={src} />
				</div>
			)}
		</div>
	);
};

Card.propTypes = {
	/** A colored badge that overlays on the image. */
	badge: PropTypes.string,
	/** A url that the image will link to. */
	href: PropTypes.string,
	/** The path to the image (url). */
	src: PropTypes.string,
	/** The SKU of the product. This populates the default image. Specifying an image will overwrite the default. */
	sku: PropTypes.string,
	/** Classes to apply to the wrapping `<div>`. */
	wrapperClasses: PropTypes.string
};
Card.defaultProps = {};

// @component
export default Card;
