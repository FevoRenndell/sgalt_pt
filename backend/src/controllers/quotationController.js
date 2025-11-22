import {
    getQuotations,
    updateQuotation,
    deleteQuotation,
    createQuotation,
    getQuotationById,
} from '../services/quotationService.js';

export const fetchQuotations = async (req, res) => {
    try {
        const quotationControllers = await getQuotations();
        res.status(200).json(quotationControllers);
    } catch (error) {
        next(error);
    }
};

export const addQuotation = async (req, res, next) => {
    try {
        const newQuotation = await createQuotation(req.body);
        res.status(201).json(newQuotation);
    } catch (error) {
        next(error);
    }
};

export const fetchQuotationById = async (req, res) => {
    try {
        const quotationController = await getQuotationById(req.params.id);
        if (!quotationController) {
            return res.status(404).json({ message: 'Quotation not found' });
        }
        res.status(200).json(quotationController);
    } catch (error) {
        next(error);
    }
};

export const modifyQuotation = async (req, res) => {
    try {
        const updatedQuotation = await updateQuotation(req.params.id, req.body);
        res.status(200).json(updatedQuotation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating quotationController', error });
    }
};

export const removeQuotation = async (req, res) => {
    try {
        const deletedQuotation = await deleteQuotation(req.params.id);
        res.status(200).json(deletedQuotation);
    } catch (error) {
        next(error);
    }
};

