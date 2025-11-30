// src/features/clients/pages-view/ClientListView.jsx
import { Container, Card, CardContent, Box } from '@mui/material';
 
import { useFetchClientsQuery } from '../../api/clientApi';
import ClientTableList from '../../component/ClientTableList';

export default function ClientListView() {
  const { data: clientsData, isLoading } = useFetchClientsQuery();

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent>
            <ClientTableList details={clientsData || []} isLoading={isLoading} />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
