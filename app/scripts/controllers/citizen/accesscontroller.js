'use strict';

function AccessController($scope, $state, Api, $http) {
    'ngInject';

    $scope.user = {};

    $scope.accessUser = function (user) {
        return Api.authenticateUser(user.run, user.password)
            .then(function (info){     
                /* create user */
                $state.go('citizen.profile');
            })
            .catch(function (response) {
                $scope.apiError = response.status;
                // $scope.message = response.data ? (response.data.error || response.data.message)
                $scope.message = response ? (response.error || response.message)
                    : 'Ha ocurrido un error. Por favor intente nuevamente';
            });
    };

}

angular
    .module('claveunica')
    .controller('AccessController', AccessController)
;
