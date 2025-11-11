import { Box, Grid, Paper, Typography, Divider } from '@mui/material';

export default function DashboardPage() {
  return (
    <Box sx={{ p: 2 }}>
      {/* Título */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Panel General
      </Typography>

      {/* Subtítulo */}
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Resumen de actividad del sistema
      </Typography>

      {/* Contenido principal */}
      <Grid container spacing={2}>
        {/* Card 1 */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid rgba(148,163,253,0.08)',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Ventas de hoy
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              $1.250.000
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ color: 'success.main' }}>
              +12% respecto a ayer
            </Typography>
          </Paper>
        </Grid>

        {/* Card 2 */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid rgba(148,163,253,0.08)',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Revisiones activas
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              23
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ color: 'warning.main' }}>
              5 en curso · 18 finalizadas
            </Typography>
          </Paper>
        </Grid>

        {/* Card 3 */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid rgba(148,163,253,0.08)',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Clientes registrados
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              145
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ color: 'info.main' }}>
              +8 nuevos esta semana
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Sección inferior */}
      <Paper
        elevation={3}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid rgba(148,163,253,0.08)',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Últimos movimientos
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Aquí puedes integrar una tabla o gráfico con tus datos en tiempo real.
        </Typography>
      </Paper>
    </Box>
  );
}
