import {
    getQuotationClient,
    createQuotationRequest,
    AcceptQuotationRequest,
    RejectQuotationRequest
} from '../services/quoterService.js';

import { 
    getRegions,
    getCities,
    getCommunes
 } from '../services/filterService.js';

export const createQuotationByClient = async (req, res, next) => {
    try {
        const quoteControllers = await createQuotationRequest(req.body);
        res.status(200).json(quoteControllers);
    } catch (error) {
        next(error);
    }
};

export const AcceptQuotationRequestByClient = async (req, res, next) => {
    try {
        const newQuote = await AcceptQuotationRequest(req.body);
        res.status(201).json(newQuote);
    } catch (error) {
        next(error);
    }
};

export const RejectQuotationRequestByClient = async (req, res, next) => {
    try {
        const rejectedQuote = await RejectQuotationRequest(req.body);
        res.status(200).json(rejectedQuote);
    } catch (error) {
        next(error);
    }
};

export const getRegionsFilter = async (req, res, next) => {
    try {
        const filters = await getRegions();
        res.status(200).json(filters);
    } catch (error) {
        next(error);
    }
};  
export const getCitiesFilter = async (req, res, next) => {
    try {
        const regionId = req.params.regionId;
        const filters = await getCities(regionId);
        res.status(200).json(filters);
    }       
    catch (error) {
        next(error);
    }   
};
export const getCommunesFilter = async (req, res, next) => {    
    try {
        const cityId = req.params.cityId;
        const filters = await getCommunes(cityId);
        res.status(200).json(filters);
    }                           
    catch (error) {             
        next(error);            
    }               
}

export const fetchQuotationClient = async (req, res, next) => {    
    try {
        const quotationId = req.params.id;
        const quotation = await getQuotationClient(quotationId, true);
        res.status(200).json(quotation);
    } catch (error) {
        next(error);
    }
}