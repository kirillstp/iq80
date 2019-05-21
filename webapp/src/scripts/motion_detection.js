import { images } from './images.js';
import { utils } from './utils.js';

var firstRun = true;

var myCurrentRawImage = images.currentImage({name:"current_raw_image"});
var myCurrentThrshImage = images.currentImage({name:"current_thrsh_image"});
var myCurrentProcImage = images.currentImage({name:"current_proc_image"});
var myProcImageRibbon = images.imageRibbon({name:"proc_image_ribbon"});

function tick() {
    var url = '/motion_detection/tick';
    var callback = function(response){
        updateImages();
        if (firstRun) {
            getSettings();
            firstRun = false;
        }
    }
    utils.httpGetAsync(url, callback);
}

function getSettings() {
    var url = '/motion_detection/get_settings';
    var callback = function(response){
        var data = JSON.parse(JSON.parse(response)['data']);
        for (var key in Object.keys(data)) {
            var p_name = Object.keys(data)[key];
            document.getElementById(p_name).value = data[p_name];
        }
    }
    utils.httpGetAsync(url, callback);
}

function updateImages() {
    var url = '/motion_detection/update_images';
    var callback = function(response){
        var procImgList = JSON.parse(response)['data']['current_proc_images']
        // for (var file in procImgList) {
        //     myProcImageRibbon.addImage(procImgList[file]);
        // }
        myCurrentProcImage.setImage(procImgList[procImgList.length - 1])
        myCurrentThrshImage.setImage(JSON.parse(response)['data']['current_thrsh_image'])
        myCurrentRawImage.setImage(JSON.parse(response)['data']['current_raw_image'])
    }
    utils.httpGetAsync(url, callback);
}

(function() {
    var heartbeat = setInterval(tick, 500);
    var start_button = document.getElementById('start_md');
    start_button.addEventListener('click', 
        function() {
            var url = '/motion_detection/start_algorithm'
            var callback = function(response){}
            utils.httpGetAsync(url, callback);
        }
    )
    var stop_button = document.getElementById('stop_md');
    stop_button.addEventListener('click', 
        function() {
            var url = '/motion_detection/stop_algorithm'
            var callback = function(response){}
            utils.httpGetAsync(url, callback);
        }
    )

    var apply_button = document.getElementById('apply');
    apply_button.addEventListener('click', 
        function() {
            var url = '/motion_detection/set_settings'
            var settings = {'min_raw_images': 0, 
                            'quality_threshold': 0, 
                            'min_contour_area': 0,
                            'gaussian_filter_area': 0}
            for (var param in Object.keys(settings)) {
                var p_name = Object.keys(settings)[param];
                settings[p_name] = document.getElementById(p_name).value;
            }
            url += '?data='+JSON.stringify(settings);
            var callback = function(response){}
            utils.httpGetAsync(url, callback);
        }
    )

    // var download_raw_button = document.getElementById('download_raw');
    // download_raw_button.addEventListener('click',
    //     function() {
    //         var url = '/motion_detection/download_raw_images';
    //         var callback = function(response) {
    //             var zipUrl = JSON.parse(response)['data'];
    //             window.open(zipUrl);
    //         }
    //         utils.httpGetAsync(url, callback);
    //     }
    // )
    // var download_proc_button = document.getElementById('download_proc');
    // download_proc_button.addEventListener('click',
    //     function() {
    //         var url = '/motion_detection/download_proc_images';
    //         var callback = function(response) {
    //             var zipUrl = JSON.parse(response)['data'];
    //             window.open(zipUrl);
    //         }
    //         utils.httpGetAsync(url, callback);
    //     }
    // )
})();