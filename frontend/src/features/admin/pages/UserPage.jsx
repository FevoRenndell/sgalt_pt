import { Helmet } from 'react-helmet-async';
import UserView from '../components/users/UserView';

export default function UserPage() {
  return (
    <>

      <title> Usuarios </title>

      <UserView />
    </>
  );
}
