import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, timer, throwError} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap, finalize, delay, take} from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    private beginnerCourses$: Observable<Course[]>;
    private advancedCourses$: Observable<Course[]>;

    constructor() {
    }

    ngOnInit() {

      const http$ = createHttpObservable('/api/courses');
      const courses$: Observable<Course[]>  = http$
        .pipe(
          catchError(err => {
            console.log('Error: ' + err);
            return throwError(err);
          }),
          finalize(() => {
            console.log('Finalize executed...');
          }),
          tap(() => console.log('Fetch course request executed')),
          map(res => {
            return Object.values(res['payload']);
          }),
          shareReplay(),
          retryWhen(errors => errors.pipe(
            delay(2000),
            take(2)
          )),
        );

        this.beginnerCourses$ = courses$
        .pipe(map(courses => {
          return courses.filter(course => course.category === 'BEGINNER');
        }));

        this.advancedCourses$ = courses$
        .pipe(map(courses => {
          return courses.filter(course => course.category === 'ADVANCED');
        }));
    }
}
