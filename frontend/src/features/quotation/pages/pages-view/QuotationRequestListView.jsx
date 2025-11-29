

import { Container, Card, CardContent, Box } from '@mui/material';
import QuotationRequestTableList from '../../components/quotationRequest/QuotationRequestTableList';
 
import { useFetchQuotationsQuery } from '../../api/quotationApi';

 
export default function QuotationRequestListView({ }) {

    const { data: quotationRequestsData, isLoading } = useFetchQuotationsQuery();

    return (
        <Container>
            <Box sx={{ mt: 4, mb: 4 }}>
                <Card>
                    <CardContent>
                        <QuotationRequestTableList details={quotationRequestsData || []} />
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}