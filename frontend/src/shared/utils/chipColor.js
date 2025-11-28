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