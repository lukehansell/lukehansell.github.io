import {default as React, Component} from 'react'
import {render} from 'react-dom'

import {Router, Route} from 'react-router'

import routes from './routes'
import './index.css'

render((
	<Router routes={routes} />
), document.getElementById('app'))