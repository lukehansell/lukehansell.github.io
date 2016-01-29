var frontmatter = require('front-matter')
var path = require('path')

var routes = ['/', '/about']

var fs = require('fs')
var postDir = path.join(__dirname, 'posts');
var postFiles = fs.readdirSync(postDir)

postFiles.forEach(function(post) {
	var content = fs.readFileSync(path.join(postDir, post), 'utf8');
	routes.push('/posts/' + frontmatter(content).attributes.slug)
})

module.exports = {
	title: 'My Static Site',
	routes: routes
}