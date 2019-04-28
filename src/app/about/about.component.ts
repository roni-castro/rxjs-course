import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { interval, merge, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const stream1$ = interval(1000);

    const merge$ = stream1$.pipe(mergeMap((value) => this.stream2(value)));
    merge$.subscribe(console.log);
  }

  stream2 = (value: number): Observable<number> => {
    return of(value + 10);
  }

}
