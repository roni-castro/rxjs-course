import { Observable } from 'rxjs';

export function createHttpObservable(url) {
  return Observable.create(observer => {
    fetch(url)
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
  });
}

