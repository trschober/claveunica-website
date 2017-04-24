'use strict';

function AccessController($scope, $state, Api) {
    'ngInject';

    $scope.user = {};

    $scope.accessUser = function (user) {
        console.log(user);
        console.log("2 RUN => "+user.run);
        console.log("2 PASS => "+user.password);

      // return Api.activateUser($scope.user)
      //   .then(function (info) {
      //       $state.go('citizen.activation_mini.configmini', {
      //           data: angular.extend(info, $scope.user)
      //       })
      //   })
      //   .catch(function (response) {
      //       $scope.apiError = response.status;
      //       $scope.message = response.data ? (response.data.error || response.data.message)
      //         : 'Ha ocurrido un error. Por favor intente nuevamente';
      //   });
    };

}

angular
    .module('claveunica')
    .controller('AccessController', AccessController)
;
