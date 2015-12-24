var path = require('path');

module.exports = {
	entry: "./src/index.js",
	output: {
		path: __dirname + '/public/assets',
		publicPath: '/assets/',
		filename: 'app.js'
	},
	module: {
		loaders: [{ 
			test: /\.jsx?$/,
			loader: "babel-loader"
		}, { 
			test: /\.md$/,
			loader: "raw-loader"
		}, {
			test: /\.css$/,
			loader: "style-loader!css-loader"
		}]
	}
}