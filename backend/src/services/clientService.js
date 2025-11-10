import db from '../models/index.js';

export async function getClients() {
   try{
     return await db.models.Client.findAll();
   } catch (error) {
     console.error('Error fetching clients:', error);
     throw error;
   }
}