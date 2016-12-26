'use strict';

function SiteHeaderController(session, $state, $storage) {
    'ngInject';

    this.user = null;

    this.initialize = function () {
        return session.check().then(function (user) {
            this.user = user;

            var redirect;
            if (redirect = $storage.get('redirect-to')) {
                $storage.del('redirect-to');
                $state.go(redirect);
            }
        }.bind(this));
    };

    this.isState = function (state) {
        return state === $state.$current.name;
    };

    this.isCitizen = function () {
        return /^citizen/.test($state.$current.name);
    };

    this.isInstitutional = function () {
        return /^institutional/.test($state.$current.name);
    };

    this.hideCitizenMenu = function () {
        return this.user || this.isState('citizen.home') || this.isInstitutional();
    };

    this.hideInstitutionMenu = function () {
        return this.isCitizen();
    };

    this.goHome = function () {
        if (this.isInstitutional()) {
            $state.go('institutional.home');
        }

        if (this.isCitizen()) {
            $state.go('citizen.home');
        }
    };

    this.initialize();
}

angular
    .module('claveunica')
    .component('siteHeader', {
        templateUrl: 'views/header.html',
        controller: SiteHeaderController
    })
;