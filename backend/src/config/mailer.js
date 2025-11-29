// src/config/mailer.js
import nodemailer from 'nodemailer';
import env from '../env.js';

const { smtp, nodeEnv } = env;
const isDev = nodeEnv !== 'production';

export const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: smtp.port === 465,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
  // ⚠ SOLO para desarrollo
  tls: isDev ? { rejectUnauthorized: false } : undefined,
});

export async function verifyMailer() {
  try {
    await transporter.verify();
    console.log('✅ SMTP listo para enviar correos');
  } catch (error) {
    console.error('⚠ No se pudo verificar SMTP:', error.message);
    console.error('   (en desarrollo se puede ignorar si igual envía correos)');
  }
}
