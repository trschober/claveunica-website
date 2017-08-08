'use strict';

function session(Api, $cacheFactory, $storage, $q, $window, Messages, $state) {
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

    function authorize(pre_url) {
        var temp_url = 'acceder';
        switch(pre_url) {
            case 'citizen.activity':
                temp_url = 'actividad';
                break;
            case 'citizen.profile':
                temp_url = 'perfil';
                break;
            case 'institutional.soporte':
                temp_url = 'institucional/soporte';
                break;
            case 'institutional.request':
                temp_url = 'institucional/solicitud-activacion';
                break;
            default:
                temp_url = 'acceder';
        }

        localStorage.setItem('pre_url', temp_url);
        $state.go('citizen.login');
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
            authorize(redirectTo);
        } else {
            window.location.reload();
        }
    };

    function clearAll() {
        $storage.clear();
        $cacheFactory.get('$http').removeAll();
        // $window.location.reload();
        localStorage.removeItem('token');
        window.location = "/";
    }

    this.logout = function () {
        Api.logout().then(clearAll).catch(clearAll);
    };
}

angular
    .module('claveunica')
    .service('session', session)
;
