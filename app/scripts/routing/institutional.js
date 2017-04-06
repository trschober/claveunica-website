'use strict';

function RouterInstitucional($stateProvider) {
  'ngInject';

  $stateProvider
      .state('institutional', {
          abstract: true,
          url: '/institucional',
          templateUrl: 'views/institutional/index.html'
      })
      .state('institutional.home', {
          url: '',
          templateUrl: 'views/institutional/home.html',
          data: { pageTitle: 'Portal Institucional' }
      })
      .state('institutional.request', {
          url: '/solicitud-activacion',
          templateUrl: 'views/institutional/request.html',
          controller: 'RequestController',
          data: { pageTitle: 'Solicitud de activación' },
          resolve: {
              user: function (session) {
                  'ngInject';
                  session.getUser().catch(function () {
                      session.login('institutional.request');
                  });
              }
          }
      })
      .state('institutional.how', {
          url: '/como-funciona',
          templateUrl: 'views/institutional/how-it-works.html',
          data: { pageTitle: 'Cómo funciona' }
      })
      .state('institutional.tutorial', {
          url: '/manual-de-instalacion',
          templateUrl: 'views/institutional/tutorial.html',
          controller: 'TutorialController',
          data: { pageTitle: 'Manual de instalación' }
      })
      .state('institutional.charts', {
          url: '/estadisticas',
          templateUrl: 'views/institutional/charts.html',
          data: { pageTitle: 'Estadísticas de uso' }
      })
  ;
}

angular
    .module('router-institutional', ['ngRoute', 'ui.router'])
    .config(RouterInstitucional)
;
