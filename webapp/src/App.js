import React, { Component } from "react";
import {hot} from "react-hot-loader";
import PropTypes from 'prop-types';
import "./App.css";
// module imports
import {Camera} from "./components/camera.js"
import {Sensors} from "./components/camera.js"
// material design
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import { withStyles } from "@material-ui/core";
import BurstModeIcon from "@material-ui/icons/BurstMode"
import DeviceHubIcon from "@material-ui/icons/DeviceHub"
// routing
import { Redirect } from 'react-router';
import { utils } from './scripts/utils.js';


//https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658
// Main page of the application

const styles = {
	root: {
		height: window.innerHeight,
	},
	title: {
		fontSize: 38,
		color: '#474646',
		fontFamily: "monospace",
		margin:"0",
		fontWeight: "bold",
		position: "absolute",
		left: "30%",
		top:"5%"
	},
	icon: {
		fontSize: 450,
		color: '#474646',
	},
	buttonLabel: {
		fontSize: 32,
		marginBottom: '0%',
		color: '#474646',
		fontFamily: "monospace",
		fontWeight: "bold"
	},
	card_container: {
		minWidth: 400,
	},
	card: {
		textAlign: 'center',
		height: window.innerHeight*0.6,
		marginLeft: '10%',
		marginRight: '10%',
		borderRadius: 15,
		backgroundColor: "rgb(255, 255, 255)",
	},
	[`@media (max-width: 960px)`] : {
		card: {
			height: window.innerHeight*0.4,
		}
	},
}

class App extends Component{
	constructor(props) {
		super(props);
		this.handlePassKey = this.handlePassKey.bind(this);
		this.state = {
			locked: true,
			authArr: []
		};
		
	}

	handlePassKey(event) {
		this.state.authArr.push(event.keyCode)
		console.log(this.state.authArr);
		if (this.state.authArr.length == 10){ 
			var keycode = this.state.authArr.join(',')
			var url = '/auth?keycode='+keycode;
			self = this;
			var callback = function(response){
				self.setState({locked:  JSON.parse(response)['locked']})
			}
			utils.httpGetAsync(url, callback);
			this.setState({authArr:[]})
		}
	}

	componentDidMount() {
		document.addEventListener("keydown", this.handlePassKey, false)
	}


	render(){
		const { classes } = this.props;
		return(
			<div>
			<p className={classes.title}> iq80 - Barely Smart Home Controller </p>
			<Grid       className={classes.root}
						container spacing = {0} 
						justify="center"
						alignItems="center">
				<Grid  className={classes.card_container}
				       item xs={7} md={6}>
					<BigFatButton classes={classes}
								  route='/camera'
								  disabled={this.state.locked}>
							<p className={classes.buttonLabel}> Motion Detection and Video </p>
							<BurstModeIcon className={classes.icon}></BurstModeIcon>
					</BigFatButton>
				</Grid>
				<Grid className={classes.card_container} 
				       item xs={7} md={6} >
					<BigFatButton classes={classes}
								  route={'/sensors'}
								  disabled={this.state.locked}>
								<p className={classes.buttonLabel}> Sensors and Devices (Coming Soon!) </p>
								<DeviceHubIcon className={classes.icon}></DeviceHubIcon>
					</BigFatButton>
				</Grid>
			</Grid>
			</div>
		);
	}
}

class BigFatButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			buttonShadow: '0 8px 8px 8px rgba(0, 0, 0, 0.4)',
			redirect: false
		};
		this.buttonPressDown = this.buttonPressDown.bind(this);
		this.buttonReleased = this.buttonReleased.bind(this);
		this.buttonReleasedWithRoute = this.buttonReleasedWithRoute.bind(this);
	}

	buttonPressDown(event) {
		this.setState({buttonShadow: 'inset 0 8px 8px 8px rgba(0, 0, 0, 0.4)'})
	}
	buttonReleased(event) {
		this.setState({buttonShadow: '0 8px 8px 8px rgba(0, 0, 0, 0.4)'})
	}
	buttonReleasedWithRoute(event) {
		
		this.buttonReleased(event);
		if (this.props.disabled===true) {
			return -1
		}
		this.setState({redirect:true})
	}

	render() {
		const { classes, route } = this.props;
		if (this.state.redirect) {
			return <Redirect push to={route}/>
		}
		return(
			<Card className={classes.card}
				  style={{boxShadow: this.state.buttonShadow}}
				  onPointerDown={this.buttonPressDown}
				  onPointerUp={this.buttonReleasedWithRoute}
				  onPointerLeave={this.buttonReleased}>
				{this.props.children}
			</Card>
		)
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);