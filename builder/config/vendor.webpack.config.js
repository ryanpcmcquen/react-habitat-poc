var webpack = require("webpack");
var path = require("path");

var paths = require("./paths.config").vendorPaths;

module.exports = {
	watch: false, //these should never need to be watched
	entry: {
		vendor: ["babel-polyfill", "react", "react-dom"]
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(paths.output),
		chunkFilename: "[chunkhash].js",
		library: "[name]_lib",
		libraryTarget: "window",
		jsonpFunction: "webpackJsonp"
	},
	externals: {
		jquery: "jQuery"
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "manifest"
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.NamedChunksPlugin(),
		new webpack.DllPlugin({
			name: "[name]_lib",
			path: path.join(paths.manifest, "[name].manifest.json")
		})
	]
};
