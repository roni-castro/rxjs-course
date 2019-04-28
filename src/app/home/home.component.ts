import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, timer} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
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
          tap(() => console.log('Fetch course request executed')),
          map(res => {
          return Object.values(res['payload']);
          }), shareReplay()
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
