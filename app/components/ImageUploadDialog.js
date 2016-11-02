import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import Spinner from 'react-spinner';

const CLOUDINARY_UPLOAD_PRESET = 'c1gprcm7';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dpp1fgy7c/upload';

class ImageUploadDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
      uploadedFileCloudinaryUrl: '',
      uploading: false
    };

    this.onImageDrop = this.onImageDrop.bind(this);
	}

	onImageDrop(files) {
		this.setState({
			uploadedFile: files[0],
			uploading: true
		});

		this.handleImageUpload(files[0]);
	}

	handleImageUpload(file) {
		let upload = request.post(CLOUDINARY_UPLOAD_URL)
												.field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
												.field('file', file);

		upload.end((err, response) => {
			if (err) {
				console.error(err);
			}

			if (response.body.secure_url !== '') {
				this.setState({
					uploadedFileCloudinaryUrl: response.body.secure_url,
					uploading: false
				});

				let socket = this.props.socket;

				if (this.state.uploadedFileCloudinaryUrl !== '') {
					socket.emit('image:upload', {
						user: this.props.user,
						image: this.state.uploadedFileCloudinaryUrl
					});
				}
					
			}
		});
	}

	render() {
		return (<div>
							<div className="fileUpload" >
								<Dropzone 
								style={{
		          		width: 300,
					        height: 150,
					        borderWidth: 2,
					        borderColor: '#666',
					        borderStyle: 'dashed',
					        borderRadius: 5,
					        textAlign: 'center',
		          	}}
		            multiple={false}
								accept="image/*"
								onDrop={this.onImageDrop} >
								<p>Drop an image or click to select a file to upload</p>
								</Dropzone>
							</div>

							<div style={{
								minWidth: 100,
								minHeight: 80 }}>
								{this.state.uploading? <span style={{textAlign: 'center'}}>{"\n"}Uploading...</span> :
								(this.state.uploadedFileCloudinaryUrl === ''? null : 
									<div>
										<p>{this.state.uploadedFile.name}</p>
										<img src={this.state.uploadedFileCloudinaryUrl} />
									</div>)}
								
							</div>
						</div>
						);
		
	}
}

export default ImageUploadDialog;