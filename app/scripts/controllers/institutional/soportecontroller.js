'use strict';

var app = angular.module('claveunica');

app.directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
    }])

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

    $scope.error_new = "";
    $scope.result_new = "";

    $scope.isAdmin = false;

    var temp_token = localStorage.getItem('token');
    var arrayTt = temp_token.split(".");
    var obj = JSON.parse(atob(arrayTt[1]));
    if( obj.support.admin ){
        $scope.isAdmin = true;
        Api.getAgents().then(function (data) {
            $scope.agents = data;
        }).catch(function (error) {
            $scope.error = error;
        });
    }

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

    $scope.deleteAgent = function(run_support){

        Api.deleteAgent(run_support).then(function (data) {
            //recargar listado
            Api.getAgents().then(function (data) {
                $scope.agents = data;
            }).catch(function (error) {
                $scope.error = error;
            });
            $scope.error_new = "";
            $scope.result_new = "";
            // showDiv('form_new_agent');
            document.getElementById("form_new").reset();
            document.getElementById(div_id).style.display = "none";
        });
    }

    $scope.cancelNewAgent = function() {
        $scope.error_new = "";
        $scope.result_new = "";
        showDiv('form_new_agent');
    }

    $scope.saveAgent = function() {
        var partial_run = parseInt($scope.agent_run.split('-')[0].split('.').join(''));
        var partial_dv = $scope.agent_run.substr($scope.agent_run.length - 1);
            partial_dv = partial_dv.toUpperCase();
        var json_new_user = '{"other_info" : {  "phone" : {"code" : "+56", "number" : '+$scope.agent_phonenumber+'}, "email" : "'+$scope.agent_email+'"}, "name" : {"apellidos" : [ "'+$scope.agent_lastname+'" ], "nombres" : [ "'+$scope.agent_name+'" ]}, "RolUnico" : {"DV" : "'+partial_dv+'","numero" : '+partial_run+',"tipo" : "RUN"}}';
        Api.sendNewAgent(json_new_user).then(function (data) {
            if( data.status == 'ok'){
                alert("Agente creado exitosamente");
                Api.getAgents().then(function (data) {
                    $scope.agents = data;
                }).catch(function (error) {
                    $scope.error = error;
                });
                showDiv('form_new_agent');
            }else{
                $scope.error_new = "error";
                $scope.result_new = Messages.response(data.code, "");
            }
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
    