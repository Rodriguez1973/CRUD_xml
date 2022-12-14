/*Proyecto realizado por: José A. Rodríguez López-->
Fecha: 05/11/2022
*/

let semaforos = new Array() //Crea un array para registrar los semáforos.
let indice //Lleva el indice del array del objeto que estamos visualizando en la interfaz.
let coordenadasValidas = true //Flag para controlar si las coordenadas son válidas con el fin de poner el marcador en el mapa.
let grabar = false //Flag que controla si bNuevo ha cambiado a grabar.

//-------------------------------------------------------------------------------------------------
//Cuando finaliza la carga del documento se cargan los datos por defecto (datos.js).
window.onload = () => {
  cargaDatosXml(datosDefecto)
}

//-------------------------------------------------------------------------------------------------
//Se crean varias referencias de los objetos del formulario.
const bNuevo = document.getElementById('guardar')
const bSiguiente = document.getElementById('siguiente')
const bAnterior = document.getElementById('anterior')
const bModificar = document.getElementById('modificar')
const bBorrar = document.getElementById('borrar')
const bTabla = document.getElementById('mostrar_tabla')
const bDatos_defecto = document.getElementById('datos_defecto')
const bFichero = document.getElementById('datos_fichero')
const iDireccion = document.getElementById('iDireccion')
const iLatitud = document.getElementById('iLatitud')
const iLongitud = document.getElementById('iLongitud')
const iAveriado = document.getElementById('iAveriado')
const iF_mantenimiento = document.getElementById('iF_mantenimiento')

//-------------------------------------------------------------------------------------------------
//Definición de eventos de los objetos.
bNuevo.addEventListener('click', guardarRegistro, false) //Evento click al pulsar botón crear.
bSiguiente.addEventListener('click', registroSiguiente, false) //Evento click al pulsar botón siguiente.
bAnterior.addEventListener('click', registroAnterior, false) //Evento click al pulsar botón anterior.
bModificar.addEventListener('click', registroModificar, false) //Evento click al pulsar el botón modificar.
bBorrar.addEventListener('click', registroBorrar, false) //Evento click al pulsar el botón borrar.
bTabla.addEventListener('click', mostrarTabla, false) //Evento click al pulsar el botón mostrar tabla.
bDatos_defecto.addEventListener('click', cargarDatosDefecto, false) //Evento click al pulsar el botón datos por defecto.
bFichero.addEventListener('change', cargarDatosFichero, false) //Evento click al pulsar el botón elegir fichero.
iDireccion.addEventListener(
  'click',
  () => {
    iDireccion.select()
  },
  false,
) //Selecciona todo el contenido de iDireccion al hacer click.
iLatitud.addEventListener(
  'click',
  () => {
    iLatitud.select()
  },
  false,
) //Selecciona todo el contenido de iLatitud al hacer click.
iLongitud.addEventListener(
  'click',
  () => {
    iLongitud.select()
  },
  false,
) //Selecciona todo el contenido de iLongitud al hacer click.

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
      //Crea un semáforo.
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
    latitud = semaforos[0].latitud //Latitud de inicio de centrado del mapa.
    longitud = semaforos[0].longitud //Longitud de inicio de centrado del mapa.
    notificar("Datos cargados correctamente")
    visualiza(indice)
  } catch (Exception) {
    indice = 0
    vaciarCampos()
    div_notificaciones.innerHTML ='<p>Los datos no se han cargado. Son erroneos o no existen.</p>'
    desactivaBotones()
    notificar("Los datos no se han cargado. Son erroneos o no existen.")
  }
}

//-------------------------------------------------------------------------------------------------
//Función que vacía los campos si no se han leído datos.
function vaciarCampos() {
  inicilizarEntradas()
  latitud = 41.670141205551865 //Latitud de inicio de centrado del mapa.
  longitud = -3.689933230224045 //Longitud de inicio de centrado del mapa.
  coordenadasValidas = false //Cambia flag para que no muestre el marcador en el mapa.
  mostrarMapa() //Muestra el mapa centrado en las coordenadas por defecto.
  coordenadasValidas = true //Restablece el marcador en el mapa.
}

