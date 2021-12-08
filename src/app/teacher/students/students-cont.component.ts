import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Student} from '../../models/student.model';

import {Subscription} from 'rxjs';
import {TeacherService} from '../../services/teacher.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Course} from '../../models/course.model';

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements OnDestroy, OnInit {

  notEnrolledStudents: Student[];
  enrolledStudents: Student[];
  private notEnrolledSub: Subscription;
  private enrolledSub: Subscription;
  course : Course;


  constructor(private teacherService: TeacherService, private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe( x => {
      this.teacherService.setCourse(x.get('courseName'));
      this.enrolledSub = this.teacherService.getEnrolledStudents().subscribe(students => this.enrolledStudents = students, err => this.router.navigate(['/']));
      this.notEnrolledSub = this.teacherService.getNotEnrolledStudent().subscribe(students => this.notEnrolledStudents = students, err => this.router.navigate(['/']));
      this.teacherService.getSelectedCourse().subscribe(course  => {this.course = course; } );
    });
  }

  ngOnInit(): void {

  }

  addStudent(student: Student) {
    this.teacherService.enrollStudent(student.id).subscribe(x => {
      this.enrolledSub = this.teacherService.getEnrolledStudents().subscribe(s => this.enrolledStudents = s);
      this.notEnrolledSub = this.teacherService.getNotEnrolledStudent().subscribe(students => this.notEnrolledStudents = students);
    },
      error => {
        if(error.status === 400){
          alert('Errore nella richiesta!');
        }else if(error.status === 404){
          alert('Corso/Studente non trovato!');
        }else if(error.status === 403){
          alert('Il corso non è abilitato, non possono essere iscritti studenti!');
        }else if(error.status === 409){
          alert('Studente già iscritto al corso!');
        }
      });
  }

  removeStudent(students: Student[]) {
    this.teacherService.removeStudentsFromCourse(students).subscribe(x => {
      this.enrolledSub = this.teacherService.getEnrolledStudents().subscribe(s => this.enrolledStudents = s);
      this.notEnrolledSub = this.teacherService.getNotEnrolledStudent().subscribe(students => this.notEnrolledStudents = students);
    },
      error => {
        if(error.status === 400){
          alert('Errore nella richiesta!');
        }else if(error.status === 404){
          alert('Corso/Studente non trovato!');
        }else if(error.status === 403){
          alert('O il corso non è abilitato, o non sei un docente del corso!');
        }else if(error.status === 409){
          alert('Uno studente non è iscritto al corso!');
        }
      });
  }

  uploadFile(file: any) {
    this.teacherService.enrollStudentsCSV(file).subscribe(x => {
      this.enrolledSub = this.teacherService.getEnrolledStudents().subscribe(s => this.enrolledStudents = s);
      this.notEnrolledSub = this.teacherService.getNotEnrolledStudent().subscribe(students => this.notEnrolledStudents = students);
    },
      error => {
        if(error.status === 400){
          alert('Errore nella richiesta!');
        }else if(error.status === 404){
          alert('Corso/Studente non trovato!');
        }else if(error.status === 403){
          alert('Il corso non è abilitato, non si possono iscrivere studenti!');
        }else if(error.status === 415){
          alert('Il tipo di file caricato non è supportato!');
        }
      });
  }

  ngOnDestroy() {
    this.enrolledSub.unsubscribe();
    this.notEnrolledSub.unsubscribe();
  }
}
