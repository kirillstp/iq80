import React, { Component } from "react";
import "../../App.css";
// MUI
import { withStyles, withTheme } from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
	root: {
	  flexGrow: 1,
	},
	menuButton: {
	  marginLeft: 10,
	  marginRight: 10,
	},
	appBar:{
		backgroundColor: 'white'
	}
  };
  

class Header extends Component {
		// Application bar
		constructor(props) {
				super(props);
				this.state = {};
		}

		render(){
				const { classes, title } = this.props;
				return(
                    <AppBar className={classes.appBar} position="static">
                        <Toolbar className={classes.toolbar}>
                            <IconButton className={classes.menuButton} aria-label="Menu">
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6">
                                { title }
                            </Typography>
                        </Toolbar>
                    </AppBar>
				);
		}
}
export default withStyles(styles)(Header);