'use strict';

var app = angular.module('claveunica');

app.directive('strongPass', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attributes, ngModel) {
            element.on('focus', function () {
                ngModel.$setValidity('invalidchar', true);
                ngModel.$setValidity('strongPassword', true);
                scope.$apply();
            });

            element.on('blur', function () {
                var validchars = /^[a-zA-Z0-9-!@#$%^&*()_[\]{},.<>+=]+$/;
                var value = ngModel.$viewValue;

                ngModel.$setValidity('invalidchar', value.length && validchars.test(value));
                scope.$apply();

                if( value.length && validchars.test(value) ){
                    var regex = /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{8,50}$/;
                    var valid = false;
                    if( regex.test(value) ){
                        valid = true;
                    }
                    ngModel.$setValidity('strongPassword', valid);
                    scope.$apply();
                }
            });
        }
    }
});
