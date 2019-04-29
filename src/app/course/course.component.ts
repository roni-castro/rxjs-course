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
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';
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
      this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
    }

    ngAfterViewInit() {
      this.setUpInputEvent();
    }

    setUpInputEvent = () => {
      this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
          map(event => event.target.value),
          startWith(''),
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(term => this.searchLessons(term))
        );
    }

    searchLessons = (searchTerm: string = ''): Observable<Lesson[]> => {
      return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${searchTerm}`)
      .pipe(
        map(res => res['payload'])
      );
    }
}
