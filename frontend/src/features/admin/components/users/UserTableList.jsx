import { useCallback, useEffect, useMemo, useState } from 'react';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
// CUSTOM COMPONENTS
import { Scrollbar } from '../../../../shared/components/scrollbar';
import { TableDataNotFound, TableToolbar } from '../../../../shared/components/table';
// CUSTOM PAGE SECTION COMPONENTS
import SearchArea from '../../../../shared/components/search-area/SearchArea';
import HeadingArea from '../../../../shared/components/heading-area/HeadingArea';
import UserTableRow from './UserTableRow';
import TableHeadCustom from '../../../../shared/components/table/TableHeadCustom.jsx';
// CUSTOM DEFINED HOOK
import { useMuiTable, getComparator, stableSort } from '../../../../shared/hooks/useMuiTable';
import Add from '../../../../shared/icons/Add';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDeleteUserMutation } from '../../api/userApi.js';
 
export default function UserTableList({ details }) {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [deleteUser, { isLoading, error }] = useDeleteUserMutation();

  useEffect(() => {
    setUsers(details);
  }, [details]);

  const [userFilter, setUserFilter] = useState({
    role: 0,
    search: ''
  });

  const TABLE_HEAD = [
    { id: 'actions', numeric: true, disablePadding: false, label: 'Acciones'},
    { id: 'id', label: 'ID', align: 'left', minWidth: '10px' },
    { id: 'first_name', label: 'Nombre', align: 'left', minWidth: '200px' },
    { id: 'email', label: 'Correo Electrónico', align: 'left', minWidth: '180px' },
    { id: 'role_id', label: 'Rol', align: 'left', minWidth: '80px' },
    { id: 'is_active', label: 'Estado', align: 'left', minWidth: '80px' },
    { id: 'created_at', label: 'Fecha Creación', align: 'left', minWidth: '160px' },
    { id: 'updated_at', label: 'Fecha Modificación', align: 'left', minWidth: '200px' },

  ];

  const {
    page,
    order,
    orderBy,
    selected,
    isSelected,
    rowsPerPage,
    setPage,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage
  } = useMuiTable({
    defaultOrderBy: 'name'
  });

  useEffect(() => {
    setPage(0);
  }, [userFilter, setPage]);

  const handleChangeFilter = useCallback((key, value) => {
    setUserFilter(prevFilter => ({
      ...prevFilter,
      [key]: value
    }));
  }, []);

  const handleChangeTab = useCallback((_, newValue) => {
    handleChangeFilter('role', newValue);
  }, [handleChangeFilter]);

  const handleSearchChange = useCallback(e => {
    handleChangeFilter('search', e.target.value);
  }, [handleChangeFilter]);

  const handleDeleteUser = useCallback(async id => {
    try {
      const result = await deleteUser(id).unwrap();
      if (result) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      }
      console.log("Usuario eliminado correctamente");
      // navigate(paths.users_list);
    } catch (err) {
      console.error("Error eliminando usuario", err);
    }   
  }, []);

  const filteredUsers = useMemo(() => {

    const sortedUsers = stableSort(users, getComparator(order, orderBy));

    console.log(sortedUsers)

    return sortedUsers.filter(item => {
      if (userFilter.role) {
        return item.role_id === userFilter.role;
      } else if (userFilter.search) {
        return item.name.toLowerCase().includes(userFilter.search.toLowerCase());
      }
      return true;
    });
  }, [users, order, orderBy, userFilter.role_id, userFilter.search]);

  const paginatedUsers = useMemo(() => filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [filteredUsers, page, rowsPerPage]);
  const allUserIds     = useMemo(() => filteredUsers.map(row => row.id), [filteredUsers]);

  const addButton =
    <Button variant="outlined" color='success' startIcon={<Add />} onClick={() => navigate('/admin/users/create')}>
      Add New User
    </Button>;

  return <div className="pt-2 pb-4">
    <Card>

      <Box px={2} pt={2}>
        <HeadingArea value={userFilter.role} changeTab={handleChangeTab} addButton={addButton} />
        <SearchArea value={userFilter.search} onChange={handleSearchChange} gridRoute="/dashboard/user-grid" listRoute="/dashboard/user-list" />
      </Box>

      {/* TABLE HEAD & BODY ROWS */}
      <TableContainer>
        <Scrollbar autoHide={false}>

          <Table>
            <TableHeadCustom order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredUsers.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(allUserIds)} headCells={TABLE_HEAD} />
            <TableBody>
              { paginatedUsers.length === 0 ? <TableDataNotFound /> : paginatedUsers.map(user => <UserTableRow key={user.id} user={user}  handleDeleteUser={handleDeleteUser} />)}
            </TableBody>
          </Table>
        </Scrollbar>

      </TableContainer>

      {/* PAGINATION SECTION */}
      <Box padding={1}>
        <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={filteredUsers.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} showFirstButton showLastButton />
      </Box>

    </Card>
  </div>;
}