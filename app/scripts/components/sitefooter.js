'use strict';

function SiteFooterController($transclude) {
    'ngInject';

    this.hasTransclude = function() {
        return $transclude.isSlotFilled('content');
    }
}

angular
    .module('claveunica')
    .component('siteFooter', {
        transclude: {
            content: '?content'
        },
        templateUrl: 'views/footer.html',
        controller: SiteFooterController
    })
;
