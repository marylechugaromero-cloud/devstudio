const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contacto = require('../../models/Contacto');

router.post('/', async (req, res) => {
  const { nombre, correo, telefono, servicio, mensaje } = req.body;

  try {
    // Guardar en MongoDB
    const nuevoContacto = new Contacto({ nombre, correo, telefono, servicio, mensaje });
    await nuevoContacto.save();

    // Enviar correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_DESTINO,
      subject: `Nuevo contacto: ${nombre}`,
      html: `
        <h3>Nuevo mensaje de contacto</h3>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Correo:</b> ${correo}</p>
        <p><b>Teléfono:</b> ${telefono}</p>
        <p><b>Servicio:</b> ${servicio}</p>
        <p><b>Mensaje:</b> ${mensaje}</p>
      `
    });

    res.status(200).json({ mensaje: 'Contacto guardado y correo enviado' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al procesar el contacto' });
  }
});

module.exports = router;