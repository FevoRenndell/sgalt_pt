import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}
export function fDateFront(date) {
  return format(new Date(date), 'dd/MM/yyyy');
}

export function fDateLogic(date) {
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fTimestamp(date) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export function fDateTimeSS(date) {
  if(!date || date.length === 0){
    return '';
  }
  return format(new Date(date), 'dd/MM/yyyy HH:mm:ss');
}

export function fDateFormat(date, formatDefault = 'yyyy-MM-dd') {
  return format(new Date(date), formatDefault);
}
