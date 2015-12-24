import {default as React, Component} from 'react'

import {Grid, Row, Col, PageHeader, Nav, NavItem, Navbar} from 'react-bootstrap'
import {Link} from 'react-router'

import marked from 'marked'

const sanitize = data => data.replace(/^\W+/, '').replace(/\W+$/, '')

export default class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
			posts: []
		}
	}

	componentWillMount() {

		const req = require.context('../../posts', true, /.*\.md$/)

		const posts = req.keys().map( key => {
			const content = req(key)
			const metaRegex = /^---\n(.+\n)+?---/

			let meta = {}
			content.match(metaRegex)[0]
				.match(/(.+:\W?.+)+/g)
				.map( (data) => {
					const [key, value] = data.split(':')
					meta[sanitize(key)] = sanitize(value)
				})

			meta.tags = meta.tags.split(',') || []

			return Object.assign({
				title: key.match(/\/(.*)\.md/)[1].replace(/\_/g, ' '),
				tags: []
			}, meta, {
				content: marked(content.replace(metaRegex, ''))
			})
		}).sort( (a, b) => a.date < b.date )

		this.setState({
			posts
		})
	}

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12}>
						<PageHeader style={{textAlign:'center'}}>
							Luke Hansell
						</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12}>
						<Navbar>
							<Nav>
								<NavItem href="#/">Home</NavItem>
								<NavItem href="#/about">About</NavItem>
							</Nav>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col xs={12} md={8}>
						{React.cloneElement(this.props.children, {
							posts: this.state.posts
						})}
					</Col>
					<Col xs={12} md={4}>
						<div>
							<h2>Latest Posts</h2>
							<ul>
								{this.state.posts.slice(0,10).map( (post, i) => {
									return (
										<li key={i}>
											<Link to={`/posts/${post.date}/${post.title}`}>{post.title}</Link>
										</li>
									)
								})}
							</ul>
						</div>
					</Col>
				</Row>
			</Grid>
		)	
	}
	
}