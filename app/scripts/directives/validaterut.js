'use strict';

var app = angular.module('claveunica');

app.directive('validateRut', function (RutHelper) {
    'ngInject';

    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attributes, ngModel) {
            function validateRut(value) {
                if (ngModel.$isEmpty(value)) {
                    return false;
                }

                return RutHelper.validar(value);
            }

            element.on('change', function () {
                var rut = RutHelper.formatearFull(ngModel.$viewValue, false);
                ngModel.$setViewValue(rut);
                element.val(rut);
            });

            ngModel.$validators.validateRut = function(value) {
                return validateRut(RutHelper.formatearFull(value, false));
            };
        }
    }
});
