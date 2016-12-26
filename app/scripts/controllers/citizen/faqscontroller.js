'use strict';

var app = angular.module('claveunica');

app.controller('FaqsController', function ($scope, Api) {
    'ngInject';

    Api.getFaqs().then(function (faqs) {
        $scope.faqs = faqs;
    }, function () {
        $scope.error = true;
    });
});
