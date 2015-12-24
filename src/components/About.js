import React from 'react'
import {Panel} from 'react-bootstrap'
import Gravatar from 'react-gravatar'

const aboutContent = require('html!markdown!../../pages/about.mxd')

export default () => {

	const publishedWork = [{
		title: 'futu printer',
		link: 'http://futu-printer.com/#/',
		description: 'React based app for printing photos via a local printer.'
	}, {
		title: 'react-trackable',
		link: 'https://www.npmjs.com/package/react-trackable',
		description: 'React component which wraps children with data attributes passed via context.'
	}, {
		title: 'react-google-ad',
		link: 'https://www.npmjs.com/package/react-google-ad',
		description: 'React component wrapper for a Google AdSense advert.'
	}, {
		title: 'redirectify',
		link: 'https://www.npmjs.com/package/redirectify',
		description: 'Browserify plugin to redirect require statements.'
	}, {
		title: 'grunt-poly-browserify',
		link: 'https://www.npmjs.com/package/grunt-poly-browserify',
		description: 'Grunt plugin to run multiple browserify instances with differing config.'
	}]

	return (
		<div>
			<Panel header="Who am I?">
				<div style={{float: 'left', padding: '0 10px 10px 0'}}>
					<Gravatar email="lukehansell@gmail.com" size={100}/>
				</div>
				<div dangerouslySetInnerHTML={{__html: aboutContent}} />
			</Panel>
			<Panel header="Published Work">
				<ul>
					{publishedWork.map( (work, i) => {
						return (
							<li key={i}>
								<a href={work.link}>{work.title}</a>
								{work.description && (
									<p>- {work.description}</p>
								)}
							</li>
						)
					})}
				</ul>
			</Panel>
		</div>
	)
}