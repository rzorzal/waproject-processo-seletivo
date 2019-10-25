import {IOrder} from 'interfaces/models/order';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import * as Rx from 'rxjs';

import apiService, { ApiService } from './api';

export class OrderService {
  constructor(private apiService: ApiService) {}

  public list(params: IPaginationParams): Rx.Observable<IPaginationResponse<IOrder>> {
    return this.apiService.get('/api/admin/order', params);
  }

  public delete(id: number): Rx.Observable<void> {
    return this.apiService.delete(`/api/admin/order/${id}`);
  }

}

const orderService = new OrderService(apiService);
export default orderService;
