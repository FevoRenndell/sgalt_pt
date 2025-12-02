import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

// CUSTOM COMPONENTS
import LongCard from '../../components/LongCard';
import QuotationStatusSummaryCard from '../../components/QuotationStatusSummaryCard';
import SalesCard from '../../components/SaleCard';
import ProjectStatus from '../../components/ProjectStatus';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TopRequestStatus from '../../components/TopRequestStatus';
import TopQuotationServiceAccept from '../../components/TopQuotationServiceAccept';

import { useFetchDashboard1Query } from '../../api/dashboardApi';

const LIST_2 = [

    { id: 2, status: 'ENVIADA', count: 30 },
    { id: 3, status: 'POR VENCER', count: 10 },
    { id: 4, status: 'ACEPTADA', count: 20 },
    { id: 5, status: 'RECHAZADA', count: 12 },
    { id: 6, status: 'VENCIDA', count: 8 },
];

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
                    <LongCard list={LIST_2} />
                </Stack>
            </Grid>

            {/* PROJECT STATUS DATA VISUAL CHART */}
            <Grid size={{ md: 4, xs: 12 }}>

                 <ProjectStatus />

            </Grid>

            {/* CUSTOMER LIST DATA TABLE */}
            <Grid size={{ md: 12, xs: 12 }}>
              
                <TopQuotationServiceAccept />
                
            </Grid>

      
        </Grid>
    </div>;
}