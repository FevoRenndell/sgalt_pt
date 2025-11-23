import db from '../models/index.js';

export async function createQuotationRequest(data) {
    
  const transaction = await db.sequelize.transaction();
  let client = {};

  try {

    const existingClient = await db.models.Client.findOne({
      where: { company_rut: data.company_rut },
      transaction,
    });

    if(!existingClient){
        client = await db.models.Client.create({
            company_rut: data.company_rut,        
            company_name: data.company_name, 
            contact_name: data.contact_name ?? null,
            contact_email: data.contact_email ?? null,
            contact_phone: data.contact_phone ?? null,
        },
        { transaction }
    )}

    const quotation = await db.models.QuotationRequest.create({
        client_id: client ? client.id : existingClient.id,
        requester_full_name: data.requester_full_name, 
        requester_email: data.requester_email,        
        requester_phone: data.requester_phone ?? null,
        service_description: data.service_description ?? '',
        obra_direccion: data.obra_direccion ?? '',
        commune_id: data.commune_id ?? null,
        city_id: data.city_id ?? null,
        region_id: data.region_id ?? null,
      },
      { transaction }
    );

    await transaction.commit();
    return quotation;

  } catch (error) {
    await transaction.rollback();
    throw error;  
  }
}

export async function AcceptQuotationRequest(quoteData) {
  return 'AcceptQuotationRequest called';
}
