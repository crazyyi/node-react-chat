import React, {Component} from 'react';
import ImageUploadDialog from './ImageUploadDialog';
import { Button } from 'react-toolbox/lib/button';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

class ImageUploadForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleToggle = this.handleToggle.bind(this);
	}

	getChildContext() {
      return { muiTheme: getMuiTheme(baseTheme) };
  }

	handleSubmit(event) {
		event.preventDefault();
		this.handleToggle();
	}

	handleUpload = () => {
		this.handleToggle();
	}

	handleToggle = () => {
    this.setState({open: !this.state.open});
  }

	render() {
		const actions = [
	    <FlatButton
	    	label="OK"
	    	primary={true}
	    	keyboardFocused={true}
	    	onTouchTap={this.handleToggle} />,

	    <FlatButton
	    	label="Cancel"
	    	primary={true}
	    	onTouchTap={this.handleToggle} />,
	  ];
		return (
			<form onSubmit={this.handleSubmit} >
					<Button style={{
							position: 'absolute',
							left:    10,
							bottom:   10
						}} icon='add' label='image' flat primary />
					<Dialog
		          actions={actions}
		          modal={false}
		          open={this.state.open}
		          onRequestClose={this.handleToggle}
		          title='Upload Images'
		        >
		          <ImageUploadDialog socket={this.props.socket} 
		          user={this.props.user} />
		      </Dialog>
			</form>
		)
	}
}

ImageUploadForm.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};
export default ImageUploadForm;