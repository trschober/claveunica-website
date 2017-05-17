'use strict';

function HttpInterceptor($cookies) {
    'ngInject';

    this.request = function (config) {
        // if (config.url.indexOf('claveunica') !== - 1) {
            config.withCredentials = true;
            // config.headers['X-CSRFToken'] = $cookies.get('csrftoken');
            // config.headers['X-Xsrftoken'] = $cookies.get('_xsrf');
        // }
        if( localStorage.getItem('token') != null ){
          config.headers['token'] = localStorage.getItem('token');
        }
        if( localStorage.getItem('session') != null ){
          config.headers['session'] = localStorage.getItem('session');
        }

        return config;
    };
}

angular
    .module('claveunica')
    .service('HttpInterceptor', HttpInterceptor)
;
