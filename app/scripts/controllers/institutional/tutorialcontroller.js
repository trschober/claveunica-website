'use strict';

function TutorialController($scope) {
    'ngInject';

    $scope.steps = [
        'Paso 1',
        'Paso 2',
        'Paso 3',
        'Paso 4',
        'Paso 5',
        'Paso 6'
    ];

    $scope.selected = 0;
}

angular
    .module('claveunica')
    .controller('TutorialController', TutorialController)
;
