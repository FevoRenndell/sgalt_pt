import { where } from 'sequelize';
import { AppError } from '../error/AppError.js';
import db from '../models/index.js';

export async function getDashboard1() {

  const quotationSummary = await getQuotationSummary();

  return { 
    ...quotationSummary
  };
}

export async function getQuotationSummary(){

  const result = await db.models.Quotation.findAll({});

  const quotationTotal = await getTotalsQuotationsAmount(result);
  const quotationQuantity = await getQuantities(result);
  const quotationPercentages = await getQuotationPercentages(result);

  return {
    ...quotationTotal,
    ...quotationQuantity,
    ...quotationPercentages
  }

}

export async function getTotalsQuotationsAmount(quotations) {

  const data = quotations.reduce((acc, item) => {
    if (!acc[item.status]) {
      acc[item.status] = 0;
    }
    acc[item.status] += Number(item.total) || 0;
    return acc;
  }, {});

  return { quotation: data };
}

export async function getQuantities(quotations) {

  const quotationCounts = quotations.reduce((acc, item) => {
    if (!acc[item.status] && item.status !== 'CREADA') {
      acc[item.status] = 0;
    }
    acc[item.status] += 1;
    return acc;
  }, {});

 return { quotationQuantity: quotationCounts };
}

export async function getQuotationPercentages(quotations) {
 
  const total = quotations.reduce((acc, item) => acc + 1, 0);

  return total

}