'use strict';

function AccessController($scope, $state, Api, $http, session, Messages) {
    'ngInject';

    $scope.user = {};

    $scope.accessUser = function (user) { 
        return Api.authenticateUser(user.run, user.password)
            .then(function (info){   
                if( info.token != null ){
                    /* create user */
                    localStorage.setItem('token', info.token);
                    $state.go('citizen.profile');    
                }else{
                    $scope.message = Messages.response(info.code);
                }
            })
            .catch(function (response) {
                $scope.message = Messages.response(0);
            });
    };

    if( localStorage.getItem('token') != null ){
        $state.go('citizen.profile');
    }
}

angular
    .module('claveunica')
    .controller('AccessController', AccessController)
;
