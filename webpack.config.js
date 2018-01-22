const path = require("path");
const webpack = require("webpack");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
	entry: {
		manifest: "./source/Manifest.js"
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist/"),
		publicPath: "dist/"
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
		new ExtractTextPlugin("styles.css"),
		// Auto open the demo:
		new OpenBrowserPlugin({ url: "http://localhost:8080" }),
		// Uncomment to minify:
		new UglifyJsPlugin()
	]
};
