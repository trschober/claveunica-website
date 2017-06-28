'use strict';

function Messages() {

  this.response = function (code, param) {
    var strResp = "";

    switch(code) {
      // # Reservados
      case 1:
        strResp = "Is not logged"
        break;
      case 2:
        strResp = "Bad request"
        break;
      case 3:
        strResp = "Internal error in process"
        break;
      case 4:
        strResp = "Session deleted"
        break;
      case 5:
        strResp = "Internal error"
        break;
      case 6:
        strResp = "Token is missing"
        break;
      case 7:
        strResp = "Token is invalid"
        break;
      case 8:
        strResp = "User not allowed to perform this action *"
        break;
      case 9:
        strResp = "Service temporarily unavailable *"
        break;
      // # Front Exito
      case 10:
        strResp = "Usuario creado (Activación)";
        break;
      case 13:
        strResp = "Info de usuario enrolado al activarse";
        break;
      case 14:
        strResp = "Información de usuario (Userinfo)";
        break;
      case 15:
        strResp = "Informacion del usuario actualizada (Userinfo)";
        break;
      case 16:
        strResp = "Codigo de activación enviado a <b>"+param+"</b>";
        strResp += "<br><br>";
          if( param.search("@") == -1 ){
            strResp += "Si el número no esta vigente puedes corregirlo en tu <a href='https://claveunica.gob.cl/perfil'>perfil</a>";
          }else{
            strResp += "Si el mail es incorrecto o no esta vigente puedes corregirlo en tu <a href='https://claveunica.gob.cl/perfil'>perfil</a>. Si no tienes acceso, debes solicitar un nuevo código en la <a href='https://claveunica.gob.cl/oficinas' target='_blank'>oficina</a> más cercana indicando claramente la nueva dirección de correo electrónico.";
          }
        strResp += "<br><br>";
        strResp += "Si el código llego correctamente<br><a ui-sref='citizen.activation.form'>Activa tu Claveúnica</a>";
        break;
      case 17:
        strResp = "Metodo de recuperacion diponible <(1,2)>  (Recovery)";
        break;
      case 18:
        strResp = "OK (Auth)";
        break;
      case 19:
        // strResp = "Password Incorrect(Auth)";
        strResp = "La contraseña es incorrecta";
        break;
      case 20:
        strResp = "Usuario Bloqueado (Auth)";
        break;
      case 21:
        // strResp = "Usuario no existe (no activado ni enrolado) (Auth)"; 
        strResp = "El Ciudadano no cuenta con Claveúnica"; 
        break;
      case 22:
        // strResp = "Usuario no existe (no activado, si enrolado) (Auth)";
        strResp = "El Ciudadano necesita <a href='/activar'>activar su cuenta</a>";
        break;
      case 23:
        strResp = "RUN invalido (Auth)";
        break;
      case 25:
        strResp = "Codigo valido (Activación)";
        break;
      case 26:
        // strResp = "Codigo valido pero expirado (Activación)";
        strResp = "El código no es valido. Puede solicitar uno nuevo <a href='/recuperar'>aquí</a>";
        break;
      case 27:
        // strResp = "Codigo invalido (Activación)";
        strResp = "El código no es valido. Puede solicitar uno nuevo <a href='/recuperar'>aquí</a>";
        break;
      case 28:
        // strResp = "No enrolado (Activación)";
        strResp = "El código no es valido. Puede solicitar uno nuevo <a href='/recuperar'>aquí</a>";
        break;
      case 29:
        strResp = "Codigo bloqueado";
        break;
      case 30:
        strResp = "Regiones (front)";
        break;
      case 31:
        strResp = "Comunas (front)";
        break;
      case 32:
        strResp = "Instituciones (front)";
        break;
      case 33:
        strResp = "Lugares (front)";
        break;
      case 34:
        strResp = "Faq (front)";
        break;
      case 35:
        strResp = "Tramites (front)";
        break;
      case 45:
        strResp = "El código de activación ha sido enviado.";
        break;
        // # Errores
      case 50:
        strResp = "Usuario no existe (Activación - Obtencion de datos)";
        break;
      case 51:
        strResp = "Usuario no puede ser creado, porque ya cuenta con ClaveÚnica (Totems - Crear nuevo usuario)";
        break;
      case 52:
        strResp = "El parametro <> ingresado es incorrecto (Activación - Creando Usuario)";
        break;
      case 53:
        strResp = "Parametro invalido (Userinfo - Modificar usuario)";
        break;
      case 54:
        strResp = "Usuario no existe (Userinfo - Consultar usuario info)";
        break;
      case 56:
        strResp = "Usuario no existe (Recovery)";
        break;
      case 57:
        strResp = "Usuario no tiene este metodo de recuperación";
        break;
      default:
        strResp = "Ha ocurrido un error. Por favor intente nuevamente";
    }

    return strResp;
  };

  
}

angular
  .module('claveunica')
  .service('Messages', Messages)
;
