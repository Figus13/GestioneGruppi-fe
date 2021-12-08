import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Course} from "../../models/course.model";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {TeacherService} from "../../services/teacher.service";
import {StudentService} from "../../services/student.service";

@Component({
  selector: 'app-courses-student',
  templateUrl: './courses-student.component.html',
  styleUrls: ['./courses-student.component.css']
})
export class CoursesStudentComponent implements OnInit {

  constructor(public dialog: MatDialog, private router: Router, private studentService: StudentService) { }

  ngOnInit(): void {
  }

  /**
   * Input e output
   */
  @Input()
  courses: Course[];

  // tslint:disable-next-line:no-output-rename
  @Output('selectedCourse')
  courseEmitter = new EventEmitter();

  /**
   * Emette l'output che segnala il click sopra un corso, per selezionarlo.
   * @param course
   */
  handleClick(course: Course) {
    this.courseEmitter.emit(course);
  }

}
