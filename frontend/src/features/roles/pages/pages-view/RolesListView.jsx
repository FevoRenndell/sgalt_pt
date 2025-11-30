// src/features/clients/pages-view/ClientListView.jsx
import { Container, Card, CardContent, Box } from '@mui/material';
 
import { useFetchRolesQuery } from '../../api/roleApi';
import RolesTableList from '../../component/RolesTableList';

export default function RolesListView() {

  const { data: rolesData, isLoading } = useFetchRolesQuery();

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent>
            <RolesTableList details={rolesData || []} isLoading={isLoading} />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
