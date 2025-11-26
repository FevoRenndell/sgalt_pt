import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
 ;
// CUSTOM UTILS METHOD
 
import { FlexBetween } from '../../../../shared/components/FlexBox';
import { currency } from '../../../../shared/utils/currency';
export default function QuotationSummary() {
    return <Box maxWidth={320}>
        <Typography variant="body1" fontWeight={500}>
            Amount
        </Typography>

        <SummeryItem label="Subtotal" value={currency(428)} />
        <SummeryItem label="Discount (BLACKFRIDAY)" value={currency(-8)} />
        <SummeryItem label="VAT (Flat)" value={currency(20)} />
        <Divider sx={{
            my: 2
        }} />
        <SummeryItem label="Total" value={currency(200)} />
    </Box>;
}
function SummeryItem({
    label,
    value
}) {
    return <FlexBetween my={1}>
        <Typography variant="body2" color="text.secondary">
            {label}
        </Typography>

        <Typography variant="body2" fontWeight={500}>
            {value}
        </Typography>
    </FlexBetween>;
}