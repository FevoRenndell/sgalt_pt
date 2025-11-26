import { 
    getUserFilters,
    getQuotationFilters
 } from "../services/filterService.js";

export const fetchUsersFilters = async (req, res) => {
    try {
        const filters = await getUserFilters();
        res.status(200).json(filters);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching user filters', error });
    }
};

export const fetchQuotationFilters = async (req, res) => {
    try {
        const filters = await getQuotationFilters();
        res.status(200).json(filters);
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching quotation filters', error });
    }
};

 