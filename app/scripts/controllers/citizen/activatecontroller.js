'use strict';

function ActivateController($scope, $state, Api, Messages) {
    'ngInject';

    $scope.user = {};

    $scope.activate = function () {
      return Api.activateUser($scope.user)
        .then(function (info) {
            if( info.token != null ){
                localStorage.setItem('token', info.token);
                $state.go('citizen.activation.config', {
                    data: angular.extend(info.object, $scope.user)
                })
            }else{
                $scope.message = Messages.response(info.code);
            }
        })
        .catch(function (response) {
            $scope.message = Messages.response(0);
        });
    };
}

angular
    .module('claveunica')
    .controller('ActivateController', ActivateController)
;
