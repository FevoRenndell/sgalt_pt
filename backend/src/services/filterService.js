import { AppError } from '../error/AppError.js';
import db from '../models/index.js';

export async function getUserFilters() {
    try {
        return { 
          roles : await getRoles(),
          state : await getState()
        };
    } catch (error) {
        console.error('Error fetching user selects:', error);
        throw new AppError('Error fetching user selects', 500);
    }
}

export async function getRoles() {
    try {
        return await db.models.Role.findAll({
            attributes: ['id',   [db.sequelize.fn("TRIM", db.sequelize.col("description")), "name"],]
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw new AppError('Error fetching roles', 500);
    }
}

export async function getState() {
    try {
        return [
            { value: true, name: 'Activo' },
            { value: false, name: 'Inactivo' }
        ];
    } catch (error) {
        console.error('Error fetching state options:', error);
        throw new AppError('Error fetching state options', 500);
    }
}