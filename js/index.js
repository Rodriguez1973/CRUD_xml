/*Proyecto realizado por: José A. Rodríguez López-->
Fecha: 05/11/2022
*/

let semaforos = new Array() //Crea un array para registrar los semáforos.
let indice //Lleva el indice del array del objeto que estamos visualizando en la interfaz.

//-------------------------------------------------------------------------------------------------
//Cuando finaliza la carga del documento se cargan los datos por defecto (datos.js).
window.onload = () => {
  cargaDatosXml(datosDefecto)
}

//-------------------------------------------------------------------------------------------------
//Se cren las referencias de los objetos del formulario.
const bNuevo = document.getElementById('guardar')
const bSiguiente = document.getElementById('siguiente')
const bAnterior = document.getElementById('anterior')
const bModificar = document.getElementById('modificar')
const bBorrar = document.getElementById('borrar')
const bTabla = document.getElementById('mostrar_tabla')
const bDatos_defecto = document.getElementById('datos_defecto')
const bFichero = document.getElementById('datos_fichero')
const iAveriado = document.getElementById('iAveriado')
const iF_mantenimiento = document.getElementById('iF_mantenimiento')

//-------------------------------------------------------------------------------------------------
//Definición de eventos de los objetos.
bNuevo.addEventListener('click', crearRegistro, false) //Evento click al pulsar botón crear.
bSiguiente.addEventListener('click', registroSiguiente, false) //Evento click al pulsar botón siguiente.
bAnterior.addEventListener('click', registroAnterior, false) //Evento click al pulsar botón anterior.
bModificar.addEventListener('click', registroModificar, false) //Evento click al pulsar el botón modificar.
bBorrar.addEventListener('click', registroBorrar, false) //Evento click al pulsar el botón borrar.
bTabla.addEventListener('click', mostrarTabla, false)  //Evento click al pulsar el botón mostrar tabla.
bDatos_defecto.addEventListener('click', cargarDatosDefecto, false) //Evento click al pulsar el botón datos por defecto.
bFichero.addEventListener('change', cargarDatosFichero, false) //Evento click al pulsar el botón elegir fichero.

//-------------------------------------------------------------------------------------------------
//Clase que modela los objetos de tipo semáforo.
class Semaforo {
  //Constructor de objetos tipo semáforo.
  constructor(id, direccion, latitud, longitud, averiado, f_mantenimiento) {
    validarDatos(direccion, latitud, longitud, averiado, f_mantenimiento)
    this.id = id
    this.direccion = direccion
    this.latitud = latitud
    this.longitud = longitud
    this.averiado = averiado
    this.f_mantenimiento = f_mantenimiento
  }

  //Metodo que muestra un registro en la interfaz.
  mostrarRegistro() {
    iDireccion.value = this.direccion
    iLatitud.value = this.latitud
    iLongitud.value = this.longitud
    iAveriado.value = this.averiado
    iF_mantenimiento.value = this.f_mantenimiento
  }
}

//-------------------------------------------------------------------------------------------------
//Función que realiza la carga de los datos XML.
function cargaDatosXml(datos = null) {
  //Creación de un objeto que provee la capacidad de analizar el código fuente XML o HTML de una cadena en un documento DOM.
  let codigo = new DOMParser()
  try {
    //Analiza la cadena mediante el analizador XML y devuelve el documento resultante.
    let myXml = codigo.parseFromString(datos, 'text/xml')

    //Arrays que contendrán los datos de cada etiqueta por cada uno de los semáforos
    let aDireccion = new Array()
    let aLatitud = new Array()
    let aLongitud = new Array()
    let aAveriado = new Array()
    let aF_mantenimiento = new Array()

    //Rellenas los arrays en función del tipo de etiqueta XML.
    aDireccion = myXml.getElementsByTagName('direccion')
    aLatitud = myXml.getElementsByTagName('latitud')
    aLongitud = myXml.getElementsByTagName('longitud')
    aAveriado = myXml.getElementsByTagName('averiado')
    aF_mantenimiento = myXml.getElementsByTagName('f_mantenimiento')

    //Bucle para la creación de cada semáforo en funcion de los datos leídos
    for (var index = 0; index < aDireccion.length; index++) {
      //Cre
      let semaforo = new Semaforo(
        index,
        aDireccion.item(index).firstChild.nodeValue,
        aLatitud.item(index).firstChild.nodeValue,
        aLongitud.item(index).firstChild.nodeValue,
        aAveriado.item(index).firstChild.nodeValue,
        aF_mantenimiento.item(index).firstChild.nodeValue,
      )
      semaforos.push(semaforo) //Añade al semaforo al array
    }

    //Inicializa el indice de visualización.
    indice = 0
    //Muestra el indice 0 en la interfaz.
    visualiza(indice)
  } catch (Exception) {
    indice = 0
    vaciarCampos()
    div_notificaciones.innerHTML = '<p>Los datos no se han cargado. Son erroneos o no existen.</p>'
  }
}

