'use strict';

function AccessController($scope, $state, $location, Api, $http, session, Messages) {
    'ngInject';

    $scope.user = {};
    $scope.accessUser = function (user) { 
        return Api.authenticateUser(user.run, user.password)
            .then(function (info){   
                if( info.token != null ){
                    /* create token in header */
                    localStorage.setItem('token', info.token);
                    session.check().then(function (user){
                        window.location = "/"+localStorage.getItem('pre_url');
                    }).catch(function(response){
                        $scope.message = Messages.response(0);        
                    });
                }else{
                    $scope.message = Messages.response(info.code);
                }
            })
            .catch(function (response) {
                $scope.message = Messages.response(0);
            });
    };

    /* Si hay token enviar a */
    /* 1: */
    /* 2: home */
    if( localStorage.getItem('token') != null ){
        localStorage.removeItem('pre_url');
        window.location = "/"
    }

}

angular
    .module('claveunica')
    .controller('AccessController', AccessController)
;
