//simple webpack config for now, but can get more complicated later
const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const babelConfig = require("./babel.config");
const vendorPaths = require("./paths.config").vendorPaths;

module.exports = {
	watch: process.env.NODE_ENV === "development",
	watchOptions: {
		ignored: ["!./(src|site-sections)/**/*(.js|.jsx)"]
	},
	output: {
		filename: "[name].js",
		chunkFilename: "[chunkhash].js",
		jsonpFunction: "webpackJsonp"
	},
	module: {
		rules: [
			{
				test: /(\.js|\.jsx)$/,
				use: { loader: "babel-loader", options: babelConfig },
				exclude: /(node_modules|bower_components)/
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
		//This allows us to seperate the libraries in the vendor-manifest from this build, but still being able to reference them
		new webpack.NamedModulesPlugin(),
		new webpack.NamedChunksPlugin(),
		new webpack.DllReferencePlugin({
			context: ".",
			manifest: path.join(vendorPaths.manifest, "vendor.manifest.json"),
			sourceType: "window"
		}),
		new ExtractTextPlugin("[name].css")
	]
};
