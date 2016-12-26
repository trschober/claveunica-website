'use strict';

function DashboardChartController(Api) {
  'ngInject';

  this.selected = 0;
  this.data = [];
  this.filters = ['Último día', 'Último mes', 'Último año'];
  this.keys = ['DAY', 'MONTHLY', 'YEAR'];
  this.options = {
    chart: {
      type: 'lineChart',
      height: 250,
      margin : {
        top: 50,
        right: 20,
        bottom: 40,
        left: 55
      },
      showLegend: false,
      x: function(d){ return d.label; },
      y: function(d){ return d.y; },
      useInteractiveGuideline: true,
      noData: 'Aún no hay datos disponibles'
    }
  };

  this.changeFilter = function(selected) {
    return Api.getChartsByPeriod(this.institution, this.chart, this.keys[selected])
      .then(function (response) {
      })
    ;
  };

  this.changeRange = function (start, end) {
    return Api.getChartsByRange(this.institution, this.chart, start, end)
      .then(function (response) {
      })
    ;
  };

  this.getData = function () {
    return Api.isInstitution().then(function (data) {
      this.institution = data.instituticion[1];
      return this.changeFilter(0);
    }.bind(this));
  };

  this.getData();
}

angular
  .module('claveunica')
  .component('dashboardChart' , {
    bindings: {
      chart: '<',
      institution: '<'
    },
    controller: DashboardChartController,
    templateUrl: 'views/components/dashboard-chart.html'
  })
;
