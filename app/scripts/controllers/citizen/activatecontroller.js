'use strict';
 
function ActivateController($scope, $state, Api, Messages, session) {
    'ngInject';

    $scope.user = {};

    angular.element(document).ready(function () {
        $("#activation_code").bind('keyup', function (e) {
          if (e.which >= 97 && e.which <= 122) {
              var newKey = e.which - 32;
              // I have tried setting those
              e.keyCode = newKey;
              e.charCode = newKey;
          }

          $("#activation_code").val(($("#activation_code").val()).toUpperCase());
        });
    });
    
    $scope.logged = false;
    session.getUser().then(function (data) {
        $scope.logged = true; 
    });

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
