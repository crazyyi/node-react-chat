import React, {Component} from 'react';
import { Button } from 'react-toolbox/lib/button';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const propTypes = {
	styleClass: React.PropTypes.string
};

class MessageForm extends Component {

	constructor(props) {
		super(props);
		this.state = { body: '', open: false};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getChildContext() {
      return { muiTheme: getMuiTheme(baseTheme) };
  }

  componentWillReceiveProps(nextProps) {
  	if (this.props.reference !== nextProps.reference) {
  		let displayReference = '';
  		if (nextProps.reference !== undefined) {
  			displayReference += "@" + nextProps.reference.name + ": ";
  		} 
  		this.setState({
		  	body: displayReference
		  });
  	}
  }

	handleChange(event) {
		event.preventDefault();
		if (event.key === 'Enter') {
			if (this.state.body.trim() === '') {
				this.setState({
					body: ''
				});
				this.handleToggle();
			} else {
				this.handleSubmit(event);
			}
				
		} else {
			let value = event.target.value;
			this.setState({
				body: value
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
			const toUser = this.props.reference;
			this.props.onMessageSubmit(message, toUser);
			this.setState({
				body: ''
			});
		}
		
	}

	handleToggle = () => {
    this.setState({open: !this.state.open});
  }

	render() {
		const  actions = [
	    <FlatButton
	    	label="OK"
		    primary={true}
		    onTouchTap={this.handleToggle} />,
	  ];
		return (
			<div className="messageformContainer">
				<form id="form" onSubmit={this.handleSubmit} method="POST">
						<textarea name="message" className={this.props.styleClass} 
							ref={input => input && input.focus()}
							value={this.state.body}
							onChange={this.handleChange} onKeyUp={this.handleChange}/>
						<Dialog
			          actions={actions}
			          modal={false}
			          open={this.state.open}
			          onRequestClose={this.handleToggle}
			          title='Warning'>
			          <p>Your message can't be blank</p>
		        </Dialog>
						<Button id="submitBtn" label="Submit" raised primary />
				</form>
			</div>
		);
	}
}

MessageForm.propTypes = propTypes;
MessageForm.childContextTypes = {
	muiTheme: React.PropTypes.object.isRequired,
};

export default MessageForm;