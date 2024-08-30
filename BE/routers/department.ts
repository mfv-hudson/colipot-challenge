import express from 'express';
import { getDepartments } from "../controllers/department";

const router = express.Router();

router.get('/list', getDepartments);

export default router;
