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
    private beginnerCourses: Course[];
    private advancedCourses: Course[];

    constructor() {
    }

    ngOnInit() {

      const http$ = createHttpObservable('/api/courses');
      const courses$ = http$
        .pipe(map(res => {
          return Object.values(res['payload']);
        }));

        courses$.subscribe(courses => {
          this.beginnerCourses = courses.filter(course => course.category === 'BEGINNER');
          this.advancedCourses = courses.filter(course => course.category === 'ADVANCED');
          console.log(courses);
        }, err => {
          console.log('Error: ' + err);
        },
          console.log('completed')
        );
      }


    }


}
