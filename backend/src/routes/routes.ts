import { Router } from 'express';
import { getTokens, getQuotes, getParams } from '../controller/controllers';

const router = Router();

router.get('/tokens', getTokens);
router.post('/quotes', getQuotes);
router.post('/params', getParams);

export default router;
