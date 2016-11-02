import React, {Component} from 'react';
import ImageUploadDialog from './ImageUploadDialog';
import { Button } from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';

class ImageUploadForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		this.handleToggle();
	}

	handleUpload = () => {
		this.handleToggle();
	}

	handleToggle = () => {
    this.setState({active: !this.state.active});
  }

  actions = [
    { label: "OK", onClick: this.handleUpload },
    { label: "Cancel", onClick: this.handleToggle }
  ];

	render() {
		return (
			<form onSubmit={this.handleSubmit} >
					<Button style={{
							position: 'absolute',
							left:    10,
							bottom:   10
						}} icon='add' label='image' flat primary />
					<Dialog
		          actions={this.actions}
		          active={this.state.active}
		          onEscKeyDown={this.handleToggle}
		          onOverlayClick={this.handleToggle}
		          title='Upload Images'
		        >
		          <ImageUploadDialog socket={this.props.socket} 
		          user={this.props.user} />
		      </Dialog>
			</form>
		)
	}
}

export default ImageUploadForm;