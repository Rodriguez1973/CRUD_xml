document.addEventListener(
  'DOMContentLoad',
  function () {
    if (!Notification) {
      alert('No soportado Notificaciones en este navegador')
      return
    }
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    }
  },
  false,
)

function notificar(mensaje) {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission()
  } else {
    var notificacion = new Notification('CRUD XML', {
      icon: './images/Icono_CRUD.jpg',
      body: mensaje,
    })
    notificacion.onclick = function () {
      window.open('http://www.fpsantacatalina.com/cifpweb/')
    }
  }
}
