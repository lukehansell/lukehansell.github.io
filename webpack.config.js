var path = require('path');

module.exports = {
	entry: "./src/index.js",
	output: {
		path: __dirname + '/public',
		publicPath: '/public/',
		filename: 'app.js'
	},
	module: {
		loaders: [{ 
			test: /\.jsx?$/,
			loader: "babel-loader"
		}]
	}
}