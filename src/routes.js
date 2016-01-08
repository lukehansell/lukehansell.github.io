import React from 'react'
import {Router, Route} from 'react-router'

import App from './components/App'
import BlogRoll from './components/BlogRoll'
import Post from './components/Post'
import About from './components/About'

module.exports = (
	<Route component={App} >
		<Route path="/" component={BlogRoll} />
		<Route path="posts/:date/:title" component={Post} name="post" />
		<Route path="about" component={About} />
	</Route>
)