//-------------------------------------------------------------------------------------------------
//Función que vacía los campos si no se han leído datos.
function vaciarCampos() {
  iDireccion.value = ''
  iLatitud.value = ''
  iLongitud.value = ''
  iAveriado.value = 'No'
  iF_mantenimiento.value = obtenerFechaActual()
}

//-------------------------------------------------------------------------------------------------
//Función que muestra un número de registro pasado como argumento en la interfaz.
function visualiza(numRegistro) {
  iDireccion.value = semaforos[numRegistro].direccion
  iLatitud.value = semaforos[numRegistro].latitud
  iLongitud.value = semaforos[numRegistro].longitud
  iAveriado.value = semaforos[numRegistro].averiado
  iF_mantenimiento.value = semaforos[numRegistro].f_mantenimiento
}

//-------------------------------------------------------------------------------------------------
//Función que crea un nuevo registro de un semáforo.
function crearRegistro() {
  div_notificaciones.innerHTML = ''
  try {
    //Crea semáforo.
    let semaforo = new Semaforo(
      semaforos.length,
      iDireccion.value,
      iLatitud.value,
      iLongitud.value,
      iAveriado.value,
      iF_mantenimiento.value,
    )
    //Añade el semáforo al array.
    semaforos.push(semaforo)
    //Actualiza el indice del elemento que estamos visualizando.
    indice = semaforos.length - 1
  } catch (Exception) {
    div_notificaciones.innerHTML = '<p>' + Exception + '</p>'
    if (semaforos.length > 0) {
      visualiza(0)
    } else {
      vaciarCampos()
    }
  }
}

//-------------------------------------------------------------------------------------------------
//Función para obtener la fecha actual.
function obtenerFechaActual() {
  let fecha = new Date() //Fecha actual
  let mes = fecha.getMonth() + 1 //Obtiene el mes
  let dia = fecha.getDate() //Obtiene el día.
  let ano = fecha.getFullYear() //Obtiene el año.
  if (dia < 10) dia = '0' + dia //Agrega cero si el menor de 10
  if (mes < 10) mes = '0' + mes //Agrega cero si el menor de 10
  return ano + '-' + mes + '-' + dia
}

//-------------------------------------------------------------------------------------------------
//Función para visualizar el registro siguiente.
function registroSiguiente() {
  div_notificaciones.innerHTML = ''
  //Hay semáforos
  if (semaforos.length > 0) {
    indice++
    if (indice < semaforos.length) {
      visualiza(indice)
    } else {
      div_notificaciones.innerHTML = '<p>Es el último registro de la lista.</p>'
      indice--
    }
  } else {
    div_notificaciones.innerHTML = '<p>No quedan registros en la lista.</p>'
  }
}

//-------------------------------------------------------------------------------------------------
//Función para visualizar el registro siguiente.
function registroAnterior() {
  div_notificaciones.innerHTML = ''
  //Hay semáforos
  if (semaforos.length > 0) {
    indice--
    if (indice >= 0) {
      visualiza(indice)
    } else {
      div_notificaciones.innerHTML = '<p>Es el primer registro de la lista.</p>'
      indice++
    }
  } else {
    div_notificaciones.innerHTML = '<p>No quedan registros en la lista.</p>'
  }
}

//-------------------------------------------------------------------------------------------------
//Función para modificar un registro.
function registroModificar() {
  div_notificaciones.innerHTML = ''
  try {
    let semaforo = new Semaforo(
      semaforos.length,
      iDireccion.value,
      iLatitud.value,
      iLongitud.value,
      iAveriado.value,
      iF_mantenimiento.value,
    )
    semaforos[indice] = semaforo //Actualiza la lista con las modificaciones del registro.
    div_notificaciones.innerHTML =
      '<p>El registro ha sido modificado correctamente.</p>'
  } catch (Exception) {
    div_notificaciones.innerHTML = '<p>' + Exception + '</p>'
  }
}

