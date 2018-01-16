const webpack = require("webpack");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	// entry: {
	// 	Button: "./src/bundle_Button.js",
	// 	Card: "./src/bundle_Card.js",
	// 	Cart: "./src/bundle_Cart.js",
	// 	ProductCard: "./src/bundle_ProductCard.js"
	// },
	entry: "./src/Manifest.js",
	output: {
		// filename: "[name].bundle.js",
		filename: "dist/manifest.bundle.js"
		// path: `${__dirname}/dist`
	},
	resolve: {
		extensions: [".js", ".jsx"]
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["env", "react"],
						plugins: [
							"add-module-exports",
							"syntax-dynamic-import",
							"transform-class-properties",
							"transform-custom-element-classes",
							"transform-es2015-classes",
							"transform-object-rest-spread",
							"transform-runtime"
						]
					}
				}
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				}),
				exclude: /(node_modules|bower_components)/
			}
		]
	},
	plugins: [
		// Auto open the demo:
		new OpenBrowserPlugin({ url: "http://localhost:8080" }),
		new ExtractTextPlugin("styles.css")
	]
};
