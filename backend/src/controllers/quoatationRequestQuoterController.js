
import {
    createQuotation,
    updateQuotation,
    removeQuotation,
    getQuotationRequests,
    getQuotationRequestsById,
} from '../services/quotationRequestQuoterService.js';

export const fetchQuotationRequests = async (req, res, next) => {
    try {
        const quotationsRequests = await getQuotationRequests(req.body);
        res.status(200).json(quotationsRequests);
    } catch (error) {
        next(error);
    }
};

export const fetchQuotationRequestsById = async (req, res, next) => {
    try {
        const quotationRequest = await getQuotationRequestsById(req.params.id);
        res.status(201).json(quotationRequest);
    } catch (error) {
        next(error);
    }
};

export const createQuotationByQuoter = async (req, res, next) => {
    try {
         const newQuotationRequest = await createQuotation(req.body);
        res.status(200).json(newQuotationRequest);
    } catch (error) {
        next(error);
    }
};  
export const updateQuotationByQuoter = async (req, res, next) => {
    try {
        const quotationRequestId = req.params.id;
        const updatedQuotation = await updateQuotation(quotationRequestId, req.body);
        res.status(200).json(updatedQuotation);
    }       
    catch (error) {
        next(error);
    }   
};
export const removeQuotationByQuoter = async (req, res, next) => {    
    try {
        const quotationRequestId = req.params.id;
        const removedQuotation = await removeQuotation(quotationRequestId);
        res.status(200).json(removedQuotation);
    }                           
    catch (error) {             
        next(error);            
    }               
}