let mapa //Referencia del mapa.
let latitud //Latitud de inicio de centrado del mapa.
let longitud //Longitud de inicio del centro del mapa.
let marcadores = new Array()

//--------------------------------------------------------------------------------------------------
//Función de inicio. Representa el mapa en el contenedor de la interfaz.
function mostrarMapa() {
  mapa = new google.maps.Map(document.getElementById('div_mapa'), {
    // En el mapa se visualiza el mapa correspondiente a esta latitud, longitud
    center: new google.maps.LatLng(latitud, longitud), //El mapa se visualiza centrado en las coordenadas de latitud y longitud pasadas como argumento
    zoom: 17, //Zoom del mapa
    draggableCursor: 'auto', //El nombre o la URL del cursor que se muestra al desplazar el mouse sobre un mapa arrastrable.
    draggingCursor: 'crosshair', //El nombre o la URL del cursor que se muestra cuando se arrastra el mapa.
    mapTypeId: google.maps.MapTypeId.SATELLITE, //Tipo de mapa.
  })

  //------------------------------------------------------------------------------------------------
  //Referencia a un icono. Define sus propiedades.
  let icono = {
    url: './images/Marcador_posicion.png', //Imagen del marcador de posición.
    scaledSize: new google.maps.Size(50, 50), //Tamaño escala.
    origin: new google.maps.Point(0, 0), //Origen imgen.
    anchor: new google.maps.Point(25, 50), //Punto de anclaje
  }

  //Si las coordenadas son válidas muestra el marcador.
  if(coordenadasValidas){
  //------------------------------------------------------------------------------------------------
  //Establece el marcador en el mapa.
  let marker = new google.maps.Marker({
    //Posiciona el marcador en la latitud y longitud deseada.
    position: new google.maps.LatLng(latitud, longitud),
    icon: icono,
    map: mapa,
    nombre: 'Localizador',
  })
  //Se añade el marcador para proceder a su borrado.
  marcadores.push(marker);
}

  //------------------------------------------------------------------------------------------------
  //Añade escuchador del evento click sobre el mapa
  google.maps.event.addListener(mapa, 'click', function (event) {
    //Dato que contiene la latitud y longitud del punto donde se ha hecho click.
    let dato_latitud_longitud = event.latLng
    //console.log(dato_latitud_longitud)
    leerDireccion(dato_latitud_longitud)

    //----------------------------------------------------------------------------------------------
    //Establece el marcador en el mapa.
    marker = new google.maps.Marker({
      position: event.latLng,
      icon: icono,
      map: mapa,
      nombre: 'Localizador',
    })

    //Borra los marcadores que ya estaban en el mapa.
    borrarMarcadores()
    //Añade marcador al array de marcadores.
    marcadores.push(marker)
    //Lectura de la direccion.
    //console.log(dato_latitud_longitud)
    leerDireccion(dato_latitud_longitud)
  })
}

//--------------------------------------------------------------------------------------------------
// Obtiene la dirección, longitud y latitud correspondiente al punto donde se ha hecho clic y los muestra en la interfaz.
function leerDireccion(latlng) {
  //Crea objeto Geocoder.
  //La API de Geocoding de Google nos provee de dos servicios fundamentales:
  //Nos permite convertir direcciones como Calle de la Plata 25, 28021 Madrid en unas coordenadas geográficas de latitud y longitud (40.3487, -3.7056) que podemos usar, por ejemplo, para marcar un punto concreto de un mapa.
  //El servicio inverso, es decir, dadas unas coordenadas geográficas obtener la dirección de calle, número, … a la que corresponde (Geocoding inverso).
  let geocoder = new google.maps.Geocoder()
  //Si la latitud y longitud no son nulas.
  if (latlng != null) {
    geocoder.geocode({ latLng: latlng }, function (results, status) {
      //Si el status del objeto geocoder es OK.
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          //Mostramos la dirección
          mostrarDireccion(latlng, results[0].formatted_address)
        } else {
          alert('Resultado no encontrado.')
        }
      } else {
        alert('El geocodificador falló debido a:' + status)
      }
    })
  }
}

//--------------------------------------------------------------------------------------------------
//Función que muestra la dirección en la interfaz.
function mostrarDireccion(latlng, direccion) {
  iDireccion.value = direccion
  iLatitud.value = latlng.lat()
  iLongitud.value = latlng.lng()
}

//--------------------------------------------------------------------------------------------------
//Función que realiza el borrado de los marcadores. Para poder borrar los marcadores es necesario almacenarlos en un array.
function borrarMarcadores() {
  // Elimina los marcadores de una consulta anterior
  for (var i = 0; i < marcadores.length; i++) {
    marcadores[i].setMap(null)
  }
  marcadores = new Array() //Crea una nueva referancia.
}

//--------------------------------------------------------------------------------------------------
//Llamada a la función que muestra el mapa.
//mostrarMapa() //Muestra el mapa.
