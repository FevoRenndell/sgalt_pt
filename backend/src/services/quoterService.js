import { AppError } from '../error/AppError.js';
import db from '../models/index.js';

export async function createQuotationRequest(data) {

    return await db.models.QuotationRequest.create(data);

    return "createQuotationRequest called";
}

export async function AcceptQuotationRequest(quoteData) {
 return "AcceptQuotationRequest called";
}

 
