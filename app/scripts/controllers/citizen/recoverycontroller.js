'use strict';

var app = angular.module('claveunica');

app.controller('RecoveryController', function ($scope, Api) {
  'ngInject';

  $scope.humanOk = false;
  $scope.methods = [];

  $scope.sendRecovery = function (method) {
    return Api.sendRecovery($scope.run, method)
      .then(function (response) {
        $scope.recoveryOk = true;
        $scope.recoveryMethod = method;
        $scope.apiError = response.status;
        $scope.message = response.data.message;
        /* eliminar token de recuperacion */
        localStorage.removeItem('token');
      })
      .catch(function (error) {
        $scope.recoveryOk = false;
        $scope.apiError = error.status;
        $scope.message = error.data.error;
      })
    ;
  };

  $scope.isHuman = function () {
    $scope.humanOk = true;
    $scope.loadMethods($scope.run);
  };

  $scope.loadMethods = function (run) {
    return Api.recoveryOptions(run) 
    .then(function (response) {
      localStorage.setItem('token', response.data.token);
      var methods = response.data.object.methods;

      if (methods.length === 1) {
        return $scope.sendRecovery(methods[0]);
      }

      $scope.methods = methods;
    })
    .catch(function (response) {
      $scope.apiError = response.status;
      $scope.message = response.data.error;
    })
      ;
  };

  $scope.showOptions = function (form) {
    return $scope.humanOk && form.run.$valid;
  };

  $scope.resetForm = function () {
    $scope.run = $scope.captcha = $scope.apiError = null;
    $scope.humanOk = false;
  };
});
