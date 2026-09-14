require('dotenv').config();

async function sendConfirmationEmail(nombre, correo) {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: correo,
            subject: 'Confirmación de registro al webinar',
            text: `Hola ${nombre},

Tu registro al webinar ha sido recibido correctamente.

¡Gracias por registrarte!

Saludos.`
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('Error enviando correo con Resend:', data);
        throw new Error(data.message || 'Error enviando correo');
    }

    console.log(`Correo de confirmación enviado a: ${correo}`);
    return data;
}

module.exports = {
    sendConfirmationEmail
};