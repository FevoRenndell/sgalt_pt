// src/features/clients/components/clients/ClientTableList.jsx
import { useCallback, useEffect, useMemo, useState } from 'react';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// CUSTOM
import { Scrollbar } from '../../../../shared/components/scrollbar';
import { TableDataNotFound, TableToolbar } from '../../../../shared/components/table';
import HeadingArea from '../../../../shared/components/heading-area/HeadingArea';
import TableHeadCustom from '../../../../shared/components/table/TableHeadCustom.jsx';
import { useMuiTable, getComparator, stableSort } from '../../../../shared/hooks/useMuiTable';
import Add from '../../../../shared/icons/Add';
import { fDateLogic } from '../../../../shared/utils/formatTime';
import ClientTableRow from './ClientTableRow';
import { useDeleteClientMutation } from '../../api/clientApi';
import { paths } from '../../../../routes/paths';

export default function ClientTableList({ details }) {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [deleteClient] = useDeleteClientMutation();

  useEffect(() => {
    setClients(details);
  }, [details]);

  const [clientFilter, setClientFilter] = useState({
    search: '',
  });

  const TABLE_HEAD = [
    { id: 'actions', label: 'Acciones', align: 'left', minWidth: '80px' },
    { id: 'id', label: 'ID', align: 'left', minWidth: '60px' },
    { id: 'company_rut', label: 'RUT', align: 'left', minWidth: '120px' },
    { id: 'company_name', label: 'Empresa', align: 'left', minWidth: '200px' },
    { id: 'contact_name', label: 'Contacto', align: 'left', minWidth: '160px' },
    { id: 'contact_email', label: 'Correo', align: 'left', minWidth: '180px' },
    { id: 'contact_phone', label: 'Teléfono', align: 'left', minWidth: '120px' },
    { id: 'created_at', label: 'Creado', align: 'left', minWidth: '160px' },
    { id: 'updated_at', label: 'Actualizado', align: 'left', minWidth: '160px' },
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
    handleChangeRowsPerPage,
  } = useMuiTable({
    defaultOrderBy: 'company_name',
  });

  useEffect(() => {
    setPage(0);
  }, [clientFilter, setPage]);

  const handleChangeFilter = useCallback((key, value) => {
    setClientFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleSearchChange = useCallback(
    (e) => {
      handleChangeFilter('search', e.target.value);
    },
    [handleChangeFilter]
  );

  const handleDeleteClient = useCallback(
    async (id) => {
      try {
        const result = await deleteClient(id).unwrap();
        if (result) {
          setClients((prev) => prev.filter((client) => client.id !== id));
        }
      } catch (err) {
        console.error('Error eliminando cliente', err);
      }
    },
    [deleteClient]
  );

  const filteredClients = useMemo(() => {
    const sorted = stableSort(clients, getComparator(order, orderBy));

    return sorted.filter((item) => {
      const { search } = clientFilter;
      if (!search) return true;

      const term = search.toLowerCase();

      return (
        item.company_rut?.toLowerCase().includes(term) ||
        item.company_name?.toLowerCase().includes(term) ||
        item.contact_name?.toLowerCase().includes(term) ||
        item.contact_email?.toLowerCase().includes(term)
      );
    });
  }, [clients, order, orderBy, clientFilter]);

  const paginatedClients = useMemo(
    () => filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredClients, page, rowsPerPage]
  );

  const allClientIds = useMemo(() => filteredClients.map((row) => row.id), [filteredClients]);

  const addButton = (
    <Button
      variant="outlined"
      color="success"
      startIcon={<Add />}
      size="small"
      onClick={() => navigate(paths.client_create)}
    >
      Agregar cliente
    </Button>
  );

  return (
    <div className="pt-2 pb-4">
      <Card>
        <Box px={2} pt={2} mb={1}>
          <HeadingArea title="Listado de Clientes" addButton={addButton} icon={null} />
        </Box>

        <Box px={2} pb={2}>
          <TableToolbar
            searchPlaceholder="Buscar por RUT, empresa, contacto o correo"
            searchValue={clientFilter.search}
            onSearchChange={handleSearchChange}
          />
        </Box>

        <TableContainer>
          <Scrollbar autoHide={false}>
            <Table>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                numSelected={selected.length}
                rowCount={filteredClients.length}
                onRequestSort={handleRequestSort}
                onSelectAllRows={handleSelectAllRows(allClientIds)}
                headCells={TABLE_HEAD}
              />
              <TableBody>
                {paginatedClients.length === 0 ? (
                  <TableDataNotFound />
                ) : (
                  paginatedClients.map((client) => (
                    <ClientTableRow
                      key={client.id}
                      client={client}
                      handleDeleteClient={handleDeleteClient}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <Box padding={1}>
          <TablePagination
            page={page}
            component="div"
            rowsPerPage={rowsPerPage}
            count={filteredClients.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton
            showLastButton
          />
        </Box>
      </Card>
    </div>
  );
}
