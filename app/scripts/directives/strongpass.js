'use strict';

var app = angular.module('claveunica');

app.directive('strongPass', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attributes, ngModel) {
            var regex = /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{8,50}$/;

            ngModel.$validators.strongPassword = function (value) {
                return value !== undefined && regex.test(value);
            };

            element.on('input focus blur', function () {
                var validchars = /^[a-zA-Z0-9-!@#$%^&*()_[\]{},.<>+=]+$/;
                var value = ngModel.$viewValue;

                ngModel.$setValidity('invalidchar', value.length && validchars.test(value));
                scope.$apply();
            });
        }
    }
});
