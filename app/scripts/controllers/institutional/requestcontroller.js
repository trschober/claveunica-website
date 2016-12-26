'use strict';

function RequestController($scope, $uibModal, Api) {
    'ngInject';

    $scope.regex = "\\+(?:[0-9] ?){6,14}[0-9]";

    $scope.request = {
        nameApp: null,
        urlProd: null,
        urlSandbox: null,
        institution: null,
        phoneContactAdm: null,
        phoneContactTec: null,
        emailContactAdm: null,
        emailContactTec: null,
        nameContactAdm: null,
        nameContactTec: null,
        descriptionApp: null,
        procedureUrl: null
    };

    $scope.onRequestSuccess = function (response) {
        $scope.data = response.data;
        $scope.downloadLink = Api.getCredentialsFileLink(
            response.data.transactionId
        );

        $uibModal.open({
            animation: false,
            templateUrl: 'credentialsModal.html',
            scope: $scope,
            backdrop: false,
            controller: function ($scope, $state) {
                'ngInject';

                $scope.dismissModal = function() {
                    $state.go('institutional.home');
                };
            }
        });
    };

    $scope.submit = function () {
        ['urlProd', 'procedureUrl'].forEach(function (e) {
            if (!$scope.request[e] || !$scope.request[e].length) {
                delete $scope.request[e];
            }
        });

        return Api.requestCredentials($scope.request)
            .then($scope.onRequestSuccess)
            .catch(function (response) {
                $scope.error = response.data.error;
            })
        ;
    };
}

angular
    .module('claveunica')
    .controller('RequestController', RequestController)
;
