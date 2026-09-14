// googleSheets.js
const { google } = require('googleapis');
const path = require('path');

// Ruta a tu archivo de credenciales JSON
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

// ID de tu hoja de Google Sheets
const SPREADSHEET_ID = '1HNAfn66nd6BX1kARe4mRDTzyIyvt1NxKdeflmAv3iSI'; // <-- reemplaza con el ID de tu hoja

// Autenticación con la cuenta de servicio
const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

// Función para agregar un registro a la hoja
async function addRegistration(nombre, correo, empresa, telefono) {
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        const fecha = new Date().toLocaleString();

        console.log('Agregando a Sheets:', [nombre, correo, empresa, telefono, fecha]);

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A2:E',              // fila 2 en adelante, debajo de encabezados
            valueInputOption: 'RAW',    // escribe tal cual lo envías
            insertDataOption: 'INSERT_ROWS', // agrega nuevas filas
            resource: {
                values: [[nombre, correo, empresa, telefono, fecha]]
            }
        });

        console.log('Registro agregado correctamente ✅');
    } catch (error) {
        console.error('Error agregando registro en Sheets:', error);
    }
}

// Función opcional para probar conexión y ver encabezados
async function testConnection() {
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A1:E1', // encabezados
        });

        console.log('Datos actuales en la hoja:', response.data.values);
    } catch (error) {
        console.error('Error probando conexión con Sheets:', error);
    }
}

// Exportamos la función
module.exports = { addRegistration, testConnection };
