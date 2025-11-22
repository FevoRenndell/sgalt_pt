import { AppError } from '../error/AppError.js';
import db from '../models/index.js';

export async function getQuotations() {
  try {
    return await db.models.Quotation.findAll({
      attributes: [
        'id',
        'first_name',
        'last_name_1',
        'last_name_2',
        'email',
        'role_id',
        'is_active',
        'created_at',
        'updated_at'
      ],
      include: [
        {
          model: db.models.Role,
          attributes: [[db.sequelize.fn("TRIM", db.sequelize.col("description")), "name"]],
          as: 'role',
        },
      ],
    });
  } catch (error) {
    console.error('Error fetching quotation:', error);
    throw new AppError('Error fetching quotation', 500);
  }
}

export async function createQuotation(userData) {
    const newQuotation = await db.models.Quotation.create(userData);
    return newQuotation;
}

export async function getQuotationById(userId) {
  try {
    return await db.models.Quotation.findByPk(userId, {
      include: [
        {
          model: db.models.Role,
          attributes: ['id', [db.sequelize.fn("TRIM", db.sequelize.col("description")), "name"],],
          as: 'role',
        },
      ],
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new AppError('Error fetching user by ID', 500);
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

