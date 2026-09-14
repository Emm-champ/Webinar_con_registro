const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { addRegistration } = require('./googleSheets'); // <- Importamos módulo
const { sendConfirmationEmail } = require('./mailer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Servidor backend funcionando ✅');
});

app.post('/register', async (req, res) => {
    const { nombre, correo, empresa, telefono } = req.body;

    console.log('Datos recibidos:', req.body);

    try {
        // Guardar en Google Sheets
        await addRegistration(nombre, correo, empresa, telefono);

        // Enviar correo de confirmación
        await sendConfirmationEmail(nombre, correo);

        // Responder al frontend
        res.json({ success: true, message: 'Formulario registrado y correo enviado ✅' });
    } catch (error) {
        console.error('Error registrando en Sheets o enviando correo:', error);
        res.status(500).json({ success: false, message: 'Error al registrar formulario' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
