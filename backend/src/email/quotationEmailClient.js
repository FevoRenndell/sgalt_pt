export function quotationCreatedTemplate({ recipientName, url, quotation }) {

  const folio = quotation?.quotation?.id;
  const companyName = quotation?.request?.company_name || quotation?.request?.razon_social || '';
  const statusLabel = quotation?.quotation?.status || 'CREADA';
  const createdAt = quotation?.quotation?.created_at;
  const subtotal = quotation?.quotation?.subtotal ?? '-';
  const discount = quotation?.quotation?.discount ?? 0;
  const total = quotation?.quotation?.total ?? '-';

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Cotización ${folio}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body style="margin:0; padding:0; background-color:#FFFFFF; font-family:Arial, sans-serif;">

        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FFFFFF; padding:32px 0;">
          <tr>
            <td align="center">

              <table border="0" cellpadding="0" cellspacing="0" width="640" 
                     style="
                       background-color:#020617;
                       border-radius:16px;
                       overflow:hidden;
                       box-shadow:0px 4px 20px rgba(0,0,0,0.15);
                     ">

                <tr>
                  <td style="padding:18px 24px; background-color:#020617; border-bottom:1px solid #111827;">
                    <table width="100%">
                      <tr>
                        <td align="left" style="color:#F9FAFB; font-size:18px; font-weight:600;">
                          <span style="
                            display:inline-block;
                            width:26px;
                            height:26px;
                            border-radius:8px;
                            background-color:#6868EB;
                            text-align:center;
                            line-height:26px;
                            font-size:16px;
                            font-weight:bold;
                            margin-right:8px;
                          ">U</span>
                          Detalle de Cotización
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 24px; color:#F9FAFB; font-size:14px; line-height:1.6;">
                    <p>Hola <strong>${recipientName}</strong>,</p>
                    <p>Tu cotización ha sido creada en nuestro sistema.</p>
                    <p>A continuación te dejamos un resumen y el enlace para revisar el detalle completo.</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 24px 20px 24px;">
                    <table width="100%" style="border-radius:12px; overflow:hidden;">

                      <tr>
                        <td style="background-color:#111827; padding:10px; color:#9CA3AF; font-size:12px;">Folio</td>
                        <td style="background-color:#111827; padding:10px; color:#9CA3AF; font-size:12px;">Empresa</td>
                        <td style="background-color:#111827; padding:10px; color:#9CA3AF; font-size:12px;">Estado</td>
                        <td style="background-color:#111827; padding:10px; color:#9CA3AF; font-size:12px;">Fecha</td>
                      </tr>

                      <tr>
                        <td style="background-color:#020617; padding:10px; color:#F9FAFB;">${folio}</td>
                        <td style="background-color:#020617; padding:10px; color:#F9FAFB;">${companyName}</td>
                        <td style="background-color:#020617; padding:10px;">
                          <span style="
                            display:inline-block;
                            padding:6px 14px;
                            background-color:#22C55E;
                            border-radius:999px;
                            font-size:11px;
                            color:#FFFFFF;
                            font-weight:600;
                            text-transform:uppercase;
                          ">
                            ${statusLabel}
                          </span>
                        </td>
                        <td style="background-color:#020617; padding:10px; color:#9CA3AF;">${createdAt}</td>
                      </tr>

                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 24px 20px 24px;">
                    <table width="100%" style="
                      background-color:#020617;
                      border-radius:12px;
                      border:1px solid #111827;
                    ">
                      <tr>
                        <td style="padding:14px; color:#E5E7EB;">

                          <p style="margin:0 0 6px 0; color:#F9FAFB; font-weight:600;">
                            Resumen de montos
                          </p>

                          <table width="100%" style="font-size:13px;">
                            <tr>
                              <td style="color:#9CA3AF;">Subtotal:</td>
                              <td align="right" style="color:#F9FAFB;">${subtotal}</td>
                            </tr>
                            <tr>
                              <td style="color:#9CA3AF;">Descuento:</td>
                              <td align="right" style="color:#F9FAFB;">${discount}</td>
                            </tr>
                            <tr>
                              <td style="color:#9CA3AF;">Total:</td>
                              <td align="right" style="color:#F9FAFB; font-weight:600;">${total}</td>
                            </tr>
                          </table>

                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:0 24px 30px 24px;">
                    <a href="${url}" style="
                      display:inline-block;
                      padding:12px 26px;
                      background-color:#6868EB;
                      color:white;
                      border-radius:999px;
                      text-decoration:none;
                      font-weight:600;
                    ">
                      Ver cotización completa
                    </a>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:14px; background-color:#020617; border-top:1px solid #111827; color:#6B7280; font-size:11px;">
                    Este correo fue generado automáticamente por el sistema de cotizaciones.
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>
  `;
}
