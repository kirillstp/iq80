
var utils = (function() {
    return {
        httpGetAsync: function(url, callback) {
            var xmlHttp = new XMLHttpRequest();
            // console.log(url)
            url = 'http://192.168.1.24'+url
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    callback(xmlHttp.response)
                }
            }
            xmlHttp.open("GET", url, true)
            xmlHttp.send(null)
        }
    }
})();

export { utils }