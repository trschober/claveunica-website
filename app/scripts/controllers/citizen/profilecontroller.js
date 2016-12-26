'use strict';

function ProfileController($scope, Api, session) {
  'ngInject';

  $scope.result = null;
  $scope.data = null;

  $scope.modifyData = function (profile, fullname) {
    return Api.updateUser(profile, $scope.data.rut)
      .then(function () {
        $scope.result = 'success';
        $scope.profile = profile;
        $scope.fullname = fullname;
      })
      .catch(function () {
        $scope.result = 'success';
      })
    ;
  };

  session.getUser().then(function (data) {
    $scope.data = {
      name: data.name,
      email: data.other_info.email,
      phone: data.other_info.phone,
      rut: data.rut
    };
  });
}

angular
  .module('claveunica')
  .controller('ProfileController', ProfileController)
;
