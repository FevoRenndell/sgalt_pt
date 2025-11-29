import { AppError } from '../error/AppError.js';
import db from '../models/index.js';

export async function createQuotationRequest(data) {
    
  const transaction = await db.sequelize.transaction();
  let client = {};

  try {

    const existingClient = await db.models.Client.findOne({
      raw : true,
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
        client_id: existingClient ? existingClient.id : client.id,
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


// services/quotationService.js (por ejemplo)

export async function getQuotationClient(quotationId, includeDetails = true) {
  try {
    return await db.models.Quotation.findByPk(quotationId, {
      attributes: [
        'id',
        'quote_number',
        'discount',
        'status',
        'subtotal',
        'total',
        'created_at',
      ],
      include: [
        {
          model: db.models.QuotationRequest,
          as: 'request',
          attributes: [
            'id',
            'obra_direccion',
            'received_at',
            'requester_full_name',
            'requester_email',
            'requester_phone',
          ],
          include: [
            {
              model: db.models.Client,
              as: 'client',
              attributes: [
                'id',
                'company_rut',
                'company_name',
                'contact_name',
                'contact_email',
                'contact_phone',
              ],
            },
          ],
        },
        // Detalle de ítems + servicios (puedes desactivar con includeDetails = false)
        ...(includeDetails
          ? [
              {
                model: db.models.QuotationItem,
                as: 'items',
                attributes: [
                  'id',
                  'quotation_id',
                  'service_id',
                  'quantity',
                  'unit',
                  'unit_price',
                  'subtotal',
                ],
                include: [
                  {
                    model: db.models.Service,
                    as: 'service',
                    attributes: [
                      'id',
                      'name',
                      'area',
                      'unit',
                      'norma',
                      'description',
                      'base_price',
                    ],
                  },
                ],
              },
            ]
          : []),
        {
          model: db.models.User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name_1', 'email'],
        },
      ],
    });
  } catch (error) {
    console.error('Error fetching quotation for client:', error);
    throw new AppError('Error obteniendo la cotización para el cliente', 400);
  }
}


export async function AcceptQuotationRequest(quoteData) {

  const updatedQuotation = await db.models.Quotation.update(
    { status: 'ACEPTADA' },
    { where: { id: quoteData.quotation_id, request_id : quoteData.request_id }, returning: true }
  );

  return getQuotationClient(quoteData.quotation_id);
}

export async function RejectQuotationRequest(quoteData) {
  const updatedQuotation = await db.models.Quotation.update(
    { status: 'RECHAZADA' },
    { where: { id: quoteData.quotation_id, request_id : quoteData.request_id }, returning: true }
  );

  if(updatedQuotation[0] === 0){
    throw new AppError('Cotización no encontrada o ya ha sido procesada', 404);
  }

  return getQuotationClient(quoteData.quotation_id);;
}
