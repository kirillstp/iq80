import React, { Component } from "react";
import "../../App.css";
// MUI
import { withStyles, withTheme, Button } from "@material-ui/core";
import Card from '@material-ui/core/Card'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid'
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";


const styles = {
    root: {
    },
    dialogContent: {
        display: 'flex',
        justifyContent: 'center',
		alignItems: 'center',
    },
    inputItem: {
        margin: 10,
    },
    dialogTooltip: {}
}

const theme = createMuiTheme({
    overrides: {
      MuiTooltip: {
        tooltip: {
          fontSize: "16",
        }
      }
    }
  });

const minNumBgnImagesTooltip =
    `Minimum number of raw images before running subtraction algorithm. Images are collected
    half a second apart. Default value is 5 images. Recommended range is 5 - 10 images.`

const contourQualityThTooltip =
    `Number of contours detected on the subtracted image. Images with less contours show strongest motion.
    Images with large number of contours detect camera exposure differences. Default value is 50. Recommended range is 20 to 75.`

const minContourAreaTooltip = 
    `Minimum contour area to highlight on the image. Setting depends on camera resolution. 
    Default value is 500 for 640x480 image.`

const gaussFilterWidthTooltip = 
    `Width of gaussian filter to apply to the image before processing. Higher values will reduce camera exposure differences.
    Lower values will result in finer motion detection. Default value is 5. Recommended range is 2 to 10.`

class HelpTooltip extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { classes } = this.props;
        return(
            <MuiThemeProvider theme={theme}>
                <Tooltip title = {this.props.title}>
                    <HelpIcon></HelpIcon>
                </Tooltip>
            </MuiThemeProvider>
        )

    }
}
class SettingsDialog extends Component {
    // There are two sets of settings: 
    //   1- state in the controller with saved values 
    //   2- local state for this component
    // This component can only modify state 1 through callback from parent.   
    constructor(props) {
        super(props);
        this.state = {
            minNumBgnImages: 0,
            contourQualityTh: 0,
            minContourArea: 0,
            gaussFilterWidth: 0,
            settingsSet: false
        };
        this.handleMinNumBgnImages = this.handleMinNumBgnImages.bind(this);
        this.handleContourQualityTh = this.handleContourQualityTh.bind(this);
        this.handleMinContourArea = this.handleMinContourArea.bind(this);
        this.handleGaussFilterWidth = this.handleGaussFilterWidth.bind(this);
        this.applySettings = this.applySettings.bind(this);
        this.getSettings = this.getSettings.bind(this);
    }
    handleMinNumBgnImages(event){
        this.setState({ minNumBgnImages: event.target.value})
    }
    handleContourQualityTh(event){
        this.setState({ contourQualityTh: event.target.value})
    }
    handleMinContourArea(event){
        this.setState({ minContourArea: event.target.value})
    }
    handleGaussFilterWidth(event){
        this.setState({ gaussFilterWidth: event.target.value})
    }
    applySettings(){
        var values = {'min_raw_images': this.state.minNumBgnImages,
                      'quality_threshold':this.state.contourQualityTh,
                      'min_contour_area': this.state.minContourArea,
                      'gaussian_filter_area':this.state.gaussFilterWidth};
        this.props.applySettingsCallback(values);
        this.props.closeSettingsDialog()
    }

    getSettings(){
        var result = this.props.getSettingsCallback();  
        if (typeof(result) == 'object') {
            this.setState({ minNumBgnImages: result['min_raw_images'],
                            contourQualityTh: result['quality_threshold'],
                            minContourArea: result['min_contour_area'],
                            gaussFilterWidth:  result['gaussian_filter_area'],
                            settingsSet: true
                        })
        }
        else if (result == false) {

        }
    }
    componentDidUpdate(){
        // Keep trying to get settings until succeded
        if (!this.state.settingsSet) {
            this.getSettings();
        }
    }
    render(){
        const { classes } = this.props;
        return(
            <Dialog onClose={this.props.closeSettingsDialog}
                    open={this.props.openSettingsDialog}>
                <DialogTitle id="simple-dialog-title" onClose={this.handleClose}>
                    Motion Detection Settings
                </DialogTitle>
                
                <DialogContent>
                    <Grid className={classes.dialogContent} 
                          item xs={12} sm container>
                        <HelpTooltip title = {minNumBgnImagesTooltip}></HelpTooltip>
                        <TextField  id="standard-number"
                                    label="Minimum # of Bgn Images"
                                    value={this.state.minNumBgnImages}
                                    onChange={this.handleMinNumBgnImages}
                                    type="number"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    className={classes.inputItem}/>
                        <HelpTooltip title = {contourQualityThTooltip}></HelpTooltip>
                        <TextField  id="standard-number"
                                    label="Contour Quality Threshold"
                                    value={this.state.contourQualityTh}
                                    onChange={this.handleContourQualityTh}
                                    type="number"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    className={classes.inputItem}/>
                    </Grid>
                    <Grid className={classes.dialogContent} 
                          item xs={12} sm container>
                        <HelpTooltip title = {minContourAreaTooltip}></HelpTooltip>
                        <TextField  id="standard-number"
                                    label="Minimum Area to Highlight"
                                    value={this.state.minContourArea}
                                    onChange={this.handleMinContourArea}
                                    type="number"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    className={classes.inputItem}/>
                        <HelpTooltip title = {gaussFilterWidthTooltip}></HelpTooltip>
                        <TextField  id="standard-number"
                                    label="Gaussian Filter Width"
                                    value={this.state.gaussFilterWidth}
                                    onChange={this.handleGaussFilterWidth}
                                    type="number"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    className={classes.inputItem}/>
                    </Grid>
                    <div>
                        Do not input anything crazy. If I was paid for this I would validate my forms.
                    </div>
                </DialogContent>
                <DialogActions>
                <Button color="primary" 
                        variant="contained"
                        onClick = {this.applySettings}>
                        Apply
                    </Button>
                    <Button onClick = {this.props.closeSettingsDialog}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}



export default withStyles(styles)(SettingsDialog);
