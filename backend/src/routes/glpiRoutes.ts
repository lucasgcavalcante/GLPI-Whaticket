import express from "express";
import multer from 'multer';
import isAuth from "../middleware/isAuth";

import * as GlpiController from "../controllers/GlpiController";

const upload = multer({ dest: 'uploads/' });

const glpiRoutes = express.Router();

glpiRoutes.get("/glpicategories", GlpiController.fetchITILCategoryFromGLPI);

glpiRoutes.get("/getglpiusers", GlpiController.fetchGLPIUsers);

glpiRoutes.get("/getglpigroups", GlpiController.fetchGLPIGroups);

glpiRoutes.post("/createticketglpi", upload.single('file'), GlpiController.createTicketGLPI);

glpiRoutes.get("/getticketinfo/:ticketId", GlpiController.fetchTicketFromGLPI);

export default glpiRoutes;