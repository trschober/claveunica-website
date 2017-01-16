'use strict';

angular.module('claveunica', [
    'LocalStorageModule',
    'angularPromiseButtons',
    'angularUtils.directives.dirPagination',
    'base64',
    'elif',
    'ngIntlTelInput',
    'ngCookies',
    'ngGeolocation',
    'ngMessages',
    'ngPageTitle',
    'ngSanitize',
    'nvd3',
    'router-citizen',
    'router-institutional',
    'satellizer',
    'ui.bootstrap',
    'ui.bootstrap.showErrors',
    'ui.mask',
    'uiGmapgoogle-maps',
    'vcRecaptcha'
])
.config(function (
    $urlRouterProvider,
    $httpProvider,
    $locationProvider,
    vcRecaptchaServiceProvider,
    localStorageServiceProvider,
    uiGmapGoogleMapApiProvider,
    $authProvider,
    ngIntlTelInputProvider
) {
    'ngInject';

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    ngIntlTelInputProvider.set({
        preferredCountries: ['cl'],
        initialCountry: 'cl'
    });

    $urlRouterProvider.otherwise('/');
    localStorageServiceProvider.setPrefix('claveunica');
    $httpProvider.interceptors.push('HttpInterceptor');

    vcRecaptchaServiceProvider.setDefaults({
        key: angular.element('meta[name=recaptcha-key]').attr('content')
    });

    uiGmapGoogleMapApiProvider.configure({
        key: angular.element('meta[name=gmaps-key]').attr('content'),
        v: '3.exp'
    });

    var authEndpoint = angular.element('meta[name=api-endpoint]');

    $authProvider.oauth2({
        name: 'claveunica',
        url: '/auth/claveunica',
        clientId: '123',
        redirectUri: window.encodeURIComponent(window.location.origin),
        authorizationEndpoint: _.trimEnd(authEndpoint.attr('content'), '/'),
        scope: ['openid', 'run'],
        scopeDelimiter: ' ',
        responseType: 'code',
        state: function () {
            return (Date.now() + Math.random()).replace('.', '');
        },
        defaultUrlParams: ['scope', 'client_id', 'redirect_uri', 'state', 'response_type']
    });
})
.filter("formatPrice", function() {
  return function(price, digits, thoSeperator, decSeperator, bdisplayprice) {
    var i;
    // digits = (typeof digits === "undefined") ? 2 : digits;
    digits = (typeof digits === "undefined") ? 0 : digits;
    bdisplayprice = (typeof bdisplayprice === "undefined") ? true : bdisplayprice;
    thoSeperator = (typeof thoSeperator === "undefined") ? "." : thoSeperator;
    // decSeperator = (typeof decSeperator === "undefined") ? "," : decSeperator;
    decSeperator = (typeof decSeperator === "undefined") ? "" : decSeperator;
    price = price.toString();
    var _temp = price.split(".");
    // var dig = (typeof _temp[1] === "undefined") ? "00" : _temp[1];
    var dig = (typeof _temp[1] === "undefined") ? "" : _temp[1];
    if (bdisplayprice && parseInt(dig,10)===0) {
        // dig = "-";
    } else {
        dig = dig.toString();
        if (dig.length > digits) {
            dig = (Math.round(parseFloat("0." + dig) * Math.pow(10, digits))).toString();
        }
        for (i = dig.length; i < digits; i++) {
            dig += "0";
        }
    }
    var num = _temp[0];
    var s = "",
        ii = 0;
    for (i = num.length - 1; i > -1; i--) {
        s = ((ii++ % 3 === 2) ? ((i > 0) ? thoSeperator : "") : "") + num.substr(i, 1) + s;
    }
    return s + decSeperator + dig;
}
})
.run(function ($rootScope, $state, $stateParams, session) {
    'ngInject';

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$session = session;
});
