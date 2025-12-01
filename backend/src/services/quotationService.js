import { quotationCreatedTemplate } from '../email/quotationEmailClient.js';
import { AppError } from '../error/AppError.js';
import db from '../models/index.js';
import { signUrlToken } from './authService.js';
import { sendEmail } from './emailService.js';
 


export async function getQuotations() {

  return await db.models.Quotation.findAll({
    include: [
      {
        model: db.models.QuotationRequest,
        as: 'request',
        include: [
          {
            model: db.models.Client,
            as: 'client',
          },
        ],
      },
    ],
  });
}

export async function createQuotation(data) {

  let quotation = {};
  const { items = [], discount = 0 } = data;

  if (!items || items.length === 0) {
    throw new AppError('La cotización debe tener al menos un item', 400);
  }

  const transaction = await db.sequelize.transaction();

  try {

    //aplanar y obtener solo las id de los servicios seleccionado
    const flatService = items.map(i => i.id);

    const services = await db.models.Service.findAll({
      raw: true,
      where: {
        id: flatService
      }
    });

    const newItems = items.map(item => {

      const matchedItem = services.find(service => service.id === item.id);

      if (matchedItem) {
        return {
          ...item,
          unit: matchedItem.unit,
          service_id: matchedItem.id,
          unit_price: matchedItem.base_price,
          sub_total: item.quantity * parseInt(matchedItem.base_price),
        }
      }
      return item;
    });

    const subTotal = newItems.reduce((acc, curr) => acc + curr.sub_total, 0);
    const total = parseFloat(subTotal.toFixed(2)) - discount;

    quotation = await db.models.Quotation.create({
      ...data,
      items: newItems,
      subtotal: subTotal,
      total: total,
      user_id: 1,
    },
      { transaction }
    )

    await db.models.QuotationItem.bulkCreate(
      newItems.map(item => ({
        quotation_id: quotation.id,
        service_id: item.service_id,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        sub_total: item.sub_total,
      })),
      { transaction }
    );

    await transaction.commit();
    return quotation;

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function getQuotationById(quotationId, raw = false) {
  try {
    return await db.models.Quotation.findByPk(quotationId, {
      raw: raw,
      include: [
        {
          model: db.models.QuotationRequest,
          as: 'request',
          include: [
            {
              model: db.models.Client,
              as: 'client',
            },
          ],
        },
        {
          model: db.models.QuotationItem,
          as: 'items',
          include: [
            {
              model: db.models.Service,
              as: 'service',
            },
          ],
        },
        {
          model: db.models.User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name_1', 'last_name_2', 'email'],
        }
      ],

    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new AppError('Error fetching user by ID', 400);
  }
}

export async function updateQuotation(userId, updateData) {
  try {
    const user = await db.models.Quotation.findByPk(userId);
    if (!user) {
      throw new AppError('Quotation not found', 400);
    }
    return await user.update(updateData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw new AppError('Error updating user', 500);
  }
}

export async function deleteQuotation(userId) {
  try {
    const user = await db.models.Quotation.findByPk(userId);
    if (!user) {
      throw new AppError('Quotation not found', 400);
    }
    await user.destroy();
    return user;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new AppError('Error deleting user', 500);
  }
}

export async function sendQuotationEmail({ quotation_id = null, request_id }) {

  const transaction = await db.sequelize.transaction();

  try {
    const quotationByID = await getQuotationById(quotation_id, false);

    if(!quotationByID){
      throw new AppError('Cotización no encontrada', 404);
    }

    const quotation = await destructureQuotationData(quotationByID);

    const cotID = quotation.quotation.id;
    const requesterEmail = quotation.request.requester_email;

    const token = signUrlToken(cotID, requesterEmail);
    
    const updatedRequest = await db.models.QuotationRequest.update(
      { status: 'FINALIZADA',},
      {
        where: { id: request_id },
        transaction,
        raw: true,
      }
    );

    if (updatedRequest[0] !== 1) {
      throw new AppError('No se pudo actualizar el estado de la solicitud de cotización', 500);
    }

    await db.models.Quotation.update(
      { status: 'ENVIADA', quotation_token: token },
      {
        where: { id: quotation_id },
        transaction,
      }
    );

    const url = `http://localhost:5173/public/cotizacion/${cotID}?token=${token}`;

    const html = quotationCreatedTemplate({
      recipientName: quotation.request.requester_full_name,
      url,
      quotation,
    });

    await sendEmail({
      to: requesterEmail,
      subject: 'Su cotización ha sido creada',
      html,                     
      text: `Puede ver su cotización en el siguiente enlace: ${url}`,  
    });

    await transaction.commit();

    return { quotation, token, url };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}



async function destructureQuotationData(quotationInstance) {
 
  const data = quotationInstance.get({ plain: true });
 
  const {
    request,
    items,
    user,
    ...quotationData
  } = data;

 
  const client = request?.client;

  return {
    quotation: {...quotationData,  items },    
    request,                     
    client,                     
    user,                       
                         
  };
}

