/*Proyecto realizado por: José A. Rodríguez López-->
Fecha: 05/11/2022
*/

const semaforos = new Array();    //Crea un array para registrar los semáforos.
let indice;   //Lleva el indice del array del objeto que estamos visualizando en la interfaz.

//Flags de estados.
let grabando = false;   //Flag de estado. Si está a true esta disponible la opción de guardar, a false la de nuevo.

//-------------------------------------------------------------------------------------------------
//Cuando finaliza la carga del documento se cargan los datos por defecto (datos.js).
window.onload = () => {
    cargaDatosXml(datosFichero);
}

//-------------------------------------------------------------------------------------------------
//Se cren las referencias de los objetos del formulario.
const bNuevo = document.getElementById("nuevo");
const bSiguiente = document.getElementById("siguiente");
const bAnterior = document.getElementById("anterior");
const bModificar = document.getElementById("modificar");
const bBorrar = document.getElementById("borrar");
const bTabla = document.getElementById("mostrar_tabla");
const bDatos_defecto = document.getElementById("datos_defecto");
const bFichero = document.getElementById("datos_fichero");
const iAveriado = document.getElementById("averiado");
const iF_mantenimiento = document.getElementById("f_mantenimiento");

//-------------------------------------------------------------------------------------------------
//Definición de eventos de los objetos.
bNuevo.addEventListener("click", crearRegistro, false);  //Evento click al pulsar botón crear.
bSiguiente.addEventListener("click", registroSiguiente, false) //Evento click al pulsar botón siguiente.
bAnterior.addEventListener("click", registroAnterior, false) //Evento click al pulsar botón anterior.
bModificar.addEventListener("click", registroModificar, false) //Evento click al pulsar el botón modificar.
bBorrar.addEventListener("click", registroBorrar, false) //Evento click al pulsar el botón borrar.

//-------------------------------------------------------------------------------------------------
//Clase que modela los objetos de tipo semáforo.
class Semaforo {
    //Constructor de objetos tipo semáforo.    
    constructor(id, direccion, latitud, longitud, averiado, f_mantenimiento) {
        this.id = id
        this.direccion = direccion;
        this.latitud = latitud;
        this.longitud = longitud;
        this.averiado = averiado;
        this.f_mantenimiento = f_mantenimiento;
    }

    //Metodo que muestra un registro en la interfaz.
    mostrarRegistro() {
        direccion.value = this.direccion;
        latitud.value = this.latitud;
        longitud.value = this.longitud;
        iAveriado.value = this.averiado;
        iF_mantenimiento.value = this.f_mantenimiento;
    }
}

//-------------------------------------------------------------------------------------------------
//Función que realiza la carga de los datos XML.
function cargaDatosXml(datos) {
    //Creación de un objeto que provee la capacidad de analizar el código fuente XML o HTML de una cadena en un documento DOM.
    let codigo = new DOMParser();
    try {
        //Analiza la cadena mediante el analizador XML y devuelve el documento resultante.
        let myXml = codigo.parseFromString(datos, "text/xml");

        //Arrays que contendrán los datos de cada etiqueta por cada uno de los semáforos 
        let aDireccion = new Array();
        let aLatitud = new Array();
        let aLongitud = new Array();
        let aAveriado = new Array();
        let aF_mantenimiento = new Array();

        //Rellenas los arrays en función del tipo de etiqueta XML.
        aDireccion = myXml.getElementsByTagName("direccion");;
        aLatitud = myXml.getElementsByTagName("latitud");
        aLongitud = myXml.getElementsByTagName("longitud");
        aAveriado = myXml.getElementsByTagName("averiado")
        aF_mantenimiento = myXml.getElementsByTagName("f_mantenimiento")

        //Bucle para la creación de cada semáforo en funcion de los datos leídos
        for (var index = 0; index < aDireccion.length; index++) {
            //Cre
            let semaforo = new Semaforo(index,
                aDireccion.item(index).firstChild.nodeValue,
                aLatitud.item(index).firstChild.nodeValue,
                aLongitud.item(index).firstChild.nodeValue,
                aAveriado.item(index).firstChild.nodeValue,
                aF_mantenimiento.item(index).firstChild.nodeValue);

            semaforos.push(semaforo)

        }

        //Inicializa el indice de visualización.
        indice = 0;
        //Muestra el indice 0 en la interfaz.
        visualiza(indice);
    } catch (Exception) {
        indice = 0;
        vaciarCampos();
        notificaciones.innerHTML = "<p>Los datos no se han cargado. Son erroneos o no existen</p>"
    }
}

