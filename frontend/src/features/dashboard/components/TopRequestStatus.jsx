import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';

import { Scrollbar } from '@shared/components/scrollbar';
 
import { BodyTableCell, HeadTableCell } from '../../../shared/components/table';


export const TOP_REQUEST_STATUS = [
  {
    id: 1,
    estado: 'PENDIENTE',
    cantidad: 42,
    variacion: -10,     // bajaron 10
    color: 'warning.main'
  },
  {
    id: 2,
    estado: 'RECHAZADA',
    cantidad: 15,
    variacion: 3,       // aumentaron 3
    color: 'error.main'
  },
  {
    id: 3,
    estado: 'REVISADA',
    cantidad: 58,
    variacion: 8,        // +8
    color: 'success.main'
  },
  {
    id: 4,
    estado: 'FINALIZADA',
    cantidad: 33,
    variacion: 12,       // +12
    color: 'info.main'
  }
  
];


export default function TopRequestStatus() {
  return (
    <Card sx={{ padding: 3, pb: 1 }}>
      <Box mb={3}>
        <Typography variant="body2" fontSize={18} fontWeight={500}>
          Top Estados de Solicitudes
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Últimos 30 días
        </Typography>
      </Box>

      <Scrollbar>
        <Table sx={{ minWidth: 470 }}>
          <TableHead>
            <TableRow>
              <HeadTableCell>ESTADO</HeadTableCell>
              <HeadTableCell>CANTIDAD</HeadTableCell>
              <HeadTableCell align="center">VARIACIÓN</HeadTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {TOP_REQUEST_STATUS.map(item => (
              <TableRow key={item.id}>
                <BodyTableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {item.estado}
                  </Typography>
                </BodyTableCell>

                <BodyTableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {item.cantidad}
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
