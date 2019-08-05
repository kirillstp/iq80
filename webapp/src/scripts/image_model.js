var images = (function(){

    var imageBase = function(arg) {
        // Generic image object
        var that = {};

        that.getName = function() {
            return arg.name;
        }
        that.getDate = function() {
            return arg.date;
        }
        return that;
    }
    return {
        currentImage: function(arg) {
            arg.name = (arg.name === undefined)?"current_image":arg.name;
            var that = imageBase(arg);
            that.setImage = function (path) {
                if (path === undefined) {
                    return -1;
                }
                that.path = path;
                return 0;
            };
            that.getImage = function(path) {
                return that.path;
            }
            return that;
        },
        imageRibbon: function(arg) {
            arg.name =  (arg.name === undefined)?"image_ribbon":arg.name;
            var that = imageBase(arg)
            var imageList = [];
            that.addImage = function(path) {
                // 1000 is hardcoded in settings. To Do: let it be configurable
                if (imageList.length > 1000) {
                    imageList.shift()
                }
                if (!imageList.includes(path)){
                    imageList.push(path)
                }
            }
            that.removeImage = function(path) {
                var ind = imageList.findIndex(function(path) { return path })
                if (ind > 0){ 
                    delete imageList[ind]
                }
            }
            that.setList = function(list) {
                if (typeof list.push === undefined ) {
                    return -1
                }
                else {
                    imageList = [];
                    for (var path in list) {
                        that.addImage(path);
                    }
                }
            }
            that.getList = function(list) {
                return imageList;
            }
            return that;
        }
    }
})();

export { images }