import { 
    getDashboard1
 } from "../services/dashboardService.js";

 export const dashboard = async (req, res) => {
     try {
         const data = await getDashboard1();
         res.status(200).json(data);
     } catch (error) {
         next(error);
     }
 };
 
 