// src/services/emailService.js
import { transporter } from '../config/mailer.js';
import env from '../env.js';

export async function sendEmail({ to, subject, html, text }) {
  const fromName = env.smtp.fromName;
  const fromEmail = env.smtp.fromEmail || env.smtp.user;

  if (!fromEmail) {
    throw new Error('SMTP_FROM_EMAIL o SMTP_USER no está configurado');
  }

  return transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    text,
    html,
  });
}
