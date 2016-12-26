'use strict';

var app = angular.module('claveunica');

app.config(function ($provide) {
    'ngInject';

    $provide.decorator('$http', function ($delegate) {
        $delegate.url = function (url) {
            var zurl = $delegate.getEndpoint() + url;

            if (arguments.length > 1) {
                var args = arguments, i = 1;

                return zurl.replace(/{\w+?}/g, function () {
                    return args[i++];
                });
            }

            return zurl;
        };

        $delegate.setEndpoint = function (ep) {
            $delegate.endpoint = ep;
        };

        $delegate.getEndpoint = function () {
            return $delegate.endpoint;
        };

        return $delegate;
    });
  });
