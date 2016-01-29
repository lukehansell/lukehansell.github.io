var webpack = require('webpack')
var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
var data = require('./data')
var path = require('path')
var PROD = process.env.NODE_ENV === 'production'

module.exports = {
	entry: "./entry.js",
	output: {
		path: __dirname + '/public',
		filename: 'app.js',
		libraryTarget: 'umd'
	},
	module: {
		loaders: [{ 
			test: /\.jsx?$/,
			loader: "babel-loader",
			exclude: /node_modules/
		}, { 
			test: /\.md$/,
			loader: "raw-loader",
			exclude: /node_modules/
		}, {
			test: /\.css$/,
			loader: "style-loader!css-loader",
			exclude: /node_modules/
		}]
	},
	historyApiFallback: true,
	plugins: PROD ? [
		new webpack.optimize.UglifyJsPlugin({minimize: true}),
		new StaticSiteGeneratorPlugin('app.js', data.routes, data)
	] : [
		new StaticSiteGeneratorPlugin('app.js', data.routes, data)
	]
}