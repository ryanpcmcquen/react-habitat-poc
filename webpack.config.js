const webpack = require("webpack");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry: "./src/App.js",
	output: {
		filename: "dist/app.bundle.js"
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
