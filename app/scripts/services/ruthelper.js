'use strict';

/**
 * Copiado de https://www.claveunica.gob.cl/assets/js/rut-helper.js
 * @constructor
 */
function RutHelper() {

  this.formatearFull = function (rut, skipDots) {
    var noFormat = this.quitarFormato(rut);
    var run = [noFormat.slice(0, noFormat.length - 1), '-', noFormat.slice(noFormat.length - 1)].join('');
    var formattedRun = run.split('-');
    return this.formatear(formattedRun[0] + formattedRun[1], formattedRun[1], skipDots);
  };

  this.formatear = function (rut, digitoVerificador, skipDots) {
    var sRut = String(rut);
    var sRutFormateado = '';
    sRut = this.quitarFormato(sRut);
    if (digitoVerificador) {
      var sDV = sRut.charAt(sRut.length - 1);
      sRut = sRut.substring(0, sRut.length - 1);
    }
    if (!skipDots) {
      while (sRut.length > 3) {
        sRutFormateado = "." + sRut.substr(sRut.length - 3) + sRutFormateado;
        sRut = sRut.substring(0, sRut.length - 3);
      }
    }
    sRutFormateado = sRut + sRutFormateado;
    if (sRutFormateado != "" && digitoVerificador) {
      sRutFormateado += "-" + sDV;
    }
    else if (digitoVerificador) {
      sRutFormateado += sDV;
    }

    return sRutFormateado;
  };

  this.quitarFormato = function (rut) {
    var strRut = String(rut);
    while (strRut.indexOf(".") != -1) {
      strRut = strRut.replace(".", "");
    }
    while (strRut.indexOf("-") != -1) {
      strRut = strRut.replace("-", "");
    }

    return strRut;
  };

  this.digitoValido = function (dv) {
    return /[0-9kK]/.test(dv);
  };

  this.digitoCorrecto = function (crut) {
    var largo = crut.length, rut;
    if (largo < 2) {
      return false;
    }
    if (largo > 2) {
      rut = crut.substring(0, largo - 1);
    }
    else {
      rut = crut.charAt(0);
    }
    var dv = crut.charAt(largo - 1);
    this.digitoValido(dv);

    if (rut == null || dv == null) {
      return 0;
    }

    var dvr = this.getDigito(rut);

    return dvr == dv.toLowerCase();
  };

  this.getDigito = function (rut) {
    var dvr = '0';
    var suma = 0;
    var mul = 2;
    for (var i = rut.length - 1; i >= 0; i--) {
      suma = suma + rut.charAt(i) * mul;
      if (mul == 7) {
        mul = 2;
      }
      else {
        mul++;
      }
    }
    var res = suma % 11;
    if (res == 1) {
      return 'k';
    }
    else if (res == 0) {
      return '0';
    }
    else {
      return 11 - res;
    }
  };

  this.validar = function (texto) {
    var texto = this.quitarFormato(texto);
    var largo = texto.length;

    // rut muy corto
    if (largo < 2) {
      return false;
    }

    // verifica que los numeros correspondan a los de rut
    for (var i = 0; i < largo; i++) {
      // numero o letra que no corresponda a los del rut
      if (!this.digitoValido(texto.charAt(i))) {
        return false;
      }
    }

    var invertido = "";
    for (var i = (largo - 1), j = 0; i >= 0; i--, j++) {
      invertido = invertido + texto.charAt(i);
    }
    var dtexto = "";
    dtexto = dtexto + invertido.charAt(0);
    dtexto = dtexto + '-';
    var cnt = 0;

    for (var i = 1, j = 2; i < largo; i++, j++) {
      if (cnt == 3) {
        dtexto = dtexto + '.';
        j++;
        dtexto = dtexto + invertido.charAt(i);
        cnt = 1;
      }
      else {
        dtexto = dtexto + invertido.charAt(i);
        cnt++;
      }
    }

    invertido = "";
    for (var i = (dtexto.length - 1), j = 0; i >= 0; i--, j++) {
      invertido = invertido + dtexto.charAt(i);
    }

    return !!this.digitoCorrecto(texto);

  }
}

angular
  .module('claveunica')
  .service('RutHelper', RutHelper)
;
