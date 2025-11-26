import { AppError } from '../error/AppError.js';
import db from '../models/index.js';

export async function getQuotations() {

  return await db.models.Quotation.findAll({
    include: [
      {
        model: db.models.QuotationRequest,
        as: 'request',
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

    const flatService = items.map(i => i.service_id);

    const services = await db.models.Service.findAll({
      raw: true,
      where: {
        id: flatService
      }
    });


    const newItems = items.map(item => {

      const matchedItem = services.find(s => s.id === item.service_id);

      console.log(matchedItem)

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

    console.log({ ...data, items: newItems, total, subTotal, user_id : 1 })


    quotation = await db.models.Quotation.create({
      ...data,
      items: newItems,
      subtotal: subTotal,
      total: total,
      user_id : 1,
    },
      { transaction }
    )


    /*const quotation = await db.models.QuotationRequest.create({
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
    );*/

    await transaction.commit();
    return quotation;

  } catch (error) {console.log(error)
    await transaction.rollback();
    throw error;
  }
}

export async function getQuotationById(userId) {
  try {
    return await db.models.Quotation.findByPk(userId, {
      include: [
        {
          model: db.models.QuotationRequest,
          as: 'request',
        },
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

