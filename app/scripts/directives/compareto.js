'use strict';

function CompareTo() {
    return {
        require: 'ngModel',
        scope: {
            otherModelValue: '=compareTo'
        },
        link: function (scope, element, attrs, ngModel) {
            ngModel.$validators.compareTo = function (value) {
                return value === scope.otherModelValue;
            };

            scope.$watch('otherModelValue', function () {
                ngModel.$validate();
            });

            scope.$watch(attrs.ngModel, function() {
                ngModel.$validate();
            });
        }
    }
}

angular
    .module('claveunica')
    .directive('compareTo', CompareTo)
;
