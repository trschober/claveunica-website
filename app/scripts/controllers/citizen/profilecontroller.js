'use strict';

function ProfileController($scope, Api, session) {
  'ngInject';

  $scope.result = null;
  $scope.data = null;

  $scope.modifyData = function (profile, fullname) {
    console.log("1-");
    console.log($scope.data);
    console.log("-2");
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
      name: data.object.name,
      email: data.object.other_info.email,
      phone: data.object.other_info.phone,
      rut: data.rut
    };
  });

  console.log("3-");
  console.log($scope.data);
  console.log("-4");

}

angular
  .module('claveunica')
  .controller('ProfileController', ProfileController)
;
