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
.run(function ($rootScope, $state, $stateParams, session) {
    'ngInject';

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$session = session;
});
