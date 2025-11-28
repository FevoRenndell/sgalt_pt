import { Card, Table, TableBody, TableContainer, TablePagination } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Scrollbar } from '../../../../shared/components/scrollbar';
import { TableDataNotFound, TableToolbar } from '../../../../shared/components/table';
import { useFethQuotationFilterQuery } from '../../api/filterApi';
import { getComparator, stableSort, useMuiTable } from '../../../../shared/hooks/useMuiTable';
import QuotationServiceTableRow from './QuotationServiceTableRow';
import QuotationServiceTableHead from './QuotationServiceTableHead';
import QuotationServiceActions from './QuotationServiceActions';

export default function QuotationServiceTableList({ addItem, selectTab, setSelectTab, draft }) {

  // const navigate = useNavigate();
  const { data: filter } = useFethQuotationFilterQuery();

  const [services, setServices] = useState([]);
  const [serviceGroup, setServiceGroup] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loadedDraft, setLoadedDraft] = useState(false);
    
  const [serviceFilters, setServiceFilters] = useState({
    search: '',
    area: ''
  });

  const {
    order,
    setPage,
    orderBy,
    selected,
    handleRequestSort,
  } = useMuiTable({
    defaultOrderBy: 'name'
  });

  useEffect(() => {
    if (filter?.services) {
      setServices(filter?.services || []);
      const grouped = Object.values(
        (filter?.services || []).reduce((acc, service) => {
          const area = service.area || "Sin Grupo";
          if (!acc[area]) {
            acc[area] = { id: area, area: area, value: area };
          }
          return acc;
        }, {})
      );
      setServiceGroup([...grouped, { id: 'all', area: 'Todo', value: '' }]);
    }
  }, [filter]);


  useEffect(() => {
    setPage(0);
  }, [serviceFilters, setPage]);

  const filteredServices = useMemo(() => {
    const sortedServices = stableSort(services, getComparator(order, orderBy));
    const { area, search } = serviceFilters;

    const normalizedArea = area?.trim().toLowerCase();
    const normalizedSearch = search?.trim().toLowerCase();

    return sortedServices.filter((item) => {

      if (selectTab === 'seleccionado' && !selectedItems[item.id]) {
        return false;
      }
      const matchesArea =
        !normalizedArea || normalizedArea === 'all'
          ? true
          : item.area?.trim().toLowerCase() === normalizedArea;

      if (!matchesArea) return false;
      const matchesSearch =
        !normalizedSearch
          ? true
          : item.name?.trim().toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) return false;

      return true;
    });
  }, [
    services,
    order,
    orderBy,
    serviceFilters.area,
    serviceFilters.search,
    selectTab,
    selectedItems,
  ]);

  const handleChangeFilter = useCallback((key, value) => {
    setServiceFilters(state => ({
      ...state,
      [key]: value
    }));
  }, []);

  const handleSelectRow = useCallback((data, isChecked) => {
    setSelectedItems(prev => {
      const next = { ...prev };
      if (isChecked) {
        next[data.id] = { ...data };      
      } else {
        delete next[data.id];           
      }
      return next;
    });
  }, []);

  const handleChangueQuantity = useCallback((id, quantity) => {
    setSelectedItems(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          quantity,
        },
      };
    });
  }, []);

useEffect(() => {
  //if (!loadedDraft) return;      
  addItem(selectedItems);
}, [selectedItems]);  

/*useEffect(() => {
  if (!(draft?.items && draft.items.length > 0)) return;

  const timer = setTimeout(() => {
    const initialSelected = {};
    draft.items.forEach((item) => {
      initialSelected[item.id] = { ...item };
    });
    setSelectedItems(initialSelected);
    setLoadedDraft(true);       
  }, 500);

  return () => clearTimeout(timer);
  
}, [draft]);*/

  const handleCleanFilter = useCallback(() => {
    setSelectTab('');
    setServiceFilters({
      search: '',
      area: '',
    });
  }, []);

  return <div className="pt-2 pb-4">
    <Card sx={{ mt: 4 }}>
      <QuotationServiceActions
        filter={serviceFilters}
        serviceGroup={serviceGroup}
        handleChangeFilter={handleChangeFilter}
        handleCleanFilter={handleCleanFilter}
      />
      {selected.length > 0 && <TableToolbar selected={selected.length} handleDeleteRows={handleAllServiceDelete} />}

      <TableContainer>
        <Scrollbar>
          <Table sx={{ minWidth: 1024 }}>
            <QuotationServiceTableHead
              order={order}
              orderBy={orderBy}
              numSelected={selected.length}
              rowCount={filteredServices.length}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {filteredServices.length === 0 ? (<TableDataNotFound />) :
                filteredServices.map(service => {
                  const isSelected = !!selectedItems[service.id];
                  const quantity = selectedItems[service.id]?.quantity ?? 0;
                  return (                              
                    <QuotationServiceTableRow
                      service={service}
                      isSelected={isSelected}
                      quantity={quantity}
                      handleSelectRow={handleSelectRow}
                      handleChangueQuantity={handleChangueQuantity}
                    />
               
                  );
                }
                )}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {/* PAGINATION SECTION */}

    </Card>
  </div>;
}