import { images } from './image_model.js';
import { utils } from './utils.js';

var firstRun = true;




var MotionDetectionCtrlr = (function() {
        // var heartbeat = setInterval(tick, 1500);
        var currentImage= images.currentImage({name:"current_proc_image"});
        var imageRibbon = images.imageRibbon({name:"proc_image_ribbon"});
        var updated = false

        return {
            // getSettings: function() {
            //     var url = '/motion_detection/get_settings';
            //     var callback = function(response){
            //         var data = JSON.parse(JSON.parse(response)['data']);
            //         for (var key in Object.keys(data)) {
            //             var p_name = Object.keys(data)[key];
            //         }
            //     }
            //     utils.httpGetAsync(url, callback);
            // },
            updated,
            setCurrentImageObject: function(path) {
                currentImage.setImage(path);
            },

            setImageRibbonObject: function(obj) {
                imageRibbon = obj;
            },
            getCurrentImageObject: function(obj) {
                return currentImage
            }, 
            getImageRibbonObject: function(obj) {
                return imageRibbon
            }, 

            updateImages: function() {
                var url = '/motion_detection/update_images';
                var callback = function(response){
                    var procImgList = JSON.parse(response)['data']['current_proc_images']
                    for (var file in procImgList) {
                        imageRibbon.addImage(procImgList[file]);
                    }
                    currentImage.setImage(procImgList[procImgList.length - 1])
                    // myCurrentThrshImage.setImage(JSON.parse(response)['data']['current_thrsh_image'])
                    // myCurrentRawImage.setImage(JSON.parse(response)['data']['current_raw_image'])
                }
                utils.httpGetAsync(url, callback);
            },

            updateImagesDev: function(context) {
                for (var key in context.keys()){
                    imageRibbon.addImage(context(context.keys()[key]));
                }
                currentImage.setImage(context(context.keys()[context.keys().length - 1]))
            },


            tick: function() {
                var url = '/motion_detection/tick';
                self = this;
                var callback = function(response){
                    updateImages();
                    if (self.firstRun) {
                        getSettings();
                        self.firstRun = false;
                        self.updated = false;
                    }
                }
                utils.httpGetAsync(url, callback);
            },

            start: function() {
                window.setInterval(this.tick, 1500)
            },

            onStartButton: function () {
                var url = '/motion_detection/start_algorithm'
                var callback = function(response){}
                utils.httpGetAsync(url, callback);
            },
    
            onStopButton: function() {
                var url = '/motion_detection/stop_algorithm'
                var callback = function(response){}
                utils.httpGetAsync(url, callback);
            },
    
            onSettingsApplyButton: function() {
                var url = '/motion_detection/set_settings'
                var settings = {'min_raw_images': 0, 
                                'quality _threshold': 0, 
                                'min_contour_area': 0,
                                'gaussian_filter_area': 0}
                for (var param in Object.keys(settings)) {
                    var p_name = Object.keys(settings)[param];
                    // settings[p_name] = document.getElementById(p_name).value;
                }
                url += '?data='+JSON.stringify(settings);
                var callback = function(response){}
                utils.httpGetAsync(url, callback);
            },
        }
    }
)();

export { MotionDetectionCtrlr }