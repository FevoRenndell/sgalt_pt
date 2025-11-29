import {
    getQuotations,
    updateQuotation,
    deleteQuotation,
    createQuotation,
    getQuotationById,
    sendQuotationEmail
} from '../services/quotationService.js';

export const fetchQuotations = async (req, res, next) => {
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

export const fetchQuotationById = async (req, res, next) => {
    try {
        const quotationController = await getQuotationById(req.params.id);
 
        res.status(200).json(quotationController);
    } catch (error) {
        next(error);
    }
};

export const modifyQuotation = async (req, res, next) => {
    try {
        const updatedQuotation = await updateQuotation(req.params.id, req.body);
        res.status(200).json(updatedQuotation);
    } catch (error) {
        next(error);
    }
};

export const removeQuotation = async (req, res, next) => {
    try {
        const deletedQuotation = await deleteQuotation(req.params.id);
        res.status(200).json(deletedQuotation);
    } catch (error) {
        next(error);
    }
};

export const senderEmailQuotation = async (req, res, next) => {
    try {

        const result = await sendQuotationEmail(req.body);  

        res.status(200).json({ message: `Correo enviado a con la cotización ${req.body.quotation_id}` , data : result });
    } catch (error) {   
        next(error);
    }       
};
