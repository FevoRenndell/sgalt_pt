import { Card, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';

import { Scrollbar } from '../../../../shared/components/scrollbar';
import QuotationDetailsRow from './QuotationDetailsRow';
import { HeadTableCell } from '../../../../shared/components/table';

export default function QuotationDetailsList({ items }) {

    return <div className="pt-2 pb-4">
        <Card sx={{ mt: 4 }}>
            <TableContainer>
                <Scrollbar>
                    <Table sx={{ minWidth: 1024 }}>
                        <TableHead>
                            <TableRow>
                                <HeadTableCell>Área        </HeadTableCell>
                                <HeadTableCell>Nombre      </HeadTableCell>
                                <HeadTableCell>Norma       </HeadTableCell>
                                <HeadTableCell>Unidad      </HeadTableCell>
                                <HeadTableCell>Cantidad    </HeadTableCell>
                                <HeadTableCell>Precio Base </HeadTableCell>
                                <HeadTableCell>Precio Total</HeadTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items?.map((data) => (
                                <QuotationDetailsRow key={data.id} data={data} />
                            ))}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>

        </Card>
    </div>;
}