//-------------------------------------------------------------------------------------------------
//Función para borrar un registro.
function registroBorrar() {
  div_notificaciones.innerHTML = ''
  //Existen registros.
  if (semaforos.length > 0) {
    semaforos.splice(indice, 1) //Borra el registro.
    try {
      indice--
      visualiza(indice) //Visualiza el indice anterior.
    } catch (Exception) {
      //Si salta exception es que no existe el indice anterior.
      try {
        indice++
        visualiza(indice) //Visualiza el indice siguiente.
      } catch (Exception) {
        //Si salta exception es que tampoco existe el indice siguiente.
        div_notificaciones.innerHTML = '<p>No quedan registros en la lista.</p>'
        vaciarCampos()
      }
    }
  } else {
    div_notificaciones.innerHTML = '<p>No hay elementos que borrar.</p>'
  }
}

//-------------------------------------------------------------------------------------------------
//Función que valida los datos de un semáforo. Solo se han relizado algunas validaciones.
function validarDatos(direccion, latitud, longitud, averiado, f_mantenimiento) {
  //La dirección está vacia.
  if (direccion === '') {
    throw new Error('La dirección no puede estar vacía.')
    //La latitud no es válida.
  } else if (
    !latitud.match(/^[-]?\d+[\.]?\d*$/) ||
    latitud < -90 ||
    latitud > 90
  ) {
    throw new Error('La latitud no es válida')
    //La longitud no es válida.
  } else if (
    !longitud.match(/^[-]?\d+[\.]?\d*$/) ||
    longitud < -180 ||
    longitud > 180
  ) {
    throw new Error('La longitud no es válida')
    //Averiado no es válido.
  } else if (averiado !== 'No' && averiado !== 'Si') {
    throw new Error('El estado de averia no es válido.')
    //La fecha no puede ser anterior a la actual.
  } else {
    let fechaActual = obtenerFechaActual()
    if (
      isNaN(Date.parse(f_mantenimiento)) ||
      fechaActual.replaceAll('-', '') - f_mantenimiento.replaceAll('-', '') < 0
    ) {
      throw new Error('La fecha no es válida o es posterior a la actual.')
    }
  }
}

//--------------------------------------------------------------------------------------------------
//Función que muestra la tabla de registros de semáforos.
function mostrarTabla() {
  document.getElementById("tabla").innerHTML = "" //Inicializa el contenido de la tabla.
  //Si existen semáforos.
  if (semaforos.length > 0) {
    document.getElementById("tabla").innerHTML = '<tr><th>ID</th>' +
      '<th>DIRECCION</th>' +
      '<th>LATITUD</th>' +
      '<th>LONGITUD</th>' +
      '<th>AVERIADO</th>' +
      '<th>FECHA ULTIMO MANTENIMIENTO</th></tr>'; //Titulos de la tabla.

    //Bucle que recorre todos los registos incorporando la fila a la table del documento.
    for (i = 0; i < semaforos.length; i++) {
      let semaforo = semaforos[i]
      document.getElementById("tabla").innerHTML = document.getElementById("tabla").innerHTML +
        '<tr><td>' + semaforo.id + '</td>' +
        '<td>' + semaforo.direccion + '</td>' +
        '<td>' + semaforo.latitud + '</td>' +
        '<td>' + semaforo.longitud + '</td>' +
        '<td>' + semaforo.averiado + '</td>' +
        '<td>' + semaforo.f_mantenimiento + '</td></tr>'
    }
  }
}

//--------------------------------------------------------------------------------------------------
//Función que carga los datos por defecto.
function cargarDatosDefecto() {
  document.getElementById("tabla").innerHTML = "" //Inicializa el contenido de la tabla.
  semaforos = new Array() //Inicializa el array de semáforos.
  cargaDatosXml(datosDefecto);  //Carga datos por defecto.
}

//--------------------------------------------------------------------------------------------------
//Función que permite la carga de datos procedente de un fichero xml.
function cargarDatosFichero(evt) {
  document.getElementById("tabla").innerHTML = "" //Inicializa el contenido de la tabla.
  semaforos = new Array() //Inicializa el array de semáforos.
  let datosFichero=leerFicheroXml(evt)
  cargaDatosXml(datosFichero);  //Carga datos leídos de un fichero XML.
}

//--------------------------------------------------------------------------------------------------
//Función que realiza la lectura de un fichero XML,
function leerFicheroXml(evt) {
  //Array que contine el 
  let ficheros = evt.target.files;  //Objeto FileList con la lista de archivos seleccionados (1 si no contiene el atributo multiple el <input type="file">).
  let fichero = ficheros[0];  //Primer elemento del objeto FileList.
  //Crea el flujo de lectura.
  let reader = new FileReader();
  //Necesario para poder seleccionar otro fichero.
  evt.target.value = ''
  //Lee el fichero como texto.
  let contenido=reader.readAsText(fichero)
  return contenido
}