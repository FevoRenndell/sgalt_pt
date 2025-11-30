import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteClientMutation } from "../api/clientApi";
import { getComparator, stableSort, useMuiTable } from "../../../shared/hooks/useMuiTable";
import { Box, Button, Card, Container, Tab, Table, TableBody, TableContainer, TablePagination } from "@mui/material";
import HeadingArea from "../../../shared/components/heading-area/HeadingArea";
import { TableDataNotFound, TableToolbar } from "../../../shared/components/table";
import { Scrollbar } from "../../../shared/components/scrollbar";
import TableHeadCCustom from "../../../shared/components/table/TableHeadCustom";
import ClientTableRow from "./ClientTableRow";
import Add from "../../../shared/icons/Add";
import { paths } from "../../../routes/paths";
import TabContext from "@mui/lab/TabContext";
import { HeadingWrapper } from "../../../shared/components/heading-wrapper/HeadingWrapper";
import TabList from "@mui/lab/TabList";
import ClientActions from "../../admin/components/clients/ClientActions";



export default function ClientTableList({ details }) {

  const navigate = useNavigate();

  const [deleteClient] = useDeleteClientMutation();

  const [clients, setClients] = useState([]);
  const [selectTab, setSelectTab] = useState('');
  const [serviceFilters, setServiceFilters] = useState({
    search: '',
  });

  useEffect(() => {
    setClients(details);
  }, [details]);

  const [clientFilter, setClientFilter] = useState({
    search: '',
    rut: ''
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
    const sortedClients = stableSort(clients, getComparator(order, orderBy));
    const { search, rut } = clientFilter;

    const normalizedSearch = search?.trim().toLowerCase();
    const normalizedRut = rut?.trim().toLowerCase();

    return sortedClients.filter((item) => {
      // Filtro por nombre
      const matchesSearch = !normalizedSearch
        ? true
        : item.company_name?.trim().toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) return false;

      // Filtro por RUT
      const matchesRut = !normalizedRut
        ? true
        : item.company_rut?.trim().toLowerCase().includes(normalizedRut);

      if (!matchesRut) return false;

      return true;
    });
  }, [
    clients,
    order,
    orderBy,
    clientFilter.search,
    clientFilter.rut,   // 👈 faltaba esto
  ]);

  const paginatedClients = useMemo(
    () =>
      filteredClients.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [filteredClients, page, rowsPerPage]
  );

  const allClientIds = useMemo(() => filteredClients.map((row) => row.id), [filteredClients]);

  const addButton = (
    <Button
      variant="outlined"
      color="success"
      startIcon={<Add />}
      size="mdeium"
      onClick={() => navigate(paths.client_create)}
    >
      Agregar cliente
    </Button>
  );

  const handleCleanFilter = useCallback(() => {
    setSelectTab('');
    setClientFilter({
      search: '',
      rut: ''
    });
  }, []);

  return (
    <div className="pt-2 pb-4">
      <Container>
        <Card>
         
            <HeadingArea title="Listado de Clientes" addButton={addButton} icon={null} tab_active={false} />
           

          <ClientActions
            filter={clientFilter}
            handleChangeFilter={handleChangeFilter}
            handleCleanFilter={handleCleanFilter}
          />

          <TableContainer>
            <Scrollbar autoHide={false}>
              <Table>
                <TableHeadCCustom
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
      </Container>
    </div>
  );
}
