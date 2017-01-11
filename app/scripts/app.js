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
.filter('megaNumber', function () {
    return function (number, fractionSize) {

        if(number === null) return null;
        if(number === 0) return "0";

        if(!fractionSize || fractionSize < 0)
            fractionSize = 1;

        var abs = Math.abs(number);
        var rounder = Math.pow(10,fractionSize);
        var isNegative = number < 0;
        var key = '';
        var powers = [
            {key: "Q", value: Math.pow(10,15)},
            {key: "T", value: Math.pow(10,12)},
            {key: "B", value: Math.pow(10,9)},
            {key: "M", value: Math.pow(10,6)},
            {key: "K", value: 1000}
        ];

        for(var i = 0; i < powers.length; i++) {

            var reduced = abs / powers[i].value;

            reduced = Math.round(reduced * rounder) / rounder;

            if(reduced >= 1){
                abs = reduced;
                key = powers[i].key;
                break;
            }
        }

        return (isNegative ? '-' : '') + abs + key;
    };
})
.run(function ($rootScope, $state, $stateParams, session) {
    'ngInject';

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$session = session;
});
