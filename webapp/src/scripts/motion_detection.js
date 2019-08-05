import { images } from './image_model.js';
import { utils } from './utils.js';

var firstRun = true;




var MotionDetectionCtrlr = (function() {
        // var heartbeat = setInterval(tick, 1500);
        var currentImage= images.currentImage({name:"current_proc_image"});
        var imageRibbon = images.imageRibbon({name:"proc_image_ribbon"});
        var algorithmSettings = false;
        var updated = false;
        var active = false;

        return {
            active,
            updated,
            algorithmSettings,

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
                    self.updated = JSON.parse(response)['updated']
                    currentImage.setImage(procImgList[procImgList.length - 1])
                }
                utils.httpGetAsync(url, callback);
            },

            updateImagesDev: function(context) {
                for (var key in context.keys()){
                    imageRibbon.addImage(context(context.keys()[key]));
                }
                currentImage.setImage(context(context.keys()[context.keys().length - 1]))
            },
            
            useUpdatedFlag: function() {
                self.updated = false
            },

            tick: function() {
                var url = '/motion_detection/tick';
                self = this;
                var callback = function(response){
                    self.updateImages();
                    self.active = JSON.parse(response)['status']
                    if (self.firstRun) {
                        getSettings();
                        self.firstRun = false;
                        self.updated = false;
                    }
                }
                utils.httpGetAsync(url, callback);
            },

            start: function () {
                var url = '/motion_detection/start_algorithm'
                self.active = true;
                var callback = function(response){}
                utils.httpGetAsync(url, callback);
            },
    
            stop: function() {
                var url = '/motion_detection/stop_algorithm'
                active = false;
                var callback = function(response){}
                utils.httpGetAsync(url, callback);
            },
    
            applySettings: function(settings) {
                for (var setting of ['min_raw_images', 'quality_threshold',
                                     'min_contour_area', 'gaussian_filter_area']) {
                    if (Object.keys(settings).indexOf(setting) < 0){
                        return -1
                    }
                }
                self = this;
                var url = '/motion_detection/set_settings'
                url += '?data='+JSON.stringify(settings);
                var callback = function(response){
                    self.getSettingsFromServer();
                }
                utils.httpGetAsync(url, callback);
            },


            getSettings: function() {
                if (this.algorithmSettings == false) {
                    this.getSettingsFromServer();
                    return false
                }
                else {
                    return this.algorithmSettings
                }
            },

            getSettingsFromServer: function() {
                var url = '/motion_detection/get_settings';
                this.algorithmSettings = {'min_raw_images': 0, 
                                'quality_threshold': 0, 
                                'min_contour_area': 0,
                                'gaussian_filter_area': 0}
                self = this;
                var callback = function(response){
                    var data = JSON.parse(JSON.parse(response)['data']);
                    for (var key of Object.keys(data)) {
                        if (self.algorithmSettings.hasOwnProperty(key)){
                            self.algorithmSettings[key] = data[key];
                        }
                        else {
                            return -1
                        }
                    }
                }
                utils.httpGetAsync(url, callback);

            },

            getSettingsDev: function() {
                var defaults = {'min_raw_images': 5, 
                                'quality_threshold': 50, 
                                'min_contour_area': 500,
                                'gaussian_filter_area': 5}
                return defaults
            },
        }
    }
)();

export { MotionDetectionCtrlr }