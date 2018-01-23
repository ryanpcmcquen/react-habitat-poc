const babelConfig = require("./builder/config/babel.config");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");

module.exports = {
	components: "source/{components,containers}/**/*.{js,jsx}",
	require: ["jquery", "bootstrap"],
	serverHost: "0.0.0.0",
	serverPort: 6060,
	styleguideDir: "./styleguide",
	styleguideComponents: {
		Wrapper: path.join(__dirname, "source/styleguide/Wrapper")
	},
	title: "SLT components style guide",
	template: "./styleguide.template.html",
	webpackConfig: {
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
				},
				{
					test: /\.scss$/,
					use: ExtractTextPlugin.extract({
						fallback: "style-loader",
						use: "sass-loader"
					}),
					exclude: /(node_modules|bower_components)/
				}
			]
		},
		plugins: [new ExtractTextPlugin("[name].css")]
	}
};
