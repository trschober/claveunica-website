'use strict';

function storage(localStorageService) {
    'ngInject';

    var set = function (key, value) {
        localStorageService.set(key, value);
        return value;
    };

    var get = function (key) {
        return localStorageService.get(key);
    };

    var del = function (key) {
        localStorageService.remove(key);
    };

    var clear = function () {
        localStorageService.clearAll();
    };

    return {
        set: set,
        get: get,
        del: del,
        clear: clear
    };
}

angular
    .module('claveunica')
    .service('$storage', storage)
;
