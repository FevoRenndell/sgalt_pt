

import { Container, Card, CardContent, Box } from '@mui/material';
import UserTableList from '../../components/users/UserTableList';
import { useFetchUsersQuery } from '../../api/userApi';
 
export default function UserView({ }) {

    const { data: usersData, isLoading } = useFetchUsersQuery();

    return (
        <Container>
            <Box sx={{ mt: 4, mb: 4 }}>
                <Card>
                    <CardContent>
                        <UserTableList details={usersData || []} />
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}