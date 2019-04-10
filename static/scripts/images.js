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
                var img = document.getElementById(arg.name);
                img.setAttribute('src', path)
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
            var imgRibbon = document.getElementById(arg.name);
            that.addImage = function(path) {
                if (imageList.includes(path)){
                    return 0
                }
                else {
                    imageList.push(path)
                    var newImg = document.createElement("img");
                    newImg.setAttribute("src", path);
                    newImg.setAttribute("id", path);
                    newImg.setAttribute("class", "imageribbon--item")
                    imgRibbon.appendChild(newImg);
                }
            }
            that.removeImage = function(path) {
                var ind = imageList.findIndex(function(path) { return path })
                if (ind > 0){ 
                    delete imageList[ind]
                    var el = document.getElementById(path);
                    imgRibbon.removeChild(el)
                    return 0
                }
                return -1
            }
            that.setList = function(list) {
                if (typeof list.push === undefined ) {
                    return -1
                }
                else {
                    imageList = [];
                    while (imgRibbon.firstChild) {
                        imgRibbon.removeChild(imgRibbon.firstChild);
                    }
                    for (var path in list) {
                        that.addImage(path);
                    }
                }
            }
            return that;
        }
    }
})();

export { images }