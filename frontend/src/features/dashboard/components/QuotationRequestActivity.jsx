import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM UTILS METHOD
import { useChartOptions } from '@shared/hooks/useChartOptions';

export default function QuotationRequestActivity() {
  const theme = useTheme();

  // CANTIDADES REALES (no porcentajes)
  const series = [25, 40, 20, 17];  
  //     Pend   Fin   Rev   Rech

  const labels = ['PENDIENTE', 'FINALIZADA', 'REVISADA', 'RECHAZADA'];

  const options = useChartOptions({
    labels,
    colors: [
      theme.palette.warning.main, // PENDIENTE
      theme.palette.info.main,    // FINALIZADA
      theme.palette.success.main, // REVISADA
      theme.palette.error.main,   // RECHAZADA
    ],

    stroke: { width: 0 },

    dataLabels: {
      enabled: true,
      formatter: val => `${val.toFixed(1)}%`, // % dentro del pie
      style: {
        fontSize: '12px',
        fontWeight: 600,
      },
    },

    legend: {
      offsetY: 12,
      show: true,
      fontSize: '13px',
      position: 'bottom',
      itemMargin: { horizontal: 12 },
      onItemClick: { toggleDataSeries: false },
      onItemHover: { highlightDataSeries: false },

 
  
    },

 
  });

  return (
    <Card className="p-3 h-full">
      <Typography
        variant="h6"
        sx={{ mb: 3, textAlign: 'center' }}
      >
        Solicitudes de Cotización por Estado
      </Typography>

      <Chart type="pie" height={265} series={series} options={options} />
    </Card>
  );
}
