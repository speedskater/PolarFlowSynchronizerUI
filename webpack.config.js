var path = require("path");
var util = require("util");
var webpack = require("webpack");

module.exports = {
	cache: true,
	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "dist/",
		filename: "[name].js",
		chunkFilename: "[chunkhash].js"
	},
	module: {
		loaders: [
			{ test: /\.jsx$/,   loader: "jsx-loader?insertPragma=React.DOM&harmony=true" },
			{
				test: /\.json$/,
				loader: "json-loader"
			}
		]
	},
	resolve: {
		root: path.join(path.join(__dirname, 'src'), 'node_modules')/*,
		modulesDirectories: [path.join(path.join(__dirname, 'src'), 'node_modules'), path.join(path.join(__dirname, 'src'), 'bower_components')]*/
	},
	plugins: []
};