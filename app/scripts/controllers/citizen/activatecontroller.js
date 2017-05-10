'use strict';

function ActivateController($scope, $state, Api) {
    'ngInject';

    $scope.user = {};

    $scope.activate = function () {
      return Api.activateUser($scope.user)
        .then(function (info) {
            localStorage.setItem('token', info.token);
            $state.go('citizen.activation.config', {
                data: angular.extend(info.object, $scope.user)
            })
        })
        .catch(function (response) {
            $scope.apiError = response.status;
            $scope.message = response.data ? (response.data.error || response.data.message)
              : 'Ha ocurrido un error. Por favor intente nuevamente';
        });
    };
}

angular
    .module('claveunica')
    .controller('ActivateController', ActivateController)
;
