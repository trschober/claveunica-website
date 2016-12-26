'use strict';

function OfficeController($scope, Api, $geolocation, geolocationSvc) {
  'ngInject';

  $scope.regions = [];
  $scope.cities = [];
  $scope.validCities = [];

  var defaultCity = {
    codigo: "13101",
    latitude: -33.4417,
    longitude: -70.6541
  }

  $scope.map = {
    center: {
      latitude: defaultCity.latitude,
      longitude: defaultCity.longitude
    },
    zoom: 12
  };

  Api.getOfficesByCity(defaultCity).then(function (offices) {
      $scope.map = {
        center: {
          latitude: defaultCity.latitude,
          longitude: defaultCity.longitude
        },
        zoom: 12
      };

      if (offices.length == 1) {
        $scope.map.center = offices[0].coordinates;
      }
      
      $scope.offices = offices;
    });

  $scope.control = {};

  $scope.prefetchCities = function () {
    return Api.getCitiesCodes().then(function (cities) {
      $scope.validCities = cities;
    });
  };

  $scope.getRegions = function () {
    return Api.getRegions().then(function (regions) {
      $scope.regions = regions;
    });
  };

  $scope.changeRegion = function (region) {
    return Api.getCitiesByRegion(region, $scope.validCities).then(function (cities) {
      $scope.cities = cities;
    });
  };

  $scope.getNearOffices = function(){

    $scope.offices = [];
    angular.element('.office-loading-spinner').removeClass('hide');
    function geoSuccess(position){
      
      var coords = position.coords
      return Api.getNearOfficesByLatlng(coords).then(function (offices) {
        $scope.map = {
          center: {
            latitude: coords.latitude,
            longitude: coords.longitude
          },
          zoom: 12
        };
        $scope.offices = offices;
      })
    }

    geolocationSvc.getCurrentPosition().then(geoSuccess);

  }

  $scope.getCityOffices = function (city) {
    if (!city) {
      return;
    }
    $scope.offices = [];
    angular.element('.office-loading-spinner').removeClass('hide');
    return Api.getOfficesByCity(city).then(function (offices) {
      $scope.map = {
        center: {
          latitude: city.latitude,
          longitude: city.longitude
        },
        zoom: 12
      };

      if (offices.length == 1) {
        $scope.map.center = offices[0].coordinates;
      }
      
      $scope.offices = offices;
    });
  };

  $scope.prefetchCities()
    .then($scope.getRegions)
  ;
}

angular
  .module('claveunica')
  .controller('OfficesController', OfficeController)
;
