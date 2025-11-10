import { 
    getClients
} from '../services/clientService.js';

export const getAllClients = async (req, res, next) => {
  try {
    const clients = await getClients();
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

 
 