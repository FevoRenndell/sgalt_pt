import { AppError } from '../error/AppError.js';
import db from '../models/index.js';

export async function getUsers() {
  try {
    return await db.models.User.findAll({
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
      where : {
        soft_delete: false
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new AppError('Error fetching users', 500);
  }
}

export async function createUser(userData) {
    const newUser = await db.models.User.create(userData);
    return newUser;
}

export async function getUserById(userId) {
  try {
    return await db.models.User.findByPk(userId, {
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

export async function updateUser(userId, updateData) {
  try {
    const user = await db.models.User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 400);
    }
    return await user.update(updateData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw new AppError('Error updating user', 500);
  }
}

export async function deleteUser(userId) {
  try {
    const user = await db.models.User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 400);
    }
    await user.destroy();
    return user;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new AppError('Error deleting user', 500);
  }
}

 
export async function softDeleteUser(userId) {
 
    const user = await db.models.User.findByPk(userId); 

    if (!user) {
      throw new AppError('User not found', 400);
    }

    user.soft_delete = true;
    await user.save();

    return user;
 
}
