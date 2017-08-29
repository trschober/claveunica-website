'use strict';

function MetricsController($scope, Api, $interval) {
    'ngInject';

    $scope.data = {
        numberUsers: 0,
        numberInstitutions: 0,
        numberApps: 0,
        numberTransactionsDay: 0
    };

    $scope.statusClss = [
        'offline',
        'online',
        'maintenance'
    ];

    $scope.getMetrics = function() {
        return Api.getMetrics().then(function (data) {
            $scope.data = data;
            $scope.status = $scope.statusClss[data.statusClaveUnica];
        }).catch(function (error) {
            $scope.error = error;
        });
    };

    $scope.getMetrics();

    // var intervalPromise = $interval(function () { $scope.getMetrics(); }, 30000);      
    // $scope.$on('$destroy', function () { $interval.cancel(intervalPromise); });

}

angular
    .module('claveunica')
    .controller('MetricsController', MetricsController)
;
