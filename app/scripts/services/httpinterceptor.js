'use strict';

function HttpInterceptor($cookies) {
    'ngInject';

    this.request = function (config) {
        console.log("=>"+config.url+"<=");
        if (config.url.indexOf('https://apis.digital.gob.cl/misc/instituciones') > -1) {
            return config;
        } else {
            config.withCredentials = true;
            if( localStorage.getItem('token') != null ){
              config.headers['token'] = localStorage.getItem('token');
            }
            if( localStorage.getItem('session') != null ){
              config.headers['session'] = localStorage.getItem('session');
            }
            return config;
        }
    };
}
 
angular
    .module('claveunica')
    .service('HttpInterceptor', HttpInterceptor)
;
