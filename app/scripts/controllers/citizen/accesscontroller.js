'use strict';

function AccessController($scope, $state, Api, $http, session) {
    'ngInject';

    $scope.user = {};

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
