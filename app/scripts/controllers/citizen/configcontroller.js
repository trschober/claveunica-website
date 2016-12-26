'use strict';

function ConfigController($scope, $stateParams, Api) {
  'ngInject';

  $scope.result = null;
  $scope.data = $stateParams.data;

  $scope.modifyData = function (profile, fullname) {
    return Api.createUser($scope.data.numero, profile)
      .then(function () {
        $scope.result = 'success';
        $scope.profile = profile;
        $scope.fullname = fullname;
      })
      .catch(function () {
        $scope.result = 'error';
      })
    ;
  };
}

angular
  .module('claveunica')
  .controller('ConfigController', ConfigController)
;
