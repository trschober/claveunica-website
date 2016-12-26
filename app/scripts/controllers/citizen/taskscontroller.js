'use strict';

function TasksController($scope, Api) {
  'ngInject';

  $scope.tasks = [];
  $scope.services = {};

  $scope.getServices = function () {
    return Api.getServices().then(function (services) {
      $scope.services = services;
    });
  };

  $scope.changeService = function (service) {
    return Api.getTasksByService(service).then(function (response) {
      $scope.updateTasks(response.data['trámites']);
    });
  };

  $scope.updateTasks = function (tasks) {
    $scope.tasks = [];

    angular.forEach(tasks, function (e) {
      var service = $scope.services[e.institucion];

      if (undefined === service) {
        return;
      }

      $scope.tasks.push(angular.extend(e, {
        institution_name: service.nombre
      }));
    });
  };

  $scope.getRandomTasks = function(limit) {
    return Api.getRandomTasks(limit).then(function (response) {
      $scope.updateTasks(response.data['trámites']);
    })
  };

  $scope.getTasks = function () {
    return $scope.getServices().then(function () {
      $scope.getRandomTasks(120);
    });
  };
}

angular
  .module('claveunica')
  .controller('TasksController', TasksController)
;
