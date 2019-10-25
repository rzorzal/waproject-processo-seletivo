import device from 'react-native-device-info';
import { IOrder } from '~/interfaces/models/order';
import apiService, { ApiService } from './api';
import tokenService, { TokenService } from './token';
import { first, switchMap, map, distinctUntilChanged } from 'rxjs/operators';
import cache, { ICacheResult, cacheClean } from '~/helpers/rxjs-operators/cache';
import { Observable, of } from 'rxjs';
import { ServiceError } from '~/errors/serviceError';

export class OrderService {
  constructor(
    private apiService: ApiService,
    private tokenService: TokenService
  ) {}


  public get(refresh?: boolean): Observable<ICacheResult<cacheClean>> {
    return this.tokenService.getToken().pipe(
      switchMap(token => {
        if (!token) {
          throw new ServiceError('Problemas ao recuperar um Pedido');
        }

        return this.apiService.get<IOrder>('/order').pipe(cache('service-profile', { refresh }));
      })
    );
  }

  public save(model: IOrder): Observable<IOrder> {
	console.log(model)
     return this.tokenService.getToken().pipe(
      switchMap(token => {
	console.log(token);
        if (!token) {
          throw new ServiceError('Problemas ao salvar um Pedido');
        }

        return this.apiService.post<IOrder>('/order', model).pipe(cache('service-profile'));
      })
    );
  }


}

const orderService = new OrderService(apiService, tokenService);
export default orderService;
