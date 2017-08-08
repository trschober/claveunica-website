'use strict';

function UserLoginFormController($scope, $base64) {
    'ngInject';

    // this.fullName = null;
    // this.password = '';
    // this.showPassword = [false, false];
    // this.allowInvalid = true;

    // this.getFullName = function(user) {
    //     if (!user) {
    //         return;
    //     }

    //     var n = user.name.nombres;
    //     var l = user.name.apellidos;

    //     return this.fullName = [n[0], n[1], l[0], l[1]].join(' ');
    // };

    // this.togglePassword = function (i) {
    //     this.showPassword[i] = !this.showPassword[i];
    // };

    // this.pswdInvalidChars = function () {
    //     return _.uniq(this.password.split('').filter(function (c) {
    //         return !/[a-zA-Z0-9-!@#$%^&*()_[\]{},.<>+=]/.test(c);
    //     })).join(',').replace(' ', '[espacio]');
    // };

    this.save = function (data) {
        var user = {};

        return this.onSave({
            user: data/*,
            fullname: this.fullName*/
        });
    };

    // $scope.$watch('$ctrl.data', function (newval) {
    //     if (!newval) return;

    //     this.email = newval.email;
    //     this.email_confirm = newval.email;

    //     if (newval['phone']) {
    //         this.phone = newval.phone.number;
    //         this.code = newval.phone.code;
    //         this.phone_confirm = newval.phone.number;
    //         this.code_confirm = newval.phone.code;
    //     } else {
    //         this.phone = null;
    //         this.phone_confirm = null;
    //         this.code = '+56';
    //         this.code_confirm = '+56';
    //     }
    // }.bind(this));
}

angular
    .module('claveunica')
    .component('userLoginForm', {
        bindings: {
            data: '<',
            onSave: '&'
        },
        templateUrl: 'views/components/user-login-form.html',
        controller: UserLoginFormController
    })
;

