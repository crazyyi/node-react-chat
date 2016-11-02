import React, {Component} from 'react';
import Message from './Message';

class MessageBoard extends Component {

	// component scrolls to its content height, 
	// see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight 
	// for reference
	componentDidUpdate() {
		this._div.scrollTop = this._div.scrollHeight; 
	}

	render() {
		return (
			<div className={this.props.styleClass} ref={(ref) => this._div = ref}>
				<h2>{this.props.body}</h2>
				{
					this.props.messages.map((message, i) => {
						return (
								<Message 
									key={i}
									user={message.user}
									body={message.body}
								/>
							);
					})
				}
			</div>
		);
	}
}

export default MessageBoard;