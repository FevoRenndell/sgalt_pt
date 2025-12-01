

import { Container, Card, CardContent, Box } from '@mui/material';
import QuotationTableList from '../../components/quotation/QuotationTableList';
import { useFetchQuotationsQuery } from '../../api/quotationApi';

 
export default function QuotationListView({ }) {


    const { data } = useFetchQuotationsQuery(null, {
        pollingInterval: 3_000,
    });

    return (
        <Container>
            <Box sx={{ mt: 4, mb: 4 }}>
                <Card>
                    <CardContent>
                        <QuotationTableList details={data || []} />
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}