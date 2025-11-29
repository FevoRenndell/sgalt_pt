export function getStatusChipColorRequestQuotation(status) {
    switch (status) {
        case 'REVISADA':
            return 'success';
        case 'RECHAZADA':
            return 'error';
        case 'PENDIENTE':
            return 'secondary';
        default:
            return 'default';
    }
}

export function getStatusChipColorQuotation(status) {
    switch (status) {
        case 'REVISADA':
            return 'success';
        case 'RECHAZADA':
            return 'error';
        case 'PENDIENTE':
            return 'secondary';
        default:
            return 'default';
    }
}


export function getStatusChipColorQuotation2(status) {
    switch (status) {
        case 'ACEPTADA':
            return 'success';
        case 'RECHAZADA':
            return 'error';
        case 'CREADA':
            return 'secondary';
        case 'ENVIADA':
            return 'primary';
        default:
            return 'default';
    }
}