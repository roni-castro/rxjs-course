import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import { fromEvent, Observable, forkJoin} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable, debugOperator } from '../common/util';
import { searchLessons } from '../../../server/search-lessons.route';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
    courseId = '';
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput') input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {
      this.courseId = this.route.snapshot.params['id'];
      this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
        .pipe(
          debugOperator('Course: ')
        );

      // const lessons$ = this.searchLessons();
      // const coursesAndLessons$ = forkJoin(this.course$, lessons$);
      // coursesAndLessons$.subscribe(
      //   ([course, lessons]) => {
      //     console.log('Course: ', course),
      //     console.log('Lessons: ', lessons);
      //   });
    }

    ngAfterViewInit() {
      this.setUpInputEvent();
    }

    setUpInputEvent = () => {
      this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
          map(event => event.target.value),
          startWith(''),
          debugOperator('Search: '),
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(term => this.searchLessons(term)),
          debugOperator('Lessons: '),
        );
    }

    searchLessons = (searchTerm: string = ''): Observable<Lesson[]> => {
      return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${searchTerm}`)
      .pipe(
        map(res => res['payload'])
      );
    }
}
