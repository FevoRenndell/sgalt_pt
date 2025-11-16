import { Helmet } from 'react-helmet-async';
import UserListView from './pages-view/UserListView';

export default function UserPage() {
  return (
    <>

      <title> Usuarios </title>

      <UserListView />
    </>
  );
}

 