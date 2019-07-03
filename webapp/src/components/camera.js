import React, { Component } from "react";
import "../App.css";
// MUI
import { withStyles, withTheme } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
// My Classes
import Header from './shared/header.js'
import ToggleButton from './shared/toggle_button.js'
import ImageMain from './camera/image.js'
import ImageRibbon from './camera/image_ribbon.js'
import VideoDialog from './camera/video_dialog.js'
import SettingsDialog from './camera/settings_dialog.js'
import { MotionDetectionCtrlr } from '../scripts/motion_detection.js'
import { utils } from '../scripts/utils.js';

const styles = {
	buttons: {
        display: 'flex',
        justifyContent: 'center',
		alignItems: 'center',
		margin: 20,
	},
	button: {
		marginLeft: 20,
		marginRight: 20
	}
};

// const proc_images = require.context('../static/md_images/', true)
const proc_images = require.context('../../dist/processed_images/', true)
class Camera extends Component {
		
		// Motion detection user interface. 

		constructor(props) {
			super(props);

			this.toggleMotionDetection = this.toggleMotionDetection.bind(this);
			this.tickDev = this.tickDev.bind(this)
			this.tick = this.tick.bind(this);
			this.setImage = this.setImage.bind(this);
			this.openVideoDialog = this.openVideoDialog.bind(this);
			this.closeVideoDialog = this.closeVideoDialog.bind(this);
			this.openSettingsDialog = this.openSettingsDialog.bind(this);
			this.closeSettingsDialog = this.closeSettingsDialog.bind(this);

			window.setInterval(this.tickDev,1500);
			this.motionDetectionController = MotionDetectionCtrlr;
			
			this.state = {
				detectMotion: false,
				imageList: this.motionDetectionController.getImageRibbonObject(),
				imageCurrent: '',
				update: false,
				videoDialog: false,
				settingsDialog: false
			};
		}

		toggleMotionDetection(val) {
			this.setState({detectMotion: val})
		}

		tick(){
			var url = '/motion_detection/tick';
			self = this;
			var callback = function(response){
				self.motionDetectionController.updateImagesDev();
			}
			utils.httpGetAsync(url, callback);
			this.setState({update: true})
		}

		tickDev(){
			this.motionDetectionController.updateImagesDev(proc_images);
			this.setState({update: true})
		}

		setImage(image) {
			this.setState({imageCurrent: image})
		}

		openVideoDialog(){
			this.setState({videoDialog:true})
		}

		closeVideoDialog(){
			this.setState({videoDialog:false})
		}

		openSettingsDialog(){
			this.setState({settingsDialog:true})
		}

		closeSettingsDialog(){
			this.setState({settingsDialog:false})
		}

		render(){
				const { classes } = this.props;
				return(
					<div className={classes.root}>
						<Header title="Camera and Motion Detection"></Header>

						<div className={classes.buttons}>
							<Button className={classes.button}
									variant="contained"
									size="large" 
									color="primary" 
									onClick = {this.openSettingsDialog}>
								Settings
							</Button>
							<SettingsDialog openSettingsDialog = {this.state.settingsDialog}
										    closeSettingsDialog = {this.closeSettingsDialog}>
							</SettingsDialog>
							<ToggleButton className={classes.button}
										  defaultState={this.state.detectMotion}
										  toggleMethod={this.toggleMotionDetection}>
								Motion Detection: {this.state.detectMotion?"On":"Off"}
							</ToggleButton>
							<Button className={classes.button}
									variant="contained"
									size="large" 
									color="primary"
									onClick = {this.openVideoDialog}>
								Video
							</Button>
							<VideoDialog openVideoDialog = {this.state.videoDialog}
										 closeVideoDialog = {this.closeVideoDialog}>
							</VideoDialog>
						</div>
						<ImageMain 
							imageMain = {this.state.imageCurrent}
							imageTitle = "Main Image Area">
						</ImageMain>
						<Divider variant="middle" />
						<ImageRibbon
							imageRibbon = {this.state.imageList.getList()}
							setMainImageCallback = {this.setImage}>
						</ImageRibbon>
					</div>
				);
		}
}
export default withStyles(styles)(Camera);