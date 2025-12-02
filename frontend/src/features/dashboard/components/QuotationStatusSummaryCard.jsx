import Chart from 'react-apexcharts';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { FlexBetween, FlexBox, FlexRowAlign } from '../../../shared/components/flexbox';
import { useChartOptions } from '@shared/hooks/useChartOptions';
// Ajusta la ruta según donde tengas tu helper
import { getNotificationIcon } from '../../../shared/utils/notificationIcon';
import { Divider } from '@mui/material';

// ----------------------------------------------------------------------

export const QUOTATION_STATUS_SUMMARY = [
  { id: 2, status: 'ENVIADA',   percentage: 25.0, delta: -1.3 },
  { id: 3, status: 'POR VENCER', percentage: 10.0, delta: 2.0 },
  { id: 4, status: 'ACEPTADA',  percentage: 20.0, delta: 0.8 },
  { id: 5, status: 'RECHAZADA', percentage: 10.0, delta: -3.1 },
  { id: 6, status: 'VENCIDA',   percentage: 5.0,  delta: 1.1 },
];

function ListItem({ IconNode, title, subTitle, titleStyle = {} }) {
  return (
    <FlexBox alignItems="center" gap={1.5}>
      <FlexRowAlign
        sx={(theme) => ({
          width: 40,
          height: 40,
          borderRadius: 2,
          backgroundColor: theme.palette.grey[50],
          ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.grey[700],
          }),
        })}
      >
        {IconNode}
      </FlexRowAlign>

      <div>
        <Typography variant="body1" lineHeight={1} fontWeight={600} sx={titleStyle}>
          {title}
        </Typography>

        {subTitle && (
          <Typography variant="body2" color="text.secondary">
            {subTitle}
          </Typography>
        )}
      </div>
    </FlexBox>
  );
}

// Helper para convertir 'success.main' → theme.palette.success.main
function resolvePaletteColor(theme, colorKey) {
  if (!colorKey) return theme.palette.primary.main;

  if (!colorKey.includes('.')) {
    return theme.palette[colorKey] || theme.palette.primary.main;
  }

  const [paletteKey, shadeKey] = colorKey.split('.');
  return theme.palette?.[paletteKey]?.[shadeKey] || theme.palette.primary.main;
}

// ----------------------------------------------------------------------

export default function QuotationStatusSummaryCard({
  // data = [],
  title = 'Estado de Cotizaciones',
}) {
  const theme = useTheme();
    const data = QUOTATION_STATUS_SUMMARY;
  const safeData = data.length ? data : [];

  const labels = safeData.map((item) => item.status);
  const series = safeData.map((item) => item.percentage);

  const colors = safeData.map((item) => {
    const { color } = getNotificationIcon(item.status);
    return resolvePaletteColor(theme, color);
  });

  // REACT CHART OPTIONS
  const options = useChartOptions({
    labels,
    stroke: {
      width: 1,
      colors: [theme.palette.background.paper],
    },
    colors,
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '80%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '14px',
              fontWeight: 500,
              color: theme.palette.text.secondary,
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return `${total}%`;
              },
            },
            value: {
              show: true,
              offsetY: 4,
              fontSize: '24px',
              fontWeight: 700,
              formatter: (val) => `${val}%`,
            },
          },
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '14px',
      },
      y: {
        formatter: (val) => `${val}%`,
        title: {
          formatter: (name) => name,
        },
      },
    },
    chart: {
      dropShadow: {
        top: -1,
        left: 3,
        blur: 3,
        opacity: 0.1,
        enabled: true,
        color: '#5D5D69',
      },
    },
  });

  return (
    <Card
      sx={{
        py: 3,
        pr: 3,
        height: '100%',
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid
          size={{
            sm: 6,
            xs: 12,
          }}
        >
          <Chart
            height={200}
            width="100%"
            type="donut"
            series={series}
            options={options}
          />
        </Grid>

        <Grid
          size={{
            sm: 6,
            xs: 12,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
            }}
          >
            {title}
          </Typography>

          <Stack spacing={2}>
            {safeData.map(({ id, status, percentage }) => {
              const { Icon, color } = getNotificationIcon(status);
              const [muiColor = 'inherit'] = (color || '').split('.');

              return (
                <FlexBetween key={id}>
                  <ListItem
                    title={status}
                    IconNode={<Icon fontSize="small" color={muiColor} />}
                    Divider={<Divider />}
                  />

                  <div>
                    <Typography variant="body2" fontWeight={500}>
                      {percentage}%
                    </Typography>
                  </div>
                  
                </FlexBetween>
              );
            })}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
