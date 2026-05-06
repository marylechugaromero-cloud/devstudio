const express    = require('express');
const mongoose   = require('mongoose');
const sgMail     = require('@sendgrid/mail');
const dotenv     = require('dotenv');
const cors       = require('cors');
const path       = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// ── Conectar a MongoDB Atlas ──
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// ── Modelo de datos ──
const ContactoSchema = new mongoose.Schema({
  nombre:   { type: String, required: true },
  correo:   { type: String, required: true },
  telefono: String,
  servicio: String,
  mensaje:  { type: String, required: true },
  fecha:    { type: Date, default: Date.now }
});
const Contacto = mongoose.model('Contacto', ContactoSchema);

// ── RUTA: recibir formulario ──
app.post('/api/contacto', async (req, res) => {
  const { nombre, correo, telefono, servicio, mensaje } = req.body;

  try {
    // 1. Guardar en MongoDB
    const nuevo = new Contacto({ nombre, correo, telefono, servicio, mensaje });
    await nuevo.save();
    console.log('💾 Guardado en MongoDB:', nombre);

    // 2. Correo al dueño
    await sgMail.send({
      to:      process.env.EMAIL_DESTINO,
      from:    process.env.EMAIL_USER,
      subject: `📩 Nuevo contacto: ${nombre}`,
      html: `
        <h2 style="color:#00e5a0">Nuevo mensaje desde la web</h2>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Correo:</b> ${correo}</p>
        <p><b>Teléfono:</b> ${telefono || 'No proporcionado'}</p>
        <p><b>Servicio:</b> ${servicio || 'No especificado'}</p>
        <p><b>Mensaje:</b><br>${mensaje}</p>
        <hr>
        <small>Enviado el ${new Date().toLocaleString('es-MX')}</small>
      `
    });

    // 3. Confirmación al cliente
    await sgMail.send({
      to:      correo,
      from:    process.env.EMAIL_USER,
      subject: '✅ Recibimos tu mensaje — DevStudio',
      html: `
        <h2>¡Hola ${nombre}! 👋</h2>
        <p>Recibimos tu mensaje correctamente.</p>
        <p>Te responderemos pronto al correo: <b>${correo}</b></p>
        <p style="color:#00e5a0"><b>DevStudio — Servicios de Programación</b></p>
      `
    });

    res.json({ ok: true, mensaje: 'Guardado y correo enviado' });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});