//-------------------------------------------------------------------------------------------------
//Función que vacía los campos si no se han leído datos.
function vaciarCampos() {
    direccion.value = "";
    latitud.value = "";
    longitud.value = "";
    iAveriado.value = "No";
    estableceFechaActual();
}

//-------------------------------------------------------------------------------------------------
//Función que muestra un número de registro pasado como argumento en la interfaz.
function visualiza(numRegistro) {
    direccion.value = semaforos[numRegistro].direccion;
    latitud.value = semaforos[numRegistro].latitud;
    longitud.value = semaforos[numRegistro].longitud;
    iAveriado.value = semaforos[numRegistro].averiado;
    iF_mantenimiento.value = semaforos[numRegistro].f_mantenimiento;
}

//-------------------------------------------------------------------------------------------------
//Función que crea un nuevo registro de un semáforo.
function crearRegistro() {
    notificaciones.innerHTML = ""
    if (grabando === false) {
        grabando = true;
        vaciarCampos();
        bNuevo.value = "Grabar";
    } else {
        try {
            //Crea semáforo.
            let semaforo = new Semaforo(semaforos.length, direccion.value, latitud.value, longitud.value, averiado.value, f_mantenimiento.value)
            //Añade el semáforo al array.
            semaforos.push(semaforo)
            //Actualiza el indice del elemento que estamos visualizando.
            indice = semaforos.length - 1;
            console.log(semaforo)
        } catch (Exception) {
            notificaciones.innerHTML = "<p>" + Exception + "</p>"
        }
        bNuevo.value = "Nuevo";
        grabando = false
    }
}

//-------------------------------------------------------------------------------------------------
//Función para establecer la fecha actual.
function estableceFechaActual() {
    let fecha = new Date(); //Fecha actual
    let mes = fecha.getMonth() + 1; //Obtiene el mes
    let dia = fecha.getDate(); //Obtiene el día.
    let ano = fecha.getFullYear(); //Obtiene el año.
    if (dia < 10)
        dia = '0' + dia; //Agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes //Agrega cero si el menor de 10
    iF_mantenimiento.value = ano + "-" + mes + "-" + dia;
}

//-------------------------------------------------------------------------------------------------
//Función para visualizar el registro siguiente.
function registroSiguiente() {
    notificaciones.innerHTML = ""
    //Hay semáforos
    if (semaforos.length > 0) {
        indice++;
        if (indice < semaforos.length) {
            visualiza(indice);
        } else {
            notificaciones.innerHTML = "<p>Es el último registro de la lista.</p>"
            indice--;
        }
    } else {
        notificaciones.innerHTML = "<p>No quedan registros en la lista.</p>"
    }
}

//-------------------------------------------------------------------------------------------------
//Función para visualizar el registro siguiente.
function registroAnterior() {
    notificaciones.innerHTML = ""
    //Hay semáforos
    if (semaforos.length > 0) {
        indice--;
        if (indice >= 0) {
            visualiza(indice);
        } else {
            notificaciones.innerHTML = "<p>Es el primer registro de la lista.</p>"
            indice++;
        }
    } else {
        notificaciones.innerHTML = "<p>No quedan registros en la lista.</p>"
    }
}

//-------------------------------------------------------------------------------------------------
//Función para modificar un registro.
function registroModificar() {
    notificaciones.innerHTML = ""
    try {
        let semaforo = new Semaforo(semaforos.length, direccion.value, latitud.value, longitud.value, averiado.value, f_mantenimiento.value)
        semaforos[indice] = semaforo; //Actualiza la lista con las modificaciones del registro.
        notificaciones.innerHTML = "<p>El registro ha sido modificado correctamente.</p>"
    } catch (Exception) {
        notificaciones.innerHTML = "<p>" + Exception + "</p>"
    }
}

//-------------------------------------------------------------------------------------------------
//Función para borrar un registro.
function registroBorrar() {
    notificaciones.innerHTML = ""
    //Existen registros.
    if (semaforos.length > 0) {
        semaforos.splice(indice, 1);  //Borra el registro.
        try {
            indice--
            visualiza(indice);  //Visualiza el indice anterior.
        } catch (Exception) { //Si salta exception es que no existe el indice anterior.
            try {
                indice++
                visualiza(indice);  //Visualiza el indice siguiente.
            } catch (Exception) {  //Si salta exception es que tampoco existe el indice siguiente.
                notificaciones.innerHTML = "<p>No quedan registros en la lista.</p>"
                vaciarCampos();
            }
        }
    } else {
        notificaciones.innerHTML = "<p>No hay elementos que borrar.</p>"
    }
}
