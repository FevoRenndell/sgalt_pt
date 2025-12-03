import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

// CUSTOM COMPONENTS
import LongCard from '../../components/LongCard';
import QuotationStatusSummaryCard from '../../components/QuotationStatusSummaryCard';
import SalesCard from '../../components/SaleCard';
import TopQuotationServiceAccept from '../../components/TopQuotationServiceAccept';
import { useFetchDashboard1Query } from '../../api/dashboardApi';
import QuotationRequestActivity from '../../components/QuotationRequestActivity';

const LIST_3 = [
    { id: 1, status: 'FINALIZADA', count: 30 },
    { id: 2, status: 'RECHAZADA', count: 30 },
 
];


export default function CrmTwoPageView() {

    const { data: fetchDashboard1 } = useFetchDashboard1Query();

    console.log('DASHBOARD DATA:', fetchDashboard1);

    return <div className="pt-2 pb-4">
        <Grid container spacing={3}>
            {/* LEADS CONVERTED CARD */}
            <Grid size={{ md: 12,xs: 12  }}>
                <SalesCard quotation={fetchDashboard1?.quotation} />
            </Grid>

            <Grid size={{ md: 8, xs: 12 }}>
                <Stack spacing={3}>
                    {/* LEAD VS CUSTOMER DATA ANALYSIS CHART */}
                    <QuotationStatusSummaryCard />

                    {/* DIFFERENT LEADS DATA STATISTICS */}
                    <LongCard data={fetchDashboard1?.quotationQuantity || {}} />
                </Stack>
            </Grid>

            {/* PROJECT STATUS DATA VISUAL CHART    <ProjectStatus />*/}
            <Grid size={{ md: 4, xs: 12 }}>

                <QuotationRequestActivity />

            </Grid>

            {/* CUSTOMER LIST DATA TABLE */}
            <Grid size={{ md: 12, xs: 12 }}>
              
                <TopQuotationServiceAccept />
                
            </Grid>

      
        </Grid>
    </div>;
}