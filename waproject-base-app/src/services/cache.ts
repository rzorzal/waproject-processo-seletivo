import dateFnsAddMinutes from 'date-fns/addMinutes';
import dateFnsIsBefore from 'date-fns/isBefore';
import storageService from '~/facades/storage';
import { ICache } from '~/interfaces/cache';
import { Subject, Observable, of } from 'rxjs';
import { filter, map, debounceTime, tap, concat } from 'rxjs/operators';

export class CacheService {
  private change$ = new Subject<{ key: string; value: ICache }>();
  private memory: { [key: string]: ICache };

  constructor() {
    this.memory = {};
  }

  public getData<T = any>(key: string): Observable<ICache<T>> {
    if (this.memory[key]) return of(this.memory[key]);
    return storageService.get('app-cache-' + key);
  }

  public watchData<T>(key: string): Observable<ICache<T>> {
    return this.getData<T>(key).pipe(
      concat(
        this.change$.pipe(
          filter(data => data.key === key),
          map(data => data.value)
        )
      ),
      debounceTime(100)
    );
  }

  public removeData(key: string) {
    return storageService.set('app-cache-' + key, null).pipe(
      tap(() => (this.memory[key] = null)),
      tap(() => this.change$.next({ key, value: null }))
    );
  }

  public saveData<T>(
    key: string,
    data: T,
    options: { persist: boolean; expirationMinutes: number } = { persist: false, expirationMinutes: 5 }
  ): Observable<ICache<T>> {
    const cache: ICache<T> = {
      createdAt: new Date(),
      expirationDate: dateFnsAddMinutes(new Date(), options.expirationMinutes),
      data
    };

    if (options.persist) {
      return storageService.set('app-cache-' + key, cache).pipe(tap(() => this.change$.next({ key, value: cache })));
    }

    return of(true).pipe(
      map(() => {
        this.memory[key] = cache;
        this.change$.next({ key, value: cache });
        return cache;
      })
    );
  }

  public isExpirated(cache: ICache): boolean {
    return dateFnsIsBefore(cache.expirationDate, new Date());
  }

  public clear(): Observable<void> {
    return storageService.clear(/^app-cache-/gi).pipe(tap(() => (this.memory = {})));
  }
}

const cacheService = new CacheService();
export default cacheService;
