'use strict';

function ActivityController($scope, Api, session) {
  'ngInject';

  $scope.activities = [];

  session.getUser().then(function (user) {
    Api.getActivity(user.rut).then(function (log) {
      $scope.activities = log;
    });
  });

} 

angular
  .module('claveunica')
  .controller('ActivityController', ActivityController)
;
