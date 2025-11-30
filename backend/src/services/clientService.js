import { where } from 'sequelize';
import { AppError } from '../error/AppError.js';
import db from '../models/index.js';

export async function getClients() {
  return await db.models.Client.findAll({ where : { soft_delete: false } });
}

export async function createClient(clienttData) {

  const client = await db.models.Client.findOne({ where: { company_rut: clienttData.company_rut } });

  if (client) {
    throw new AppError(`Cliente con RUT ${clienttData.company_rut} ya existe`, 400);
  }

  const newClient = await db.models.Client.create(clienttData);
  
  return newClient;
}

export async function getClientById(clientId) {
  return await db.models.Client.findByPk(clientId, {});
}

export async function updateClient(clientId, updateData) {
  const client = await db.models.Client.findByPk(clientId);
  if (!client) {
    throw new AppError('Cliente no encontrado para actualizar', 400);
  }
  return await client.update(updateData);
}

export async function deleteClient(clientId) {
  const client = await db.models.Client.findByPk(clientId);
  if (!client) {
    throw new AppError('Cliente no encontrado para eliminar', 400);
  }
  await client.destroy();
  return client;
}

export async function getClientByRut(clientRut) {
  return await db.models.Client.findOne({
    where:  { company_rut: clientRut}
  });
}

export async function softDeleteClient(clientId) {
  const client = await db.models.Client.findByPk(clientId); 

  if (!client) {
    throw new AppError('Cliente no encontrado para eliminar', 400);
  }

  client.soft_delete = true;
  await client.save();
  return client;
}