import React, { Component } from "react";
import "../../App.css";
// MUI
import { withStyles, withTheme } from "@material-ui/core";
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid'

const styles = {
    root: {},
    imageRibbon: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'end',
        overflow: 'hidden',
    },
}


class ImageMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render(){
        const { classes } = this.props;
        return(
            <div className={classes.root}>
                <Grid   className={classes.root}
                        container spacing = {0} 
                        justify="center"
                        alignItems="center">

                    <Card className={classes.card}>
                        <CardMedia
                            component="img"
                            alt="Main picture"
                            className={classes.imageMain}
                            image={this.props.imageMain}
                            title={this.props.imageTitle}>
                        </CardMedia>
                    </Card>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(ImageMain);
