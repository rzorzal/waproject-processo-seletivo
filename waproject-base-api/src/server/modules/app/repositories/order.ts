import { IOrder } from 'interfaces/models/order';
import { Order } from 'models/order';
import { Transaction } from 'objection';


export async function insert(model: IOrder, transaction?: Transaction): Promise<Order> {
  return await Order.query(transaction).insert(<Order>model);
}

