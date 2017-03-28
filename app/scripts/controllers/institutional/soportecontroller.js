'use strict';

var app = angular.module('claveunica');
app.controller('SoporteController', function ($scope, Api) {
    'ngInject';

	$scope.regex = "\\+(?:[0-9] ?){6,14}[0-9]";
	$scope.request = {
		run: null
	};
    $scope.result = '';

    $scope.limpiarForm = function(){
		$scope.result = '';
		$scope.run = '';
		$scope.ciudadano_run = '';
		$scope.ciudadano_nombre = "";
		$scope.ciudadano_run = "";
		$scope.ciudadano_telefono = "";
		$scope.ciudadano_email = "";
		$scope.ciudadano_enrolamiento = "";
		$scope.ciudadano_activacion = "";
		$scope.ciudadano_bloqueado = "";
		$scope.ciudadano_intentos = "";
		$scope.ciudadano_intentos_fecha = "";
		$scope.ciudadano_estado = "";
    };

    $scope.submit = function() {
    	if ($scope.run) {
			Api.getCitizenData($scope.run).then(function (data) {
				if( data.status == "OK" ){
					var fullname = '';
					for (var i = 0; i < data.user.name.nombres.length ; i++) {
						fullname += data.user.name.nombres[i]+" ";
					}
					for (var j = 0; j < data.user.name.apellidos.length ; j++) {
						fullname += data.user.name.apellidos[j]+" ";
					}

					var telefono = '';
					if( data.user.other_info.phone){
						telefono = data.user.other_info.phone.code+data.user.other_info.phone.number;
					}

					var fecha_enrolamiento = '';
					var fecha_activacion = '';
					$scope.ciudadano_estado = 'Enrolado';

					if( data.user.enrolled_datetime ){
						fecha_enrolamiento = data.user.enrolled_datetime;
					}
					if( data.user.activation_datetime ){
						fecha_activacion = data.user.activation_datetime;
						$scope.ciudadano_estado = 'Activado';
					}

					var bloqueado = "No";
					if( data.user.block_status == true ){
						bloqueado = "Si";
					}

					var fecha_primer_fallido = '-';
					if( data.user.failed_login.first_failed ){
						fecha_primer_fallido = data.user.failed_login.first_failed;
					}

					$scope.result = 'resultado';
					$scope.ciudadano_run = $scope.run;
					$scope.ciudadano_nombre = fullname;
					$scope.ciudadano_telefono = telefono;
					$scope.ciudadano_email = data.user.other_info.email;
					$scope.ciudadano_enrolamiento = fecha_enrolamiento;
					$scope.ciudadano_activacion = fecha_activacion;
					$scope.ciudadano_bloqueado = bloqueado;
					$scope.ciudadano_intentos = data.user.failed_login.number_attemps;
					$scope.ciudadano_intentos_fecha = fecha_primer_fallido;
				}else{
					$scope.result = 'error1';
				}
		    }, function () {
		        $scope.result = 'error2';
		    });		
		}
	};
});
	