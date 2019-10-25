import { Router } from 'express';
import { authRequired } from 'middlewares/authRequired';

import { create } from './create';

export const router = Router({ mergeParams: true });

router.use(authRequired());
router.post('/', create);