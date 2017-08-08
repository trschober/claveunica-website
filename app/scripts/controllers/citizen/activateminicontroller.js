'use strict';

function ActivateminiController($scope, $state, Api) {
    'ngInject';

    $scope.user = {};

    $scope.activate = function () {
      return Api.activateUser($scope.user)
        .then(function (info) {
            if( info.token != null ){
                localStorage.setItem('token', info.token);
                $state.go('citizen.activation_mini.configmini', {
                    data: angular.extend(info.object, $scope.user)
                })
            }else{
                $scope.message = Messages.response(info.code);
            }
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
    .controller('ActivateminiController', ActivateminiController)
;
