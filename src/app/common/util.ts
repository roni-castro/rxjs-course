import { Observable } from 'rxjs';

export function createHttpObservable(url) {
  return Observable.create(observer => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    fetch(url, {signal})
    .then(response => {
      return response.json();
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

