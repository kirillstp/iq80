import React, { Component } from "react";
import "../App.css";
// MUI
import { withStyles, withTheme } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';

// My Classes
import Header from './shared/header.js'
import ToggleButton from './shared/toggle_button.js'
import ImageMain from './camera/image.js'
import ImageRibbon from './camera/image_ribbon.js'

const styles = {
};

const proc_images = require.context('../static/md_images/', true)

class Camera extends Component {
		
		// Motion detection user interface. 

		constructor(props) {
			super(props);
			this.state = {
				videoMode: false,
				imageList: {},
				imageCurrent: 1,
			};
			this.toggleCameraMode = this.toggleCameraMode.bind(this);
			this.generateTestList = this.generateTestList.bind(this);
		}
		toggleCameraMode(val) {
			this.setState({videoMode: val})
		}
		generateTestList(){
			let imageListLocal = [];
			for (let i = 0; i <= 20; i++) {
				imageListLocal[i] = {}
				imageListLocal[i]['title'] = i
				imageListLocal[i]['src'] = proc_images('./proc_image.png')
			}
			return imageListLocal;
		}
		render(){
				const { classes } = this.props;
				return(
				<div className={classes.root}>
					<Header title="Camera and Motion Detection"></Header>
					<ToggleButton 
						defaultState={this.state.videoMode}
						toggleMethod={this.toggleCameraMode}>
						Video Mode: {this.state.videoMode?"On":"Off"}
					</ToggleButton>
					<ImageMain 
						imageMain = {proc_images('./proc_image.png')}
						imageTitle = "Main Image Area">
					</ImageMain>
					<Divider variant="middle" />
					<ImageRibbon
						imageRibbon = {this.generateTestList()}>

					</ImageRibbon>
				
				</div>
				);
		}
}
export default withStyles(styles)(Camera);