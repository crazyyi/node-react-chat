import React, {Component} from 'react';

class Message extends Component {
	render() {
		return (
				<div className="message">
					<strong>{this.props.user.name}</strong>{": "}

					<span>{/(\.jpg|\.jpeg|\.png|\.gif)$/.test(this.props.body)?
						<img src={this.props.body} /> : this.props.body}</span>
				</div>
		);
	}
}

export default Message;