'use strict';

function AccessController($scope, $state, Api, $http, session, Messages) {
    'ngInject';

    $scope.user = {};

    console.log( Messages.response(1));

    $scope.accessUser = function (user) { 
        return Api.authenticateUser(user.run, user.password)
            .then(function (info){   
                /* create user */
                localStorage.setItem('token', info.token);
                $state.go('citizen.profile');
            })
            .catch(function (response) {
                $scope.message = response.data ? (response.data.error || response.data.message) : 'Ha ocurrido un error. Por favor intente nuevamente';
            });
    };

    if( localStorage.getItem('token') != null ){
        $state.go('citizen.profile');
    }
}

angular
    .module('claveunica')
    .controller('AccessController', AccessController)
;
