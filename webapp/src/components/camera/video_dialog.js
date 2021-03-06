import React, { Component } from "react";
import "../../App.css";
// MUI
import { withStyles, withTheme, Button } from "@material-ui/core";
import Card from '@material-ui/core/Card'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle'

const styles = {
    root: {
    },
}

class VideoDialog extends Component {
    // Try as hard as I can to make this stateless to see the benefits
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render(){
        const { classes } = this.props;
        return(
            <Dialog onClose={this.props.closeVideoDialog}
                    open={this.props.openVideoDialog}>
                <DialogContent>
                    COMING SOON!!!
                </DialogContent>
                <DialogActions>
                    <Button onClick = {this.props.closeVideoDialog}>
                        Close me
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(VideoDialog);
