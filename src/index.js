import {default as React, Component} from 'react'
import {render} from 'react-dom'

import {Router, Route} from 'react-router'

import App from './components/App'
import BlogRoll from './components/BlogRoll'
import Post from './components/Post'
import About from './components/About'

import './index.css'

render((
	<Router>
		<Route component={App} >
			<Route path="/" component={BlogRoll} />
			<Route path="posts/:date/:title" component={Post} />
			<Route path="about" component={About} />
		</Route>
	</Router>
), document.getElementById('app'))