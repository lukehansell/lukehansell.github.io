import React, {Component} from 'react'
import {Panel} from 'react-bootstrap'
import {Link} from 'react-router'

require('../style/blogItem.css')

export default class BlogItem extends Component {

	render() {
		return (
			<Panel className="blogItem" >
				<h2>{this.props.title}</h2>
				<div dangerouslySetInnerHTML={{__html: this.props.content}} />
				{this.props.date && (
					<small>Posted on: {this.props.date}</small>
				)}

				{this.props.tags.length > 0 && (
					<ul>
						{this.props.tags.map( (tag, i) => {
							return (
								<li key={i}>
									<Link to="/" query={{tag}}>{tag}</Link>
								</li>
							)
						})}
					</ul>
				)}
			</Panel>
		)
	}

}