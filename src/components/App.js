import {default as React, Component} from 'react'

import {Grid, Row, Col, PageHeader, Nav, NavItem, Navbar} from 'react-bootstrap'
import {Link} from 'react-router'
import GoogleAd from 'react-google-ad'

import marked from 'marked'
import frontMatter from 'front-matter'

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
			const parsed = frontMatter(req(key))

			return Object.assign({
				title: key.match(/\/(.*)\.md/)[1].replace(/\_/g, ' '),
				tags: []
			}, parsed.attributes, {
				content: marked(parsed.body)
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
											<Link to={`/posts/${post.slug}`}>{post.title}</Link>
										</li>
									)
								})}
							</ul>
							<GoogleAd client="ca-pub-7146027200430145" slot="6621837438" format="auto" />
						</div>
					</Col>
				</Row>
			</Grid>
		)	
	}
	
}