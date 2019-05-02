import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export function createHttpObservable(url) {
  return Observable.create(observer => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    fetch(url, {signal})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return observer.error('Error ocurred with status: ' + response.status);
      }
    })
    .then(data => {
      observer.next(data);
      observer.complete();
    })
    .catch(err => {
      observer.error(err);
    });
    return () => abortController.abort();
  });
}


export const debugOperator = (message: string) =>
  (source: Observable<any>) => source
    .pipe(
      tap((val) => console.log(message, val))
    );
