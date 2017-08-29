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
	$scope.token_recovery = '';
	$scope.token_session = '';

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
    	/* guardar token_session */
    	$scope.token_session = localStorage.getItem('token');
    	/* sobreescribir token = token_recovery */
		localStorage.setItem('token', $scope.token_recovery);

    	Api.sendRecoveryAccount($scope.run, method_id).then(function (data) {
    		/* volver token = token_sesion */
    		$scope.token_recovery = '';
    		localStorage.setItem('token', $scope.token_session);
    		$scope.token_session = '';
    		$scope.message =  Messages.response(data.code, data.params[0]);
    	});
    }

    $scope.submit = function() {
    	if( $scope.token_session != '' ){
			localStorage.setItem('token', $scope.token_session);
    	}
    	if ($scope.run) {
			Api.getCitizenData($scope.run).then(function (data) {
				/*obtener token de recuperacion*/
				var clean_run = $scope.run.replace(".", "");
				clean_run = clean_run.replace(".", "");
				clean_run = clean_run.replace("-", "");
				clean_run = clean_run.slice(0,-1);
				$.ajax({
				  url: "https://portal.claveunica.gob.cl/api/v1/users/"+clean_run+"/recovery"
				}).done(function(data_recovery) {
				  $scope.token_recovery = data_recovery.token;
				});

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
	