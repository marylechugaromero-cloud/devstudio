const mongoose = require('mongoose');

const contactoSchema = new mongoose.Schema({
  nombre: String,
  correo: String,
  telefono: String,
  servicio: String,
  mensaje: String,
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contacto', contactoSchema);