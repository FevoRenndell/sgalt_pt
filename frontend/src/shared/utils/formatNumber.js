export function format(entrie) {
  return entrie.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const formatThousands = (numberParam, precision) => {

  let number = numberParam;
  const a = parseInt(number, 10);

  const b = format(a);
  number = new Intl.NumberFormat('es-ES').format(parseFloat(number).toFixed(precision));

  if (precision > 0) {
    const decimals = number.indexOf(',') > -1 ? number.length - 1 - number.indexOf(',') : 0;
    number = decimals === 0 ? `${number},${'0'.repeat(precision)}` : number + '0'.repeat(precision - decimals);
  }

  if (a.toString().length === 4) {
    number = number.replaceAll(a, b);
  }

  if (number.indexOf('NaN') > -1) {
    number = '0,00';
  }

  return number.toString();
};

 