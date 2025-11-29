// QuotationSummary.jsx
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { FlexBetween } from '../../../../shared/components/FlexBox';
import { TextField } from '@mui/material';
import { formatThousands } from '../../../../shared/utils/formatNumber';

export default function QuotationSummary({ draft, handleDiscount, buttons, withInput = true }) {
 
  const subtotal = draft.items.reduce((acc, item) => acc + (item.base_price || parseInt(item.unit_price ?? 0)) * item.quantity, 0);
  const discount = parseInt(draft.discount ?? 0) || 0;
  const tax =parseInt( draft.tax) || 0;

  return (
    <Box maxWidth={320}>

      {withInput && (
        <>
          <Typography variant="body1" fontWeight={500} mb={1}>
            Aplicar Cargo o Descuento
          </Typography>
          <TextField label='Aplicar Descuento' name='discount' value={discount} onChange={(e) => handleDiscount(e.target.value)} />
           <Divider sx={{ my: 2 }} />
       
        </>

      )}
      
      <Typography variant="body1" fontWeight={500} mb={1}>
        Monto Total de la Cotización
      </Typography>

      <SummaryItem label="Total Neto" value={formatThousands(subtotal)} />
      <SummaryItem
        label="Descuento"
        value={formatThousands(discount)} />

      <Divider sx={{ my: 2 }} />

      <SummaryItem label="Total" value={formatThousands(subtotal - discount + tax)} />

      {buttons}
    </Box>
  );
}

function SummaryItem({ label, value }) {
  return (
    <FlexBetween my={1}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="body2" fontWeight={500}>
        {value}
      </Typography>
    </FlexBetween>
  );
}
