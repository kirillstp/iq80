import React, { Component } from "react";
import "../../App.css";
// MUI
import { withStyles, withTheme, Card } from "@material-ui/core";
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import IconButton from '@material-ui/core/IconButton'
import ArrowLeft from '@material-ui/icons/ArrowLeft'
import ArrowRight from '@material-ui/icons/ArrowRight'

const styles = {
    root: {},
    gallery: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center' 
    },
    imageRibbon: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'end',
        overflow: 'hidden',
    },
    GridListTile: {
        display: 'flex',
        alignItems: "center"
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    singleImage: {
        height: 250,
        margin: 20,
        border: "5px solid transparent"
    },
    navIcons:{
        fontSize: 75
    }
}



class ImageRibbon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reverse_index: 0,
            cols: 4,
            defaultCols: 4,
            ribbonHeight: "auto",
            endIndex: -1,
            startIndex: -1,
            currentIndex: -1,
            buttonLeftText: "<"
        };
        this.isSelected = this.isSelected.bind(this)
        this.select = this.select.bind(this)
        this.scrollToLatest = this.scrollToLatest.bind(this)
        this.setStartIndex = this.setStartIndex.bind(this)
        this.setEndIndex = this.setEndIndex.bind(this)
        this.setCurrentIndex = this.setCurrentIndex.bind(this)
        this.prev = this.prev.bind(this)
        this.next = this.next.bind(this)
    }
    isSelected(image) {
        var index = this.props.imageRibbon.indexOf(image)
        if (index == this.state.currentIndex) {
            return  {
                border: "5px solid blue"
            }
        }
        else {
            return {}
        }
    }
    select(event){
        if (event.hasOwnProperty('target')){
            if (event.target.hasAttribute('src')){
                var image = event.target.getAttribute('src');
            }
            else {
                return false
            }
        }
        else {
            return false
        }
        var index = this.props.imageRibbon.indexOf(image);
        this.setCurrentIndex(index);
        return true
    }

    componentDidUpdate(){
        var imageRibbonLength = this.props.imageRibbon.length
        if (this.state.startIndex == this.state.endIndex == this.state.cuirrentIndex == -1) {
            // If image ribbon did not load indices will be -1
            this.scrollToLatest(imageRibbonLength)
        }
        else if (this.state.endIndex == this.state.currentIndex && this.state.endIndex < imageRibbonLength - 1){
            // If end index equals to current index that means scroll both forward
            this.scrollToLatest(imageRibbonLength)
        }
        if (this.state.startIndex != -1 && this.state.endIndex != -1 && this.state.currentIndex == -1 ) {
            // Indices have been set in the previous update. 
            // Selection must take place in the next update, otherwise end and start indices used for verification will return -1
            this.setCurrentIndex(imageRibbonLength-1)
        }
    }
    scrollToLatest(len) {
        this.setStartIndex(len - this.state.cols)
        this.setEndIndex(len)
        this.setCurrentIndex(len)
    }
    setStartIndex(ind) {
        if (ind >= this.props.imageRibbon.length){
            return
        }
        this.setState({startIndex:Math.max(ind, 0)})
    }

    setEndIndex(ind) {
        var value = Math.min(ind, this.props.imageRibbon.length)
        if (value <= 0) {
            value = 1
        }
        this.setState({endIndex:value})
    }
    setCurrentIndex(ind){
        if (ind <= this.state.endIndex && ind >= this.state.startIndex){
            // console.log("Current Index is set to "+ind)
            this.setState({currentIndex:ind})
            this.setMainImage(ind)
        }
    }
    setMainImage(ind){
        this.props.setMainImageCallback(this.props.imageRibbon[ind])
    }

    prev() {
        var newStartIndex =  this.state.startIndex - this.state.cols
        var newEndIndex = newStartIndex + this.state.cols
        this.setStartIndex(newStartIndex)
        this.setEndIndex(newEndIndex)
        if (newStartIndex < 0) {
            this.setState({cols:newEndIndex})
        }
    }

    next() {
        if (this.state.cols != this.state.defaultCols) {
            this.setState({cols: this.state.defaultCols})
        }
        if (this.state.startIndex == 0) {
            var newStartIndex = this.props.imageRibbon.length%this.state.defaultCols
        }
        else if (this.state.startIndex > 0) {
            var newStartIndex = this.state.startIndex + this.state.defaultCols
        }
        var newEndIndex = newStartIndex + this.state.defaultCols
        this.setStartIndex(newStartIndex)
        this.setEndIndex(newEndIndex)

    }

    render(){
        const { parentCallback, classes } = this.props;
        return(
            <Card className={classes.gallery}>
                <IconButton onClick = {this.prev}>  
                    <ArrowLeft className={classes.navIcons}>
                    </ArrowLeft>
                </IconButton>
                <GridList className={classes.gridList}
                        cols = {this.state.cols}
                        cellHeight={this.state.ribbonHeight}>
                    {
                        this.props.imageRibbon.slice(this.state.startIndex,this.state.endIndex).map(
                            image => (
                                <GridListTile 
                                        className = {classes.imageRibbonTile} 
                                        key={image}>
                                    <div className={classes.galleryImage}
                                         onClick = {this.select}>
                                        <img  className = {classes.singleImage}
                                              style = {this.isSelected(image)}
                                              src={image}>
                                        </img>
                                    </div>
                                </GridListTile>
                            )
                        ) 
                    }
                </GridList>
                <IconButton  onClick = {this.next}>  
                    <ArrowRight className={classes.navIcons}>
                    </ArrowRight>
                </IconButton>
            </Card>
        )
    }
}

export default withStyles(styles)(ImageRibbon);