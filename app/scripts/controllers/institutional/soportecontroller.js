'use strict';

var app = angular.module('claveunica');
app.controller('SoporteController', function ($scope, Api, Messages) {
    'ngInject';

	$scope.regex = "\\+(?:[0-9] ?){6,14}[0-9]";
	$scope.request = {
		run: null
	};
    $scope.result = '';
    $scope.error = '';
    $scope.message = '';

    $scope.limpiarForm = function(){
		$scope.result = '';
	    $scope.error = '';
	    $scope.message = '';
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

    $scope.sendRecoveryBySupport = function(method_id){
    	Api.sendRecoveryAccount($scope.run, method_id).then(function (data) {
    		$scope.message =  Messages.response(data.code);
    	});
    }

    $scope.submit = function() {
    	if ($scope.run) {
			Api.getCitizenData($scope.run).then(function (data) {
				if( data.status == "ok" ){
					var fullname = '';
					var data_user = data.object.user;

					for (var i = 0; i < data_user.name.nombres.length ; i++) {
						fullname += data_user.name.nombres[i]+" ";
					}
					for (var j = 0; j < data_user.name.apellidos.length ; j++) {
						fullname += data_user.name.apellidos[j]+" ";
					}

					var telefono = '';
					if( data_user.other_info.phone){
						telefono = data_user.other_info.phone.code+data_user.other_info.phone.number;
					}

					var fecha_enrolamiento = '';
					var fecha_activacion = '';
					$scope.ciudadano_estado = 'Enrolado';

					if( data_user.enrolled_datetime ){
						fecha_enrolamiento = data_user.enrolled_datetime;
					}
					if( data_user.activation_datetime ){
						fecha_activacion = data_user.activation_datetime;
						$scope.ciudadano_estado = 'Activado';
					}

					var bloqueado = "No";
					if( data_user.block_status == true ){
						bloqueado = "Si";
					}

					var fecha_primer_fallido = '-';
					if( data_user.failed_login.first_failed ){
						fecha_primer_fallido = data_user.failed_login.first_failed;
					}

					$scope.result = 'resultado';
					$scope.ciudadano_run = $scope.run;
					$scope.ciudadano_nombre = fullname;
					$scope.ciudadano_telefono = telefono;
					$scope.ciudadano_email = data_user.other_info.email;
					$scope.ciudadano_enrolamiento = fecha_enrolamiento;
					$scope.ciudadano_activacion = fecha_activacion;
					$scope.ciudadano_bloqueado = bloqueado;
					$scope.ciudadano_intentos = data_user.failed_login.number_attemps;
					$scope.ciudadano_intentos_fecha = fecha_primer_fallido;
				}else{
					$scope.error = Messages.response(data.data.code);
					$scope.resutl = Messages.response(data.data.code);
				}
		    }, function (data) {
		        $scope.error = Messages.response(data.data.code);
		        $scope.resutl = Messages.response(data.data.code);
		    });		
		}
	};
});
	