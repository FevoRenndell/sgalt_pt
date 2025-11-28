

import { Container, Card, CardContent, Box } from '@mui/material';
import QuotationTableList from '../../components/quotation/QuotationTableList';
import { useFetchQuotationsQuery } from '../../api/quotationApi';

 
export default function QuotationListView({ }) {

    const { data: quotationRequestsData, isLoading } = useFetchQuotationsQuery();

    return (
        <Container>
            <Box sx={{ mt: 4, mb: 4 }}>
                <Card>
                    <CardContent>
                        <QuotationTableList details={quotationRequestsData || []} />
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}