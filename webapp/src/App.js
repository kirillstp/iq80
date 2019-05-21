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
// routing
import { Redirect } from 'react-router';

//https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658
// Main page of the application

const styles = {
	root: {
		height: window.innerHeight,
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
		this.state = {
		}
	}
	render(){
		const { classes } = this.props;
		return(
			<Grid className={classes.root}
						container spacing = {0} 
						justify="center"
						alignItems="center">
				<Grid  className={classes.card_container}
				       item xs={7} md={6}>
					<BigFatButton classes={classes}
								  route='/camera'>
							<p>I AM TEXT BUT I COULD BE AN IMAGE</p>
					</BigFatButton>
				</Grid>
				<Grid className={classes.card_container} 
				       item xs={7} md={6} >
					<BigFatButton classes={classes}
								  route={'/sensors'}>
								<p>I AM TEXT BUT I COULD BE AN IMAGE</p>
					</BigFatButton>
				</Grid>
			</Grid>
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
				  {route}
				{this.props.children}
			</Card>
		)
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);