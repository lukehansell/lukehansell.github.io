import React, {Component} from 'react'

import {Row, Panel} from 'react-bootstrap'

import BlogItem from './BlogItem'

export default class Post extends Component {
	render() {
		
		const {slug} = this.props.routeParams

		const post = this.props.posts.find( post => post.slug === slug )

		if(!post) return (<p>Post not found</p>)

		return (
			<BlogItem {...post} />
		)
	}
}