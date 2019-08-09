
var utils = (function() {
    return {
        httpGetAsync: function(url, callback) {
            var xmlHttp = new XMLHttpRequest();
            // console.log(url)
            url = 'http://iq80.gq'+url
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    callback(xmlHttp.response)
                }
            }
            xmlHttp.open("GET", url, true)
            xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
            xmlHttp.send(null)
        }
    }
})();

export { utils }