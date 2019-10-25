import { IOrder } from 'interfaces/models/order';
import { Order } from 'models/order';

import * as orderRepository from '../repositories/order';

export async function create(model: IOrder): Promise<Order> {
  delete model.id;

  return await orderRepository.insert(model);
}