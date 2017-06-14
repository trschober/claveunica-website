'use strict';

function RouterCiudadano($stateProvider) {
  'ngInject';

  $stateProvider
      .state('citizen', {
          abstract: true,
          url: '/',
          templateUrl: 'views/citizen/index.html'
      })
      .state('citizen.home', {
          url: '',
          templateUrl: 'views/citizen/home.html',
          data: { pageTitle: 'Inicio' }
      })
      .state('citizen.login', {
          // abstract: true,
          url: 'acceder',
          templateUrl: 'views/citizen/login.html',
          controller: 'AccessController',
          data: { pageTitle: 'Acceder' }
          // template: '<ui-view/>'
      })
      .state('citizen.login.form', {
          url: '',
          templateUrl: 'views/citizen/login.html',
          controller: 'AccessController',
          data: { pageTitle: 'Acceder' }
      })
      .state('citizen.about', {
          url: 'que-es',
          templateUrl: 'views/citizen/about.html',
          data: { pageTitle: '¿Qué es?' }
      })
      .state('citizen.tos', {
          url: 'terminos-y-condiciones',
          templateUrl: 'views/citizen/tos.html',
          data: { pageTitle: 'Términos y condiciones' }
      })
      .state('citizen.getit', {
          url: 'como-obtenerla',
          templateUrl: 'views/citizen/get-it.html',
          data: { pageTitle: 'Cómo obtenerla' }
      })
      .state('citizen.faqs', {
          url: 'preguntas-frecuentes',
          templateUrl: 'views/citizen/faqs.html',
          controller: 'FaqsController',
          data: { pageTitle: 'Preguntas Frecuentes' }
      })
      .state('citizen.offices', {
          url: 'oficinas',
          templateUrl: 'views/citizen/offices.html',
          controller: 'OfficesController',
          data: { pageTitle: 'Donde obtenerla' }
      })
      .state('citizen.tasks', {
          url: 'operaciones',
          templateUrl: 'views/citizen/tasks.html',
          controller: 'TasksController as ctrl',
          data: { pageTitle: 'Operaciones disponibles' }
      })
      .state('citizen.activation', {
          abstract: true,
          url: 'activar',
          template: '<ui-view />'
      })
      .state('citizen.activation.form', {
          url: '',
          templateUrl: 'views/citizen/activate.html',
          controller: 'ActivateController',
          data: { pageTitle: 'Activar clave' }
      })
      .state('citizen.activation.config', {
          templateUrl: 'views/citizen/config.html',
          controller: 'ConfigController',
          data: { pageTitle: 'Configurar mis datos' },
          params: { data: null }
      })
      .state('citizen.activation_mini', {
          abstract: true,
          url: 'activar_mini',
          template: '<ui-view />'
      })
      .state('citizen.activation_mini.form', {
          url: '',
          templateUrl: 'views/citizen/activate_mini.html',
          controller: 'ActivateminiController',
          data: { pageTitle: 'Activar clave mini' }
      })
      .state('citizen.activation_mini.configmini', {
          templateUrl: 'views/citizen/configmini.html',
          controller: 'ConfigminiController',
          data: { pageTitle: 'Configurar mis datos mini' },
          params: { data: null }
      })
      .state('citizen.activity',  {
          url: 'actividad',
          templateUrl: 'views/citizen/activity.html',
          controller: 'ActivityController',
          data: { pageTitle: 'Últimos movimientos' },
          resolve: {
              user: function (session) {
                  'ngInject';
                  session.getUser().catch(function () {
                      session.login('citizen.activity');
                  });
              }
          }
      })
      .state('citizen.profile', {
          url: 'perfil',
          templateUrl: 'views/citizen/profile.html',
          controller: 'ProfileController',
          data: { pageTitle: 'Actualizar datos' },
          resolve: {
              user: function (session) {
                  'ngInject';
                  session.getUser().catch(function () {
                      session.login('citizen.profile');
                  });
              }
          }
      })
      .state('citizen.recovery', {
          abstract: true,
          url: 'recuperar',
          template: '<ui-view/>'
      })
      .state('citizen.recovery.form', {
          url: '',
          templateUrl: 'views/citizen/recovery.html',
          controller: 'RecoveryController',
          data: { pageTitle: 'Recuperar Clave' }
      })
  ;
}

angular
    .module('router-citizen', ['ngRoute', 'ui.router'])
    .config(RouterCiudadano)
;
