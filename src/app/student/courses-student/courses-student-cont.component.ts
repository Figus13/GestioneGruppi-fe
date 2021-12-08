import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Course} from "../../models/course.model";
import {Subscription} from "rxjs";
import {StudentService} from "../../services/student.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-courses-student-cont',
  templateUrl: './courses-student-cont.component.html',
  styleUrls: ['./courses-student-cont.component.css']
})
export class CoursesStudentContComponent implements OnInit {

  constructor(private studentService: StudentService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(x => {
      this.studentService.setCourse(x.get('courseName'));
    });
  }

  ngOnInit(): void {
    this.coursesSub = this.studentService.getCourses().subscribe(x => this.courses = x);
  }

  /**
   * Attributi e output
   */
  courses: Course[];
  coursesSub: Subscription;

  @Output('selectedCourse')
  courseEmitter = new EventEmitter();

  /**
   * Chiama il servizio per selezionare il corso e emette l'output a Student-home che è stato selezionato un certo corso
   * @param course
   */
  selectCourse(course: Course) {
    this.studentService.setCourse(course.name);
    this.courseEmitter.emit(course.name);
  }

}
