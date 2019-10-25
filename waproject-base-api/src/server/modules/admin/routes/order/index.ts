import { Router } from 'express';
import { enRoles } from 'interfaces/models/user';
import { authRequired } from 'middlewares/authRequired';

import { list } from './list';
import { remove } from './remove';


export const router = Router();

router.use(authRequired(enRoles.admin));

router.get('/', list);
router.delete('/:orderId', remove);
