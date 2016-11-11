import React, {Component} from 'react';
import ReactEmoji from 'react-emoji';

class Message extends Component {
	render() {

		return (
				<div className="message">
					<strong>{this.props.user.name}</strong>{": "}

					{/(\.jpg|\.jpeg|\.png|\.gif)$/.test(this.props.body)?
						<img src={this.props.body} /> : ReactEmoji.emojify(this.props.body)}
				</div>
		);
	}
}

export default Message;