import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';

import { Scrollbar } from '@/shared/components/scrollbar';

import { BodyTableCell, HeadTableCell } from '../../../shared/components/table';

export const TOP_SERVICIOS_ACEPTADOS = [
  { id: 1,  servicio: 'Granulometría por tamizado',                      aceptadas: 18, variacion: +8,  color: 'success.main' },
  { id: 2,  servicio: 'Límites de Atterberg (LL, LP)',                 aceptadas: 22, variacion: +5,  color: 'success.main' },
  { id: 3,  servicio: 'Proctor Modificado',                            aceptadas: 30, variacion: +12, color: 'success.main' },
  { id: 4,  servicio: 'Densidad "in situ" método de arena',           aceptadas: 14, variacion: -2,  color: 'success.main' },
  { id: 5,  servicio: 'Densidad “in situ” método nuclear',            aceptadas: 11, variacion: +4,  color: 'success.main' },
  { id: 6,  servicio: 'CBR – Índice de soporte California',           aceptadas: 27, variacion: +10, color: 'success.main' },
  { id: 7,  servicio: 'Ensayo de compresión de probetas de hormigón', aceptadas: 35, variacion: +6,  color: 'success.main' },
 
];



export default function TopQuotationServiceAccept() {
  return (
    <Card sx={{ padding: 3, pb: 1 }}>
      <Box mb={3}>
        <Typography variant="body2" fontSize={18} fontWeight={500}>
          Top Servicios Aceptados
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Últimos 30 días
        </Typography>
      </Box>

      <Scrollbar>
        <Table sx={{ minWidth: 470 }}>
          <TableHead>
            <TableRow>
              <HeadTableCell>SERVICIO</HeadTableCell>
              <HeadTableCell>CANTIDAD</HeadTableCell>
              <HeadTableCell align="center">VARIACIÓN</HeadTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {TOP_SERVICIOS_ACEPTADOS.map(item => (
              <TableRow key={item.id}>
                <BodyTableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {item.servicio}
                  </Typography>
                </BodyTableCell>

                <BodyTableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {item.aceptadas}
                  </Typography>
                </BodyTableCell>

                <BodyTableCell align="center">
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{
                      color: item.variacion > 0 ? 'success.main' : 'error.main',
                    }}
                  >
                    {item.variacion > 0 && '+'}
                    {item.variacion}%
                  </Typography>
                </BodyTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}