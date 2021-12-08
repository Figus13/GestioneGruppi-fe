import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Course} from '../../models/course.model';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {TeacherService} from "../../services/teacher.service";
import {NewCourseDialogWindowComponent} from './newCourse-dialog/newCourse-dialog-window.component';
import {ModifyCourseDialogComponent} from './modify-course-dialog/modify-course-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  /**
   * Attributi
   */
  selectedCourse: Course;

  /**
   * Input e Output
   */
  @Input()
  courses: Course[];

  // tslint:disable-next-line:no-output-rename
  @Output('selectedCourse')
  courseEmitter = new EventEmitter();

  @Output('addCourse')
  newCourseEmitter = new EventEmitter();

  @Output('modifyCourse')
  modifyCourseEmitter = new EventEmitter();

  @Output('delete')
  deleteEventEmitter = new EventEmitter();

  @ViewChild('deleteCourses') deleteCourses;

  constructor(public dialog: MatDialog, private router: Router, private teacherService: TeacherService) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && val.url === '/teacher/courses/newCourse'){
        this.openNewCourseDialog();
      }
    });
  }

  ngOnInit(): void {
  }

  /**
   * Seleziona il corso in base al click e lancia un evento per aggiornare i dati della vista
   * @param course
   */
  handleClick(course: Course) {
    this.selectedCourse = course;
    this.courseEmitter.emit(course);
  }

  /**
   * Apre una dialog per creare un nuovo corso, dopo la chiusura usa i parametri passati per scatenare un evento,
   * il container poi contatterà il service
   */
  openNewCourseDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    if(this.dialog.openDialogs.length<1) {
      const dialogRef = this.dialog.open(NewCourseDialogWindowComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
        parametriDTO => {
          if (parametriDTO != null) {
            this.newCourseEmitter.emit(parametriDTO);
          }
        }
      );
    }
  }

  /**
   * Apre la dialog per modificare un corso, dopo la chiusura usa i parametri passati per scatenare un evento,
   * il container poi contatterà il service
   * @param course
   */
  modifyCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {course: course};
    const dialogRef = this.dialog.open(ModifyCourseDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      course => {if ( course != null){ this.modifyCourseEmitter.emit(course); } }
    );
  }

  /**
   * Lancia un evento al container per eliminare un corso
   * @param course
   */
  deleteCourse(course: Course){
    this.deleteEventEmitter.emit(course);
  }

  toggleDelete($event: MouseEvent) {
    this.router.navigate(['/teacher/selectCourse'])
    this.deleteCourses.toggle();
  }
}

