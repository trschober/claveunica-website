# ClaveÚnica

Cliente AngularJS para API de ClaveÚnica.

## Compilación

```
npm install
bower install
grunt build
```

La aplicación compilada será generada en la carpeta **dist** en la carpeta local.

## Configuración

Para configurar el endpoint de la API de ClaveÚnica se debe editar el `meta tag api-endpoint` del header de **index.html** y cambiarlo al valor deseado. Ej:

```
<meta name="api-endpoint" content="https://test.claveunica.gob.cl/api/v1" />
```

Para configurar el endpoint de autorización de OpenID de Claveúnica se debe editar el `meta tag auth-endpoint` del header de **index.html** y cambiarlo al valor deseado. Ej: 

```
<meta name="auth-endpoint" content="https://test.claveunica.gob.cl/openid/authorize">
```

Para configurar las api keys de Google Maps y ReCaptcha se deben editar los meta tags `gmaps-key` y `recaptcha-key` respectivamente de **index.html**.

```
<meta name="recaptcha-key" content="6LeYSggUAAAAADKQSAOCLBMMyHbglgB3xFrMTMax" />
<meta name="gmaps-key" content="AIzaSyA7JI2SSHNeDOuXUXq_V8OeVIpdnnrwDiI" />
```

## Despliegue

La aplicación puede ser servida de forma estática por cualquier servidor web.