//-------------------------------------------------------------------------------------------------
//Función que muestra un número de registro pasado como argumento en la interfaz.
function visualiza(numRegistro) {
  iDireccion.value = semaforos[numRegistro].direccion
  iLatitud.value = semaforos[numRegistro].latitud
  iLongitud.value = semaforos[numRegistro].longitud
  iAveriado.value = semaforos[numRegistro].averiado
  iF_mantenimiento.value = semaforos[numRegistro].f_mantenimiento
  latitud = semaforos[numRegistro].latitud //Latitud de inicio de centrado del mapa.
  longitud = semaforos[numRegistro].longitud //Longitud de inicio de centrado del mapa.
  mostrarMapa() //Muestra el mapa centrado en las coordenadas de ese registro..
}

//-------------------------------------------------------------------------------------------------
//Función que crea un nuevo registro de un semáforo.
function guardarRegistro() {
  borrarNotificaciones()
  borradoTabla()
  //Si no ha cambiado a grabar.
  if (!grabar) {
    bModificar.disabled = true
    bBorrar.disabled = true
    bTabla.disabled = true
    grabar = true
    bNuevo.value = 'Guardar'
    vaciarCampos()
  } else {
    //Grabando.
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
      div_notificaciones.innerHTML =
        '<p>El registro se ha guardado correctamente.</p>'
      visualiza(indice)
      cambiarNuevo()
    } catch (Exception) {
      div_notificaciones.innerHTML = '<p>' + Exception + '</p>'
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
  borrarNotificaciones()
  borradoTabla()
  if (grabar) {
    //Si está grabando vuelve al indice que estaba previamente.
    cambiarNuevo()
    visualiza(indice)
  } else {
    //Hay semáforos
    if (semaforos.length > 0) {
      indice++
      if (indice < semaforos.length) {
        visualiza(indice)
      } else {
        div_notificaciones.innerHTML =
          '<p>Es el último registro de la lista.</p>'
        indice--
        visualiza(indice)
      }
    } else {
      div_notificaciones.innerHTML = '<p>No quedan registros en la lista.</p>'
    }
  }
}

//-------------------------------------------------------------------------------------------------
//Función para visualizar el registro siguiente.
function registroAnterior() {
  borrarNotificaciones()
  borradoTabla()
  if (grabar) {
    //Si está grabando vuelve al indice que estaba previamente.
    cambiarNuevo()
    visualiza(indice)
  } else {
    //Hay semáforos
    if (semaforos.length > 0) {
      indice--
      if (indice >= 0) {
        visualiza(indice)
      } else {
        div_notificaciones.innerHTML =
          '<p>Es el primer registro de la lista.</p>'
        indice++
        visualiza(indice)
      }
    } else {
      div_notificaciones.innerHTML = '<p>No quedan registros en la lista.</p>'
    }
  }
}

//-------------------------------------------------------------------------------------------------
//Función para modificar un registro.
function registroModificar() {
  borrarNotificaciones()
  borradoTabla()
  try {
    let semaforo = new Semaforo(
      semaforos[indice].id,
      iDireccion.value,
      iLatitud.value,
      iLongitud.value,
      iAveriado.value,
      iF_mantenimiento.value,
    )
    semaforos[indice] = semaforo //Actualiza la lista con las modificaciones del registro.
    div_notificaciones.innerHTML =
      '<p>El registro ha sido modificado correctamente.</p>'
    visualiza(indice)
  } catch (Exception) {
    div_notificaciones.innerHTML = '<p>' + Exception + '</p>'
  }
}

//-------------------------------------------------------------------------------------------------
//Función para borrar un registro.
function registroBorrar() {
  borrarNotificaciones()
  borradoTabla()
  semaforos.splice(indice, 1) //Borra el registro.
  try {
    indice--
    visualiza(indice) //Visualiza el indice anterior.
    div_notificaciones.innerHTML = '<p>Registro borrado correctamente.</p>'
  } catch (Exception) {
    //Si salta exception es que no existe el indice anterior.
    try {
      indice++
      visualiza(indice) //Visualiza el indice siguiente.
      div_notificaciones.innerHTML = '<p>Registro borrado correctamente.</p>'
    } catch (Exception) {
      //Si salta exception es que tampoco existe el indice siguiente.
      div_notificaciones.innerHTML =
        '<p>Registro borrado correctamente. No quedan registros en la lista.</p>'
      vaciarCampos()
      desactivaBotones()
    }
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
  borrarNotificaciones()
  borradoTabla()
  //Si existen semáforos.
  if (semaforos.length > 0) {
    document.getElementById('tabla').innerHTML =
      '<tr><th>ID</th>' +
      '<th>DIRECCION</th>' +
      '<th>LATITUD</th>' +
      '<th>LONGITUD</th>' +
      '<th>AVERIADO</th>' +
      '<th>FECHA ULTIMO MANTENIMIENTO</th></tr>' //Titulos de la tabla.

    //Bucle que recorre todos los registos incorporando la fila a la table del documento.
    for (i = 0; i < semaforos.length; i++) {
      let semaforo = semaforos[i]
      document.getElementById('tabla').innerHTML =
        document.getElementById('tabla').innerHTML +
        '<tr><td>' +
        semaforo.id +
        '</td>' +
        '<td>' +
        semaforo.direccion +
        '</td>' +
        '<td>' +
        semaforo.latitud +
        '</td>' +
        '<td>' +
        semaforo.longitud +
        '</td>' +
        '<td>' +
        semaforo.averiado +
        '</td>' +
        '<td>' +
        semaforo.f_mantenimiento +
        '</td></tr>'
    }
  } else {
    div_notificaciones.innerHTML =
      '<p>No hay elementos que mostrar en la tabla.</p>'
  }
}

//--------------------------------------------------------------------------------------------------
//Función que carga los datos por defecto.
function cargarDatosDefecto() {
  cambiarNuevo()
  borrarNotificaciones()
  borradoTabla()
  semaforos = new Array() //Inicializa el array de semáforos.
  cargaDatosXml(datosDefecto) //Carga datos por defecto.
}

//--------------------------------------------------------------------------------------------------
//Función que permite la carga de datos procedente de un fichero xml.
function cargarDatosFichero(evt) {
  cambiarNuevo()
  borrarNotificaciones()
  borradoTabla()
  semaforos = new Array() //Inicializa el array de semáforos.
  let ficheros = evt.target.files //Objeto FileList con la lista de archivos seleccionados (1 si no contiene el atributo multiple el <input type="file">).
  let fichero = ficheros[0] //Primer elemento del objeto FileList.
  //Crea el flujo de lectura.
  let reader = new FileReader()
  //Necesario para poder seleccionar otro fichero. Elimina el valor de los archivos seleccionados.
  evt.target.value = ''

  //Añade el evento load al flujo de lectura que se produce cuando el archivo ha sido leído.
  reader.addEventListener(
    'loadend',
    () => {
      cargaDatosXml(reader.result) //Carga los datos leídos en formato texto.
    },
    false,
  )

  //Lee el fichero como texto.
  reader.readAsText(fichero)
}

//--------------------------------------------------------------------------------------------------
//Función que realiza el borrado del area de notificaciones.
function borrarNotificaciones() {
  div_notificaciones.innerHTML = ''
}

//--------------------------------------------------------------------------------------------------
//Fúnción que realiza el borrado de la tabla.
function borradoTabla() {
  document.getElementById('tabla').innerHTML = '' //Inicializa el contenido de la tabla.
}

//--------------------------------------------------------------------------------------------------
//Función que iniciliza bNuevo a su estado inicial.
function cambiarNuevo() {
  bNuevo.value = 'Nuevo'
  grabar = false
  bSiguiente.disabled = false
    bAnterior.disabled = false
  bModificar.disabled = false
  bBorrar.disabled = false
  bTabla.disabled = false
}

//--------------------------------------------------------------------------------------------------
//Función que iniciliza los datos de entrada.
function inicilizarEntradas() {
  iDireccion.value = ''
  iLatitud.value = ''
  iLongitud.value = ''
  iAveriado.value = 'No'
  iF_mantenimiento.value = obtenerFechaActual()
}

//--------------------------------------------------------------------------------------------------
//Función que desactiva todos los botones menos nuevo si no hay registros.
function desactivaBotones() {
  //Si hay registros en la lista.
  if (semaforos.length <= 0) {
    bSiguiente.disabled = true
    bAnterior.disabled = true
  }
  bModificar.disabled = true
  bBorrar.disabled = true
  bTabla.disabled = true
}