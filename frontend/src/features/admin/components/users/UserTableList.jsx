/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TableHeadCustom } from '../../../../shared/components/table';
import {
    Box,
    Table,
    TableBody,
    TableContainer,
    TablePagination,
    Paper,
    Alert,
    Skeleton,
} from '@mui/material';
import useTable, { getComparator } from '../../../../shared//hooks/useTable';
import UserTableRow from './UserTableRow';

UserTableList.propTypes = {
    details: PropTypes.array,
};

export default function UserTableList({ details = [] }) {


    const TABLE_HEAD = [
        { id: 'edit', label: '', align: 'left' },
        { id: 'id', label: 'ID', align: 'left', minWidth: '10px' },
        { id: 'first_name', label: 'Nombre', align: 'left', minWidth: '120px' },
        { id: 'last_name_1', label: 'Primer Apellido', align: 'left', minWidth: '120px' },
        { id: 'last_name_2', label: 'Segundo Apellido', align: 'left', minWidth: '120px' },
        { id: 'email', label: 'Correo Electrónico', align: 'left', minWidth: '180px' },
        { id: 'role_id', label: 'Rol', align: 'left', minWidth: '80px' },
        { id: 'is_active', label: 'Estado', align: 'left', minWidth: '80px' },
        { id: 'created_at', label: 'Fecha Creación', align: 'left', minWidth: '110px' },
        { id: 'updated_at', label: 'Fecha Modificación', align: 'left', minWidth: '110px' },
    ];


    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setTableData(details);
    }, [details]);

    const isLoading = false;

    const table = useTable();

    const {
        page,
        order,
        orderBy,
        rowsPerPage,
        selected,
        onSort,
        onChangePage,
        onChangeRowsPerPage,
    } = table;

    const dataFiltered = applySortFilter({
        tableData,
        comparator: getComparator(table.order, table.orderBy)
    });

    const handleEdit = (object) => {
        if (!isEmptyObject(object)) {
            setObjectToEdit({ ...object });
        }
    };

    useEffect(() => {
        table.setPage(0);
    }, []);

    return (
        <>
            <TableContainer component={Paper} sx={{ overflow: 'hidden' }}>
                <Table>
                    <TableHeadCustom
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={tableData?.length}
                        numSelected={selected.length}
                        onSort={onSort}
                    />
                    <TableBody>
                        {dataFiltered
                            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <UserTableRow
                                    key={row.id}
                                    row={row}
                                    selected={selected.includes(row.id)}
                                />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ position: 'block' }}>
                <TablePagination
                    rowsPerPageOptions={[5, 15, 25]}
                    component="div"
                    count={dataFiltered.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onChangePage}
                    onRowsPerPageChange={onChangeRowsPerPage}
                />
            </Box>
        </>
    );

    function applySortFilter({ tableData = [], comparator }) {
        const stabilizedThis = tableData.map((el, index) => [el, index]);

        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });

        tableData = stabilizedThis.map((el) => el[0]);


        return tableData;
    }
}
