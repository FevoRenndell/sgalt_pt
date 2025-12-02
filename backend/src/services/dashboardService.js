import { where } from 'sequelize';
import { AppError } from '../error/AppError.js';
import db from '../models/index.js';

export async function getDashboard1() {
    const quotationTotal = await getTotals();

    return quotationTotal
}
 

export async function getTotals() {

  const result = await db.models.Quotation.findAll({});

  const totalQuotations = result.reduce((acc, item) => {

    if (!acc[item.status]) {
      acc[item.status] = 0;
    }

    acc[item.status] += Number(item.total) || 0;

    return acc;
  }, {});

  return { quotation: totalQuotations };
}