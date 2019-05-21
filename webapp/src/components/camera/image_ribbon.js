import React, { Component } from "react";
import "../../App.css";
// MUI
import { withStyles, withTheme } from "@material-ui/core";
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'

const styles = {
    root: {},
    imageRibbon: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'end',
        overflow: 'hidden',
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
}



class ImageRibbon extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render(){
        const { classes } = this.props;
        return(
            <GridList   
                className={classes.gridList}
                cols = {12}>
                {
                    this.props.imageRibbon.map(
                        image => (
                            <GridListTile className = {classes.imageRibbonTile} 
                                    key={image.title}>
                                <img src={image.src} alt={image.title}>
                                </img>
                            </GridListTile>
                        )
                    ) 
                }
                
            </GridList>
        )
    }
}

export default withStyles(styles)(ImageRibbon);