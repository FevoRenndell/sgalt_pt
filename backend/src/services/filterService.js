import { AppError } from '../error/AppError.js';
import db from '../models/index.js';

// filtros para usuarios
export async function getUserFilters() {
    try {
        return {
            roles: await getRoles(),
            state: await getState()
        };
    } catch (error) {
        console.error('Error fetching user selects:', error);
        throw new AppError('Error fetching user selects', 500);
    }
}

export async function getRoles() {
    try {
        return await db.models.Role.findAll({
            attributes: ['id', [db.sequelize.fn("TRIM", db.sequelize.col("description")), "name"],]
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


// filtros para solicitudes de  cotizaciones
export async function getRegions() {
    try {
        return await db.models.Region.findAll({
            attributes: ['id', 'name',]
        });
    } catch (error) {
        console.error('Error fetching regions:', error);
        throw new AppError('Error fetching regions', 500);
    }
}

export async function getCities(regionId) {
    try {
        return await db.models.City.findAll({
            attributes: ['id', 'name',],
            where: { region_id: regionId }
        });
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw new AppError('Error fetching cities', 500);
    }
}

export async function getCommunes(cityId) {
    try {
        return await db.models.Commune.findAll({
            attributes: ['id', 'name',],
            where: { city_id: cityId }
        });
    } catch (error) {
        console.error('Error fetching communes:', error);
        throw new AppError('Error fetching communes', 500);
    }
}


// filtros para cotizaciones
export async function getQuotationFilters() {
    return {
        services: await getServices(),
    }
}

export async function getServices() {
    return await db.models.Service.findAll({});
}