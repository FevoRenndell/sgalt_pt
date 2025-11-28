import { useCallback, useEffect, useMemo, useState } from 'react';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
// CUSTOM COMPONENTS
import { Scrollbar } from '../../../../shared/components/scrollbar/index.js';
import { TableDataNotFound } from '../../../../shared/components/table/index.js';
// CUSTOM PAGE SECTION COMPONENTS
import HeadingArea from '../../../../shared/components/heading-area/HeadingArea.jsx';
import QuotationRequestTableRow from './QuotationRequestTableRow.jsx';
import TableHeadCustom from '../../../../shared/components/table/TableHeadCustom.jsx';
// CUSTOM DEFINED HOOK
import { useMuiTable, getComparator, stableSort } from '../../../../shared/hooks/useMuiTable.js';
import Add from '../../../../shared/icons/Add.jsx';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDeleteQuotationRequestMutation } from '../../api/quotationRequestQuoterApi.js';
import { paths } from '../../../../routes/paths.js';
import QuotationRequestDetailDialog from './QuotationRequestDetailDialog.jsx';
import SubjectIcon from '@mui/icons-material/Subject';
export default function QuotationRequestTableList({ details }) {

  const navigate = useNavigate();

  const [state , setState] = useState(false);
  const [QuotationRequests, setQuotationRequests] = useState([]);

  const [deleteQuotationRequest, { isLoading, error }] = useDeleteQuotationRequestMutation();

  useEffect(() => {
    setQuotationRequests(details);
  }, [details]);

  const [quotationRequestFilter, setQuotationRequestFilter] = useState({
    role: 0,
    search: ''
  });

  const TABLE_HEAD = [
    { id: '', label: '', numeric: true, disablePadding: false },

    { id: 'solicitud_num', label: 'N° Solic.', align: 'left', minWidth: '120px' },
    { id: 'cotizacion_num', label: 'N° Cot.', align: 'left', },
    { id: 'estado', label: 'Estado', align: 'left'  },
    { id: 'rut', label: 'Rut', align: 'left', minWidth: '200px' },
    { id: 'razon_social', label: 'Razón Social', align: 'left', minWidth: '200px' },
    { id: 'registrado_el', label: 'Registrado el', align: 'left', minWidth: '200px' },
   
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
  }, [quotationRequestFilter, setPage]);

  const handleDeleteQuotationRequest = useCallback(async id => {
    try {
      const result = await deleteQuotationRequest(id).unwrap();
      if (result) {
        setQuotationRequests(prevQuotationRequests => prevQuotationRequests.filter(quotationRequest => quotationRequest.id !== id));
      }
      console.log("Usuario eliminado correctamente");
      // navigate(paths.QuotationRequests_list);
    } catch (err) {
      console.error("Error eliminando usuario", err);
    }   
  }, []);

  const filteredQuotationRequests = useMemo(() => {

    const sortedQuotationRequests = stableSort(QuotationRequests, getComparator(order, orderBy));

    return sortedQuotationRequests.filter(item => {
      if (quotationRequestFilter.role) {
        return item.role_id === quotationRequestFilter.role;
      } else if (quotationRequestFilter.search) {
        return item.name.toLowerCase().includes(quotationRequestFilter.search.toLowerCase());
      }
      return true;
    });
  }, [QuotationRequests, order, orderBy, quotationRequestFilter.role_id, quotationRequestFilter.search]);

  const paginatedQuotationRequests = useMemo(() => filteredQuotationRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [filteredQuotationRequests, page, rowsPerPage]);
  const allQuotationRequestIds     = useMemo(() => filteredQuotationRequests.map(row => row.id), [filteredQuotationRequests]);

  const addButton =
    <Button variant="outlined" color='success' startIcon={<Add />} size='medium' onClick={() => navigate(paths.quotation_request_create)}>
      Nueva Solicitud
    </Button>;


  const onView = (row) => {    
    setState({
      isOpen: true,
      client: row
    });
  } 

  const onClose = () => {
    setState({
      isOpen: false,
      client: null
    });
  }
  

  return <div className="pt-2 pb-4">
    <Card>
      <QuotationRequestDetailDialog state={state} onClose={onClose}/>
      <Box px={2} pt={2} mb={3}>
        <HeadingArea title='Solicitudes de Cotizaciones' addButton={addButton} icon={<SubjectIcon className="icon" />} />
      </Box>

      {/* TABLE HEAD & BODY ROWS */}
      <TableContainer>
        <Scrollbar autoHide={false}>
          <Table>
            <TableHeadCustom order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredQuotationRequests.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(allQuotationRequestIds)} headCells={TABLE_HEAD} />
            <TableBody>
              { paginatedQuotationRequests.length === 0 ? <TableDataNotFound /> : paginatedQuotationRequests.map(quotationRequest => <QuotationRequestTableRow handleView={onView} key={quotationRequest.id} quotationRequest={quotationRequest}  handleDeleteQuotationRequest={handleDeleteQuotationRequest} />)}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {/* PAGINATION SECTION */}
      <Box padding={1}>
        <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={filteredQuotationRequests.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} showFirstButton showLastButton />
      </Box>

    </Card>
  </div>;
}