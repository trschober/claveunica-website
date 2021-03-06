'use strict';

function ConfigminiController($scope, $stateParams, Api) {
  'ngInject';

  $scope.result = null;
  $scope.data = $stateParams.data;

  $scope.modifyData = function (profile, fullname) {
    return Api.createUser($scope.data.numero, profile)
      .then(function () {
        $scope.result = 'success';
        $scope.profile = profile;
        $scope.fullname = fullname;
        localStorage.removeItem('token');
      })
      .catch(function () {
        $scope.result = 'error';
      })
    ;
  };
}

angular
  .module('claveunica')
  .controller('ConfigminiController', ConfigminiController)
;
