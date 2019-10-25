import { IOrder } from 'interfaces/models/order';
import { IPaginationParams } from 'interfaces/pagination';
import { Order } from 'models/order';
import { Page, Transaction } from 'objection';

export async function list(params: IPaginationParams, transaction?: Transaction): Promise<Page<IOrder>> {
  let query = Order
    .query(transaction)
    .select('*')
    .page(params.page, params.pageSize);

  if (params.orderBy) {
    query = query.orderBy(params.orderBy, params.orderDirection);
  }

  if (params.term) {
    query = query.where(query => {
      return query
        .where('description', 'ilike', `%${params.term}%`)
        .orWhere('value', 'ilike', `%${params.term}%`)
        .orWhere('count', 'ilike', `%${params.term}%`);
    });
  }

  return await query;
}

export async function remove(id: number, transaction?: Transaction): Promise<void> {
  await Order.query(transaction).del().where({ id });
}

export async function findById(id: number, transaction?: Transaction): Promise<Order> {
  return await Order.query(transaction).where({ id }).first();
}

export async function insert(model: IOrder, transaction?: Transaction): Promise<Order> {
  return await Order.query(transaction).insert(model);
}

export async function update(model: IOrder, transaction?: Transaction): Promise<Order> {
  return await Order.query(transaction).updateAndFetchById(model.id, <Order>model);
}