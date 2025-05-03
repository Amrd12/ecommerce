import express from 'express';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/checkout', ensureAuthenticated, (req, res) => {
    res.render('pages/checkout', { user: req.session.user });
});

export default router;