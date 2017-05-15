'use strict';

function session(Api, $cacheFactory, $storage, $q, $window, Messages) {
    'ngInject';

    this.user = null;

    this.getUser = function() {
        var user, defer = $q.defer();

        if (user = $storage.get('user-data')) {
            defer.resolve(user);
        } else {
            defer.reject(null);
        }

        return defer.promise;
    };

    function authorize() {
        // var query = ['?'];
        // var meta = angular.element('meta[name=auth-endpoint]');
        // var endpoint = _.trimEnd(meta.attr('content'), '/');
        // var loc = window.location;

        // if (!loc.origin) {
        //   loc.origin = loc.protocol + "//" + loc.hostname + (loc.port ? ':' + loc.port: '');
        // }

        // var params = {
        //   scope: 'openid run',
        //   client_id: '123',
        //   redirect_uri: window.encodeURIComponent(loc.origin),
        //   state: (Date.now() + '' + Math.random()).replace('.', ''),
        //   response_type: 'code'
        // };

        // for (var k in params) {
        //   query.push(k + '=' + params[k]);
        // }

        // window.location.replace(endpoint + query.join('&'));
        

        // var endpoint_info = 'https://login.claveunica.gob.cl';
        // window.location = endpoint_info.concat("/accounts/login?next=" + encodeURIComponent(window.location.href).replace(/'/g,"%27").replace(/"/g,"%22"));

        /* redirect to login page */
        if ( localStorage.getItem('token') != null ){
            window.location = "/";
        }else{
            window.location = "/acceder";
        }
    }

    this.check = function () {
        var defer = $q.defer();
        var self = this;

        Api.check()
            .then(function (rut) {
                return Api.userInfo(rut).then(function (res) {
                    res['rut'] = rut;
                    return self.user = $storage.set('user-data', res);
                });
            })
            .then(function (data) {
                return Api.isInstitution().then(function (res) {
                    data['instutition'] = res;
                    defer.resolve($storage.set('user-data', data));
                }).catch(function () {
                    defer.resolve(data);
                });
            })
            .catch(function () {
                $storage.clear();
                $cacheFactory.get('$http').removeAll();
                self.user = null;
                localStorage.removeItem('token');
                defer.resolve(null);
            })
        ;

        return defer.promise;
    };

    this.login = function (redirectTo) {
        if (redirectTo) {
            $storage.set('redirect-to', redirectTo);
        }

        if (null === $storage.get('user-data')) {
            authorize();
        } else {
            window.location.reload();
        }
    };

    function clearAll() {
        $storage.clear();
        $cacheFactory.get('$http').removeAll();
        $window.location.reload();
    }

    this.logout = function () {
        Api.logout().then(clearAll).catch(clearAll);
        window.location = "/";
    };
}

angular
    .module('claveunica')
    .service('session', session)
;
