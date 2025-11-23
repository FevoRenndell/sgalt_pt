

import { Container, Card, CardContent, Box } from '@mui/material';
import QuotationRequestTableList from '../../components/quotationRequest/QuotationRequestTableList';
import { useFetchQuotationRequestsQuery } from '../../api/quotationRequestQuoterApi';

 
export default function QuotationRequestListView({ }) {

    const { data: quotationRequestsData, isLoading } = useFetchQuotationRequestsQuery();

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