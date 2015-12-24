import React, {Component} from 'react'

import {Row, Panel} from 'react-bootstrap'

import BlogItem from './BlogItem'

export default class Post extends Component {
	render() {
		
		const {date, title} = this.props.routeParams

		const post = this.props.posts.find( (post) => {
			return post.date === date && post.title === title
		})

		if(!post) return (<p>Post not found</p>)

		return (
			<BlogItem {...post} />
		)
	}
}