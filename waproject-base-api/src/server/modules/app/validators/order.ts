import { IOrder } from 'interfaces/models/order';
import { joi, validateAsPromise } from 'validators';

const schema = joi.object().keys({
  id: joi.number().min(1),
  description: joi.string().trim().required().max(250),
  count: joi.number().required(),
  value: joi.string().trim().required().max(20)
});

export function validate(model: any): Promise<IOrder> {
  return validateAsPromise<any>(model, schema);
}