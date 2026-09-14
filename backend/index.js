require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const { addRegistration } = require('./googleSheets');
const { sendConfirmationEmail } = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos del frontend
app.use(express.static(path.join(__dirname, '..')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Ruta de registro
app.post('/register', async (req, res) => {
    const { nombre, correo, empresa, telefono } = req.body;

    console.log('Datos recibidos:', req.body);

    try {
        await addRegistration(nombre, correo, empresa, telefono);
        await sendConfirmationEmail(nombre, correo);

        res.json({
            success: true,
            message: 'Formulario registrado y correo enviado ✅'
        });

    } catch (error) {
        console.error(
            'Error registrando en Sheets o enviando correo:',
            error
        );

        res.status(500).json({
            success: false,
            message: 'Error al registrar formulario'
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

