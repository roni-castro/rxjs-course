import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Course } from '../model/course';
import { createHttpObservable } from './util';
import { tap, map, filter } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class Store {
  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  init() {
    const http$: Observable<Course[]> = createHttpObservable('/api/courses');
    http$
      .pipe(
          tap(() => console.log('HTTP request executed')),
          map(res => Object.values(res['payload']) )
      )
      .subscribe(
        (courses: Course[]) => this.subject.next(courses),
        error => console.log('Error fetching courses', error),
      );
  }

  fetchBeginnerCourses() {
    return this.fetchCoursesByCategory('BEGINNER');
  }

  fetchAdvancedCourses() {
    return this.fetchCoursesByCategory('ADVANCED');
  }

  fetchCoursesByCategory(category: string): Observable<Course[]> {
    return this.courses$
      .pipe(
        map(courses => courses.filter(course => course.category === category))
      );
  }

  fetchCourseById(courseId: number) {
    return this.courses$
      .pipe(
        map(courses => courses.find(course => course.id == courseId)),
        filter(course => !!course)
      );
  }

  saveCourse(courseId: number, changes): Observable<any> {
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    const newCourses = courses.slice(0);
    newCourses[courseIndex] = {
      ...newCourses[courseIndex],
      ...changes
    };

    this.subject.next(newCourses);

    return fromPromise(fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }
}
