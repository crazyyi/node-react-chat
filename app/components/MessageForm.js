import React, {Component} from 'react';
import { Button } from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';

const propTypes = {
	styleClass: React.PropTypes.string
};

class MessageForm extends Component {

	constructor(props) {
		super(props);
		this.state = { body: '', active: false};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		if (event.key === 'Enter') {
			if (this.state.body === '') {
				this.handleToggle();
			} else {
				this.handleSubmit(event);
			}
				
		} else {
			this.setState({
				body: event.target.value
			});
		}
	}
	
	handleSubmit(event) {
		event.preventDefault();

		if (this.state.body === '') {
			this.handleToggle();
		} else {
			const message = {
				user: this.props.user,
				body: this.state.body
			}
			this.props.onMessageSubmit(message);
			this.setState({
				body: ''
			});
		}
		
	}

	handleToggle = () => {
    this.setState({active: !this.state.active});
  }

  actions = [
    { label: "OK", onClick: this.handleToggle }
  ];

	render() {
		return (
			<div>
				<form id="form" onSubmit={this.handleSubmit} method="POST">
						<textarea name="message" className={this.props.styleClass} value={this.state.body}
							onChange={this.handleChange} onKeyUp={this.handleChange}/>
						<Button style={{
							position: 'absolute',
							right:    290,
							bottom:   10
						}} label="Submit" raised primary />
						<Dialog
		          actions={this.actions}
		          active={this.state.active}
		          onEscKeyDown={this.handleToggle}
		          onOverlayClick={this.handleToggle}
		          title='Warning'
		        >
		          <p>Your message can't be blank</p>
		        </Dialog>
				</form>
			</div>
		);
	}
}

MessageForm.propTypes = propTypes;

export default MessageForm;