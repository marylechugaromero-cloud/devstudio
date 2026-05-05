async function enviarFormulario() {
  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const telefono = document.getElementById('telefono').value;
  const servicio = document.getElementById('servicio').value;
  const mensaje = document.getElementById('mensaje').value;

  if (!nombre || !correo || !mensaje) {
    alert("Completa los campos obligatorios");
    return;
  }

  try {
    const res = await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, telefono, servicio, mensaje })
    });

    const data = await res.json();

    if (data.ok) {
      alert("Mensaje enviado correctamente");
    } else {
      alert("Error al enviar");
    }

  } catch (error) {
    alert("Error del servidor");
  }
}