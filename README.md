# Instrucciones para NodePop
En este documento explicaré los pasos necesarios para utilizar correctamente el API y el portal de la tienda *NodePop*.

## Instalación
* La aplicación corre contra una base de datos MongoDB.
* Podremos utilizar tanto Mongo en local como en remoto. 
* Para configurar la cadena de conexión MongoDB se debe modificar la variable **DATABASE** del fichero *variables.env*.


### Scripts NPM existentes
Para correr la aplicación deberemos tener el gestor de paquetes *npm* instalado en nuestro equipo.

En el package.json del raiz tenemos 5 tareas definidas:
1. **loadData**
1. **e2e**
1. **thumbnailService**
1. **lint**
1. **start**

#### loadData
El primero de ellos sirve para cargar un juego de datos mock se lanzará desde la consola de comandos con la instrucción 
```javascript
npm run loadData
```
Si todo ha ido bien, se crearán dos esquemas en MongoDB:

* **Anuncio**: En este esquema se guardan los documentos Anuncio que se mostrarán en el API y en el frontend de *NodePop*.
* **Tag**: En este esquema se almacenan los tags o categorías de la propia tienda.

*(Es importante recordar que al lanzar este script volveremos al juego de datos de prueba y perderemos cualquier cambio posterior a la primera ejecución)*

#### e2e
Con este comando lanzaremos los test e2e que prueban los principales métodos de nuestro API.
```javascript
npm run e2e
```

#### thumbnailService

Si corremos este proceso en paralelo, arrancaremos un microservicio que se conecta a una cola RabbitMQ que genera una miniatura de cada imagen que un anunciante sube a nuestro portal cuando crea un anuncio desde el formulario creado para tal fin.
Cuando se arranque este proceso, se consumiran todas las imágenes que ha encolado el aplicativo.
```javascript
npm run thumbnailService
```

#### lint
El cuarto de los scripts es el encargado de medir la calidad del código javascript mediante la herramienta *JSHint*.
Se ejecutará con la instrucción:
```javascript
npm run lint
```
Se motrará una pila de errores y advertencias sobre el código javascript creado para el proyecto.

#### start
Este script es el típico de arranque del servidor. 
```javascript
npm start
```
Si todo ha ido bien, la aplicación escuchará peticiones en el puerto 3000 vía navegador web o utilizando un software como *PostMan* para probar directamente los verbos del API.


## Utilización de las peticiones al API

El API es muy básico, aunque está protegido mediante JWT.
Para acceder a los métodos del API hay que obtener previamente un TOKEN autenticacion.

### Autenticación
Para las pruebas, el usuario será el email inventado **user@example.com** y la password **1234**.

Estas credenciales deberán ir como cabecera de la peticion *POST* a la siguiente dirección del API:
*(http://localhost:3000/api/authenticate)*

Las cabeceras para obtener un token válido serán por tanto:
*usuario=user@example.com*
*password=1234*

Deberemos guardar el toke generado para acceder al resto de métodos del API.

### Métodos del API

Contamos con 3 operaciones en total (2 de tipo *GET* y 1 de tipo *POST*).

Las operaciones del api se invocarán desde la url base *(http://localhost:3000/api/<nombre_de_operacion>)*
Deberán llevar en la cabecera una clave valor como la siguiente para pasar la validación JWT:
**x-access-token**=*<token>*

Son las siguientes:

* **/anuncios**: Muestra el listado completo de anuncios
* **/busqueda**: Introduciendo ciertos parámetros en la url de esta petición filtraremos sobre el listado de anuncios que contiene el esquema *Anuncio* de nuestra BBDD.
* **/crearAnuncio**: Esta petición POST guardará un nuevo anuncio en nuestro esquema de BBDD.

Todas las transacciones son multidioma si se añade a su request un parámetro **idioma** con el acrónimo del lenguaje. Ejemplo:
 ```javascript
http://localhost:3000/api/<nombre_de_operacion>?idioma=es
```
De momento solo están traducidos los mensajes de error que arroja el servidor y los idiomas disponibles son el inglés(*código en*) y el español (*código es*).

*(Si no se especifica el parámetro **idioma** los mensajes por defecto se muestran en inglés)*

### /anuncios
Con esta petición obtendremos el listado completo de anuncios de nuestra tienda.
Ejemplo de uso:

 ```javascript
http://localhost:3000/api/anuncios/
```
Aparte de lo antes explicado sobre el idioma, esta transacción no admite parámetros.

### /busqueda
Con esta petición filtraremos los resultados de nuestro esquema *Anuncio* por diversos criterios. Esta es una lista de los parámetros admitidos para este método:
* *tags* De tipo array, recibe uno o varios tags.
* *venta* Será true si se pretende buscar artículos que estan a la venta y false si se quieren obtener anuncios de búsqueda de un particular.
* *nombre* Contendrá parte del inicio del nombre de un artículo.
* *precio* Rango del precio de los artículos que se quieren filtrar. Estos son los valores que admite:
  * '10-': Artículos desde 10 euros.
  * '10-50': Artículos desde los 10 a los 50 euros.
  * '-50': Artículos hasta 50 euros de precio
  * '+50': Artículos desde 50 euros.
* *sort* Ordena los resultados por el campo indicado (<campo> ascendente) (-<campo> Descendente).
* *limit* Limita el número de resultados a devolver en el JSON.
* *start* Especifica el número de resultado desde el que queremos consultar saltándonos los números de registro menor al especificado en este campo.

Una petición con varios parámetros de los explicados podría ser ésta:

*/api/busqueda?**tags**=mobile&**tags**=motor&**venta**=false&**nombre**=ip&**precio**=50-&**start**=0&**limit**=2&**sort**=precio*

### /crearAnuncio
Mediante petición POST podemos guardar nuevos anuncios en nuestra base de datos.
En el portal web tenemos un formulario preparado para tal fin, pero también puede realizarse esta tarea mediante clientes como *POSTMAN*
