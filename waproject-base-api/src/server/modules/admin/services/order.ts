import { ServiceError } from 'errors/service';
import {  IOrder } from 'interfaces/models/order';
import { Order } from 'models/order';

import * as orderRepository from '../repositories/order';

export async function save(model: IOrder): Promise<Order> {
  if (model.id) return await update(model);
  return await create(model);
}

export async function remove(orderId: number): Promise<void> {
  const order = await orderRepository.findById(orderId);

  if (!order) throw new ServiceError('not-found');

  return await orderRepository.remove(orderId);
}

async function create(model: IOrder): Promise<Order> {
  const order = await orderRepository.insert(model);

  return order;
}

async function update(model: IOrder): Promise<Order> {

  const order = await orderRepository.findById(model.id);

  if (!order) throw new ServiceError('not-found');

  return await orderRepository.update({ ...order, ...model } as Order);
}