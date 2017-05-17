'use strict';

function Api($http, $q, $base64, $cacheFactory) {
  'ngInject';

  this.number = null;
  this.meta = angular.element('meta[name=api-endpoint]');
  this.endpoint = _.trimEnd(this.meta.attr('content'), '/');

  this.endpoint_info = 'https://login.claveunica.gob.cl';

  this.URL = {
    activate: '/codes',
    check: '/accounts/check',
    update: '/users/{number_run}',
    logout: '/accounts/logout',
    stats: '/front/users/{number_run}/logs',
    account: '/users/{number_run}',
    methods: '/users/{number_run}/recovery',
    recovery: '/users/{number_run}/recovery/{method}',
    tasks: '/front/procedures',
    offices: '/front/places',
    faqs: '/front/faq-users',
    metrics: '/front/institutions/metrics',
    request: '/front/institutions/form',
    credentials: '/front/institutions/form/download',
    charts: '/front/institutions/{institution}/charts/{id}',
    institution: '/accounts/institution/check',
    citizendata: '/support/{number_run}',
  };

  $http.setEndpoint(this.endpoint);

  this.parseRutNumber = function (run) {
    return parseInt(run.split('-')[0].split('.').join(''));
  };

  this.getMetrics = function () {
    return $http.get($http.url(this.URL.metrics)).then(function (res) {
      return res.data.object;
    });
  };

  this.check = function () {
      return $http.get(this.endpoint_info.concat("/accounts/info")).then(function (res) {
        return res.data.object.RolUnico.numero;
      }.bind(this));
  };

  this.authenticateUser = function(user, pass){
    return $http.post(this.endpoint_info.concat("/accounts/login"), {username: user, password: $base64.encode(pass) }).then(function (res) {
      return res.data;
    });
  }

  this.getCitizenData = function(run) {
    return $http.get($http.url(this.URL.citizendata, this.parseRutNumber(run))).then(function (res) {
      return res.data;
    });
  }

  this.activateUser = function (user) { 
    return $http.post($http.url(this.URL.activate), {
      numero: this.parseRutNumber(user.numero),
      code_activation: $base64.encode(user.code_activation)
    }).then(function (res) {
      return res.data;
    });
  };

  this.updateUser = function (data, run) {
    return $http.put($http.url(this.URL.update, run), data);
  };

  this.userInfo = function (run) {
    return $http.get(this.endpoint_info.concat("/accounts/info")).then(function (res) {
      return res.data;
    });
  };

  this.createUser = function (run, user) {
    return $http.post($http.url(this.URL.account, this.parseRutNumber(run)), user);
  };

  this.recoveryOptions = function (run) {
    return $http.get($http.url(this.URL.methods, this.parseRutNumber(run)));
  };

  this.sendRecovery = function (run, method) {
    return $http.post($http.url(this.URL.recovery, this.parseRutNumber(run), method), null);
  };

  this.getActivity = function (run) {
    return $http.get($http.url(this.URL.stats, run)).then(function (res) {
      return res.data.lastLog;
    });
  };

  this.logout = function () {
    return $http.delete(this.endpoint_info.concat("/accounts/logout")).then(function (res) {
      localStorage.removeItem('token');
    });; 
  };

  this.getFaqs = function () {
    return $http.get($http.url(this.URL.faqs), { cache: true }).then(function (res) {
      return res.data.object.faq;
    });
  };

  this.getRandomTasks = function (limit) {
    return $http.get($http.url(this.URL.tasks + '?limit={limit}', limit));
  };

  this.checkIp = function(){
    var endpoint = 'https://jsonip.com';
    $http.get(endpoint).then(function(data){
    })
  };

  this.getServices = function () {
    var action = this.URL.tasks + '?distinct=institucion';
    var endpoint = 'https://apis.digital.gob.cl/misc/instituciones/';

    return $http.get($http.url(action), { cache: true })
        .then(function (resp) {
          var codes = [];

          // angular.forEach(resp.data['trámites'].institucion, function (e) {
          angular.forEach(resp.data.object.procedures.institucion, function (e) {
            codes.push($http.get(endpoint + e, { cache: true }).catch(angular.noop));
          });

          return $q.all(codes);
        }).then(function (res) {
          var instituciones = {};

          angular.forEach(res, function (e) {
            if (undefined === e || !e.data.found) {
              return;
            }

            instituciones[e.data._source.codigo] = e.data._source;
          });

          return instituciones;
        })
    ;
  };

  this.getTasksByService = function (service) {
    if (null === service) {
      return this.getRandomTasks(120);
    }
    console.log(this.URL.tasks + '?institucion={id}');
    console.log(service.codigo);
    return $http.get($http.url(this.URL.tasks + '?institucion={id}', service.codigo));
  };

  this.getRegions = function () {
    var action = this.URL.offices + '?distinct=region';
    var endpoint = 'https://apis.digital.gob.cl/dpa/regiones/';

    function processRegion(res) {
      var codes = [];

      angular.forEach(res.data.object.region, function (e) {
        if (typeof e === "number") {
          return;
        }

        codes.push($http.get(endpoint + e, { cache: true }).catch(angular.noop));
      });

      return $q.all(codes);
    }

    function processCity(res) {
      var regiones = [];

      angular.forEach(res, function (e) {
        if (e.data.error) {
          return;
        }

        regiones.push(angular.extend(e.data, {
          index: parseInt(e.data.codigo)
        }));
      });

      return regiones;
    }

    return $http.get($http.url(action), { cache: true })
      .then(processRegion)
      .then(processCity)
    ;
  };

  this.getCitiesCodes = function () {
    return $http.get($http.url(this.URL.offices + '?distinct=comuna'), { cache: true })
      .then(function(res) {
        return res.data.object.comuna;
      })
    ;
  };

  this.getCitiesByRegion = function (region, valid) {
    return $http.get('https://apis.digital.gob.cl/dpa/regiones/' + region.codigo + '/comunas', { cache: true })
      .then(function (res) {
        return res.data.filter(function (e) {
          return _.includes(valid, e.codigo);
        });
      })
    ;
  };

  this.getNearOfficesByLatlng = function(position) {
    return $http.get($http.url(this.URL.offices + '?latitude={lat}&longitude={lng}&radio={r}', position.latitude, position.longitude, '3'))
    .then(function (response) {
      var codes = [];

      angular.forEach(response.data.lugares, function (e) {
        codes.push($http.get('https://apis.digital.gob.cl/misc/instituciones/' + e.institucion)
          .then(function (res) {
            e.institution_name = res.data._source.nombre;
            e.coordinates = {
              latitude: e.point.latitude,
              longitude: e.point.longitude
            };
            return e;
          }).catch(angular.noop)
        );
      });
      angular.element('.office-loading-spinner').addClass('hide');
      return $q.all(codes);
    })
  };

  this.getOfficesByCity = function (city) {
    return $http.get($http.url(this.URL.offices + '?comuna={id}', city.codigo))
    .then(function (response) {
      var codes = [];

      angular.forEach(response.data.object, function (e) {
        codes.push($http.get('https://apis.digital.gob.cl/misc/instituciones/' + e.institucion)
          .then(function (res) {
            e.institution_name = res.data._source.nombre;
            e.coordinates = {
              latitude: e.point.latitude,
              longitude: e.point.longitude
            };

            return e;
          }).catch(angular.noop)
        );
      });
      angular.element('.office-loading-spinner').addClass('hide');
      return $q.all(codes);
    })
      ;
  };

  this.requestCredentials = function (request) {
    return $http.post($http.url(this.URL.request), request);
  };

  this.getCredentialsFileLink = function() {
    // return $http.url(this.URL.credentials, transactionId);
    return $http.url(this.URL.credentials);
  };

  this.downloadFileAjax = function(){
    return $http.get($http.url(this.URL.credentials)).then(function(res){
      var FileSaver = require('file-saver');
      var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "hello world.txt");
    });
  };

  this.getChartsByPeriod = function (institution, chart, period) {
    return $http.get($http.url(this.URL.charts + '?period={period}', institution, chart, period))
      .then(function(res) {
        return res.data;
      })
    ;
  };

  this.getChartsByRange = function (institution, chart, start, end) {
    return $http.get($http.url(this.URL.charts + '?start={start}&end={end}', institution, chart, start, end))
      .then(function(res) {
        return res.data;
      })
    ;
  };

  this.isInstitution = function () {
    return $http.get($http.url(this.URL.institution, { cache: true }))
      .then(function (res) {
        return res.data;
      })
    ;
  };
}

angular
    .module('claveunica')
    .service('Api', Api)
;
