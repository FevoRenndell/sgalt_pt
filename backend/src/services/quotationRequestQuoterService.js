import { AppError } from '../error/AppError.js';
import db from '../models/index.js';

export async function getQuotationRequests() {
  return await db.models.QuotationRequest.findAll({});
}

export async function createQuotation(quotationRequestData) {
  const newQuotationRequest = await db.models.QuotationRequest.create(quotationRequestData);
  return newQuotationRequest;
}

export async function getQuotationRequestsById(quotationRequestId) {
  return await db.models.QuotationRequest.findByPk(quotationRequestId, {});
}

export async function updateQuotation(quotationRequestId, updateData) {
  const quotationRequest = await db.models.QuotationRequest.findByPk(quotationRequestId);
  if (!quotationRequest) {
    throw new AppError('QuotationRequest not found', 400);
  }
  return await quotationRequest.update(updateData);
}

export async function removeQuotation(quotationRequestId) {
  const quotationRequest = await db.models.QuotationRequest.findByPk(quotationRequestId);
  if (!quotationRequest) {
    throw new AppError('QuotationRequest not found', 400);
  }
  await quotationRequest.destroy();
  return quotationRequest;
}

