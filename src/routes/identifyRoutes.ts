import express, { Request, Response } from 'express';
import { identifyContact } from '../controllers/identifyController';

const router = express.Router();

router.post('/identify', (req: Request, res: Response) => {
    identifyContact(req, res).catch(err => {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    });
});

export default router;
