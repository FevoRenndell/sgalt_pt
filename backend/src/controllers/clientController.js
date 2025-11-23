import {
    getClients,
    updateClient,
    deleteClient,
    createClient,
    getClientById,
    getClientByRut,
} from '../services/clientService.js';

export const fetchClients = async (req, res) => {
    try {
        const clients = await getClients();
        res.status(200).json(clients);
    } catch (error) {
        next(error);
    }
};

export const addClient = async (req, res, next) => {
    try {
        const newClient = await createClient(req.body);
        res.status(201).json(newClient);
    } catch (error) {
        next(error);
    }
};

export const fetchClientById = async (req, res) => {
    try {
        const client = await getClientById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        next(error);
    }
};

export const modifyClient = async (req, res) => {
    try {
        const updatedClient = await updateClient(req.params.id, req.body);
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: 'Error updating client', error });
    }
};

export const removeClient = async (req, res, next) => {
    try {
        const deletedClient = await deleteClient(req.params.id);
        res.status(200).json(deletedClient);
    } catch (error) {
        next(error);
    }
};

export const fetchClientByRut = async (req, res, next) => {
    try {
        const client = await getClientByRut(req.params.rut);
        res.status(200).json(client);
    } catch (error) {
        next(error);
    }
};

