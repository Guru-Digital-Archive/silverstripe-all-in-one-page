/**
 * Thanks to https://gist.github.com/irazasyed/6252033
 */
/* exported HashSearch */
var HashSearch = new _hashSearch();
function _hashSearch() {
    var params;

    this.set = function (key, value) {
        params[key] = value;
        this.push();
    };

    this.remove = function (key) {
        delete params[key];
        this.push();
    };


    this.get = function (key) {
        return params[key];
    };

    this.keyExists = function (key) {
        return params.hasOwnProperty(key);
    };

    this.push = function () {
        var hashBuilder = [], key, value;

        for (key in params) {
            if (params.hasOwnProperty(key)) {
                key = escape(key), value = escape(params[key]); // escape(undefined) == "undefined"
                hashBuilder.push(key + ((value !== "undefined") ? "=" + value : ""));
            }
        }
        window.location.hash = hashBuilder.join("&");
    };

    this.load = function () {
        params = {};
        var hashStr = window.location.hash, hashArray, keyVal, i;
        hashStr = hashStr.substring(1, hashStr.length);
        hashArray = hashStr.split("&");

        for (i = 0; i < hashArray.length; i++) {
            keyVal = hashArray[i].split("=");
            params[unescape(keyVal[0])] = (typeof keyVal[1] !== "undefined") ? unescape(keyVal[1]) : keyVal[1];
        }
    };
    this.load();
}