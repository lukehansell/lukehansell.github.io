import React, {Component} from 'react'

import BlogItem from './BlogItem'

export default class BlogRoll extends Component {
	filterPosts(post) {

		if(this.props.location.query &&
			this.props.location.query.tag && 
			post.tags.indexOf(this.props.location.query.tag) === -1) return false

		return true
	}

	render() {
		return (
			<ul className="blogroll">
				{this.props.posts.filter((post) => this.filterPosts(post)).slice(0,4).map( (post, i) => {
					return (
						<li key={i}>
							<BlogItem {...post} />
						</li>
					)
				})}
			</ul>
		)
	}
}

BlogRoll.defaultProps = {
	posts: []
}