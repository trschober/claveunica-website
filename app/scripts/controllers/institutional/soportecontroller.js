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

app.controller('SoporteController', function ($scope, Api, Messages, RutHelper) {
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

    $scope.institucion = '';
    if( obj.support.institution ){
        $scope.institucion = obj.support.institution;
    }

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

    $scope.showEditEmail = function(){
        $("#btn_editar_email").hide();
        $("#email_new").show();
        $("#btn_cancelar_guardar_email").show(); 
        $("#btn_guardar_email").show(); 
    }
    $scope.cancelNewEmail = function(){
        /*vaciar campos*/
        $("#email_new").val("");
        /*ocultar campos*/
        $("#email_new").hide();
        $("#btn_cancelar_guardar_email").hide();
        $("#btn_guardar_email").hide();  
        $("#btn_editar_email").show(); 
    }

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
            document.getElementById("form_new_agent").style.display = "none";
        });
    }

    $scope.cancelNewAgent = function() {
        $scope.error_new = "";
        $scope.result_new = "";
        showDiv('form_new_agent');
    }

    $scope.saveNewEmail = function(ciudadano_run) {
        var run = ciudadano_run;
        var new_email = $scope.email_new;

        var regex_email = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        /* validar email antes de enviar*/
        if( regex_email.test(new_email) == false) {
            alert("El email es incorrecto");
        }else{
            Api.sendUpdateEmail(run, new_email).then(function (data) {
                //volver a buscar
                if( data.code == 75 ){
                    alert("El email no puede modificarse más de una vez en 24 horas");
                }else if( data.code == 76 ){
                    alert("Modificación no permitida");
                }else if( data.code == 55){
                    alert("El email fue actualizado exitosamente");

                    /*vaciar campos*/
                    $("#email_new").val("");
                    /*ocultar campos*/
                    $("#email_new").hide();
                    $("#btn_cancelar_guardar_email").hide();
                    $("#btn_guardar_email").hide();  
                    $("#btn_editar_email").show(); 

                    /* volver a buscar la misma info para el mismo run */
                    $scope.email_new = '';
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

                }else{
                    alert("Ocurrio un error, intente nuevamente");
                }
            });
        }
    }

    $scope.saveAgent = function() {
        $scope.error_new = "";
        $scope.result_new = "";

        var regex_email = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var filter_phone = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

        /* validar el run*/
        $scope.agent_name = $scope.agent_name.trim();
        $scope.agent_lastname = $scope.agent_lastname.trim();
        $scope.agent_email = $scope.agent_email.trim();
        $scope.agent_phonenumber = $scope.agent_phonenumber.trim();
        
        if( RutHelper.validar($scope.agent_run) == true ){
            /* validar nombre, apellido, email y telefono */
            if( $scope.agent_name.length > 30 || /^[ñÑA-Za-z ]*[ñÑA-Za-z][ñÑA-Za-z áéíóú]*$/.test($scope.agent_name) == false ){ //nombre
                $scope.error_new = "error";
                $scope.result_new = "El nombre no debe superar los 30 caracteres ni incluir números";
            }else if( $scope.agent_lastname.length > 30 || /^[ñÑA-Za-z ]*[ñÑA-Za-z][ñÑA-Za-z áéíóú]*$/.test($scope.agent_lastname) == false ){ //apellido
                $scope.error_new = "error";
                $scope.result_new = "El apellido no debe superar los 30 caracteres ni incluir números";
            }else if( regex_email.test($scope.agent_email) == false) { //email
                $scope.error_new = "error";
                $scope.result_new = "El email es incorrecto";
            }else if( filter_phone.test($scope.agent_phonenumber) == false ) { //telefono
                $scope.error_new = "error";
                $scope.result_new = "El formato del número es incorrecto";
            }else if( $scope.agent_phonenumber.length != 12 ) { //telefono
                $scope.error_new = "error";
                $scope.result_new = "El número telefónico debe tener 12 caracteres (incluyendo el +)";
            }else{
                $scope.temp_agent_phonenumber = $scope.agent_phonenumber.substr(3);
                var partial_run = parseInt($scope.agent_run.split('-')[0].split('.').join(''));
                var partial_dv = $scope.agent_run.substr($scope.agent_run.length - 1);
                    partial_dv = partial_dv.toUpperCase();
                var json_new_user = '{"other_info" : {  "phone" : {"code" : "+56", "number" : '+$scope.temp_agent_phonenumber+'}, "email" : "'+$scope.agent_email+'"}, "name" : {"apellidos" : [ "'+$scope.agent_lastname+'" ], "nombres" : [ "'+$scope.agent_name+'" ]}, "RolUnico" : {"DV" : "'+partial_dv+'","numero" : '+partial_run+',"tipo" : "RUN"}}';
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
        }else{
            $scope.error_new = "error";
            $scope.result_new = Messages.response(23);
        }
    }

    $scope.submit = function() {
        /*vaciar campos*/
        $("#email_new").val("");
        /*ocultar campos*/
        $("#email_new").hide();
        $("#btn_cancelar_guardar_email").hide();
        $("#btn_guardar_email").hide();  
        $("#btn_editar_email").show(); 
        
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
    