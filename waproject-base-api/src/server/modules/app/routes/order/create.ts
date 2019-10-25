import { NextFunction, Request, Response } from 'express';

import * as orderService from '../../services/order';
import * as orderValidator from '../../validators/order';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
	req.body.value = String(req.body.value || "");
        const model = await orderValidator.validate(req.body);
        const order = await orderService.create(model);
        res.json(order);
    } catch (err) {
        next(err);
    }
}
