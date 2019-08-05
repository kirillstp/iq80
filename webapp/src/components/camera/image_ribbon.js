import React, { Component } from "react";
import "../../App.css";
// MUI
import { withStyles, withTheme, Card } from "@material-ui/core";
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import IconButton from '@material-ui/core/IconButton'
import ArrowLeft from '@material-ui/icons/ArrowLeft'
import ArrowRight from '@material-ui/icons/ArrowRight'
import Slider from '@material-ui/lab/Slider'

const styles = {
    root: {},
    gallery: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center' 
    },
    sliderCard: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center' ,
        height: 50,
    },
    slider: {
        marginLeft: 60,
        marginRight: 60,
        marginTop:5,
        marginBottom:5
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
        height: 240,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 5,
        marginBottom: 20,
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
        this.selectMouse = this.selectMouse.bind(this)
        this.selectSlider= this.selectSlider.bind(this)
        this.scrollToLatest = this.scrollToLatest.bind(this)
        this.setStartIndex = this.setStartIndex.bind(this)
        this.setEndIndex = this.setEndIndex.bind(this)
        this.setCurrentIndex = this.setCurrentIndex.bind(this)
        this.prev = this.prev.bind(this)
        this.next = this.next.bind(this)
    }

    isSelected(image) {
        // If image selected draw a border around it
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

    selectMouse(event){
        // event contains attribute. If render did not happen yet, return false
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

    selectSlider(event, value){
        // Check if range needs to be changed.
        var min = this.state.startIndex
        var max = this.state.endIndex
        if (value < this.state.startIndex) {
            this.prev()
        }
        if (value > this.state.endIndex) {
            this.next()
        }
        // console.log(this.state.startIndex + ' - ' + this.state.currentIndex+'('+value+')'+ ' - '+ this.state.endIndex)
        this.setCurrentIndex(value, true)
    }

    componentDidUpdate(){
        var imageRibbonLength = this.props.imageRibbon.length
        // console.log("Total length: "+imageRibbonLength)
        // console.log("Start index: "+this.state.startIndex + "Current Index: "+this.state.currentIndex + "End index: "+this.state.endIndex)
        
        if (this.props.updated() && this.state.endIndex-1 == this.state.currentIndex){
            // If current index equals to total length that means new image is ready and app should keep up
            this.scrollToLatest(imageRibbonLength)
            this.props.consumeUpdatedFlagCallback()
        }

        if (this.state.startIndex == this.state.endIndex && this.state.endIndex == -1 && imageRibbonLength > 0) {
            // If image ribbon did not load indices will be -1
            this.scrollToLatest(imageRibbonLength)
        }
        else if (this.state.startIndex != -1 && this.state.endIndex != -1 && this.state.currentIndex == -1 ) {
            // Indices have been set in the previous update. 
            // Selection must take place in the next update, otherwise end and start indices used for verification will return -1
            this.scrollToLatest(imageRibbonLength)
        }
    }
    scrollToLatest(len) {
        this.setStartIndex(len-this.state.cols)
        this.setEndIndex(len)
        this.setCurrentIndex(len-1)
    }
    setStartIndex(ind) {
        if (ind >= this.props.imageRibbon.length){
            return
        }
        this.setState({startIndex:Math.max(ind, 0)})
        return ind
    }

    setEndIndex(ind) {
        var value = Math.min(ind, this.props.imageRibbon.length)
        if (value <= 0) {
            value = 1
        }
        this.setState({endIndex:value})
        
    }
    setCurrentIndex(ind, force = false){
        // Selection must take place once rendered, otherwise end and start indices used for verification will return -1
        if ((ind <= this.state.endIndex && ind >= this.state.startIndex)|| force){
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
        // console.log(`Attempting to set start index to ${newStartIndex}`)
        this.setStartIndex(newStartIndex)
        this.setEndIndex(newEndIndex)
        if (newStartIndex < 0) {
            this.setState({cols:newEndIndex})
        }
        return newEndIndex
    }

    next() {
        if (this.state.cols != this.state.defaultCols) {
            this.setState({cols: this.state.defaultCols})
        }
        if (this.state.startIndex == 0) {
            // When start index is 0 (cannot go below 0) draw remainder of the images on the screen. 
            var newStartIndex = this.props.imageRibbon.length%this.state.defaultCols
        }
        else if (this.state.startIndex > 0) {
            var newStartIndex = this.state.startIndex + this.state.defaultCols
        }
        var newEndIndex = newStartIndex + this.state.defaultCols
        this.setStartIndex(newStartIndex)
        this.setEndIndex(newEndIndex)
        return newEndIndex
    }

    render(){
        const { parentCallback, classes } = this.props;
        return(
            <div>
                <Card className={classes.sliderCard} xs={10}>
                    <Slider className={classes.slider}
                            defaultValue={1000}
                            // getAriaValueText={valuetext}
                            aria-labelledby="discrete-slider-custom"
                            step={1}
                            min={0}
                            max={this.props.imageRibbon.length-1}
                            value={this.state.currentIndex}
                            onChange={this.selectSlider}
                    />
                </Card>
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
                                            onClick = {this.selectMouse}>
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

            </div>
        )
    }
}

export default withStyles(styles)(ImageRibbon);