'use strict';

function HttpInterceptor($cookies) {
    'ngInject';

    this.request = function (config) {
        if (config.url.indexOf('claveunica') !== - 1) {
            config.withCredentials = true;
            config.headers['X-CSRFToken'] = $cookies.get('csrftoken');
            config.headers['X-Xsrftoken'] = $cookies.get('_xsrf');
        }

        return config;
    };
}

angular
    .module('claveunica')
    .service('HttpInterceptor', HttpInterceptor)
;
