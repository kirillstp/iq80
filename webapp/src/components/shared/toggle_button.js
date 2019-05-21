import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles, withTheme } from "@material-ui/core";

const styles = {
	root:{
	}
};

class ToggleButton extends Component {
	constructor(props) {
		super(props);
        this.state = {
            on: props.defaultState
        }
        this.onToggle = this.onToggle.bind(this);
	}
	onToggle() {
        this.setState({on: !this.state.on})
        this.props.toggleMethod(!this.state.on)
	};
	render() {
		const {classes} = this.props;
		return (
			<div>
                <Button 
                    variant={this.state.on?"contained":'outlined'}
                    size="large" 
                    color="primary" 
                    className={classes.margin}
                    onClick = {this.onToggle}>
                    {this.props.children}
                </Button>
			</div>
		)
	};

  }

  export default withStyles(styles)(ToggleButton);