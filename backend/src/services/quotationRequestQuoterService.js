import { AppError } from '../error/AppError.js';
import db from '../models/index.js';

export async function getQuotationRequests() {
  return await db.models.QuotationRequest.findAll({
    include : [{
      as : 'client',
      model : db.models.Client
    }]
  });
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
 
  if(quotationRequest.dataValues?.status === 'PENDIENTE'){ // si estan pendiente se evalua el estado
     return await quotationRequest.update({...updateData, status: evaluateQuotationReview(updateData)});
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

export function evaluateQuotationReview({
  competence_capacity,
  need_subcontracting_services,
  independence_issue,
}) {

  //si uno viene vacio, no se puede evaluar
  if (!competence_capacity || !need_subcontracting_services || !independence_issue) {
    return 'PENDIENTE';
  }

  // Regla 3 → Si opción 1 es NO → rechazada
  if (competence_capacity === 'NO') {
    return 'RECHAZADA';
  }

  // Regla 4 → Si opción 3 es SI → rechazada
  if (independence_issue === 'SI') {
    return 'RECHAZADA';
  }

  // Reglas 1 y 2 → Todas las combinaciones válidas cuando
  // competencia = SI e independencia = NO → aprobada
  return 'REVISADA';
}

