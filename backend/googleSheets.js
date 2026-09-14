require('dotenv').config();
const { google } = require('googleapis');

// ID de tu hoja de Google Sheets
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Autenticación con la cuenta de servicio mediante variables de entorno
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

// Función para agregar un registro a la hoja
async function addRegistration(nombre, correo, empresa, telefono) {
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        const fecha = new Date().toLocaleString();

        console.log('Agregando a Sheets:', [
            nombre,
            correo,
            empresa,
            telefono,
            fecha
        ]);

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A2:E',
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [[
                    nombre,
                    correo,
                    empresa,
                    telefono,
                    fecha
                ]]
            }
        });

        console.log('Registro agregado correctamente ✅');

    } catch (error) {
        console.error('Error agregando registro en Sheets:', error);
        throw error;
    }
}

// Función para probar la conexión con Google Sheets
async function testConnection() {
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A1:E1'
        });

        console.log('Datos actuales en la hoja:', response.data.values);

    } catch (error) {
        console.error('Error probando conexión con Sheets:', error);
        throw error;
    }
}

module.exports = {
    addRegistration,
    testConnection
};
