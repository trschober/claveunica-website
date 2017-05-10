'use strict';

function UserButtonController(session, $scope) {
    'ngInject';

    this.fullName = '';
    this.user = null;
    this.loggedIn = false;

    this.getUserData = function () {
        var n = this.user.object.name.nombres;
        var l = this.user.object.name.apellidos;

        this.fullName = [n[0], n[1], l[0], l[1]].join(' ');
    };

    this.logout = function () {
        this.user = null;
        session.logout();
    };

    this.login = function (redirect) {
        session.login(redirect);
    };

    $scope.$watch(function () {
        return this.user;
    }.bind(this), function (newVal, oldVal) {
        if (!newVal) return;

        this.getUserData();
        this.loggedIn = true;
    }.bind(this))

}

angular.module('claveunica').component('userButton', {
    bindings: {
        isMobile: '<',
        user: '='
    },
    templateUrl: 'views/components/user-button.html',
    controller: UserButtonController
});