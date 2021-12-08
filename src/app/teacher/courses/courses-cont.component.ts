import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Course} from '../../models/course.model';
import {TeacherService} from '../../services/teacher.service';
import {Subscription} from 'rxjs';
import {Parametri} from '../../models/parametri.model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ElaboratoDialogComponent} from '../consegne/elaborato-dialog/elaborato-dialog.component';
import {DeleteCourseDialogComponent} from './delete-course-dialog/delete-course-dialog.component';

@Component({
  selector: 'app-courses-cont',
  templateUrl: './courses-cont.component.html',
  styleUrls: ['./courses-cont.component.css']
})
export class CoursesContComponent implements OnInit {
  /**
   * Attributi
   */
  courses: Course[];
  coursesSub: Subscription;
  selectedCourse: string;

  @Output('selectedCourse')
  courseEmitter = new EventEmitter();

  constructor(private teacherService: TeacherService, public dialog: MatDialog, public route: Router) {
    this.teacherService.courseObs.subscribe((selectedCourse) => {
      this.selectedCourse = selectedCourse;
    });
  }

  ngOnInit(): void {
    this.coursesSub = this.teacherService.getCourses().subscribe(x => this.courses = x);
  }

  /**
   * Metodo per selezionare un corso e settarlo nel service, scatena poi un evento a teacher home per aggiornare la vista
   * @param course
   */
  selectCourse(course: Course) {
    this.teacherService.setCourse(course.name);
    this.courseEmitter.emit(course.name);
  }

  /**
   * Metodo per aggiungere un corso, al ritorno aggiorna l'elenco dei corsi
   * @param parametriDTO
   */
  addCourse(parametriDTO: Parametri) {
    this.teacherService.addCourse(parametriDTO).subscribe(course =>{
      this.teacherService.getCourses().subscribe(x => {
        this.courses = x;
        this.route.navigate(["/teacher/courses/" + course.name + "/students"]).then(r  => console.log("Redirect to students!"));
      })
    },
      error => {
        //Gestione degli errori
        if(error.status === 409){
          alert('Esiste già un corso con questo nome!');
        }else if(error.status === 400){
          alert('Errore nella richiesta! Creare il corso correttamente!');
        }else if(error.status === 403){
          alert('Il docente che vuole creare il corso non esiste! Fare Logout e accedere nuovamente!');
        }else if(error.status === 404){
          alert('Elemento non trovato!');
        }else{
          alert('Errore!');
        }
        this.route.navigate(["/teacher/selectCourse"]);
      });
  }

  /**
   * Metodo per modificare un corso, al ritorno aggiorna i corsi e se il corso selezionato è lo stesso modificato
   * aggiorna la pagina per mostrare tutti i dati aggiornati
   * @param course
   */
  modifyCourse(course: Course) {
    this.teacherService.modifyCourse(course).subscribe(subs => {
      this.teacherService.getCourses().subscribe(x => {
        this.courses = x;
        if (this.selectedCourse === course.name) {
          window.location.reload();
        }
      });
    },
      error => {
        //Gestione degli errori
        if(error.status === 400){
          alert('Errore nella richiesta!');
        }else if(error.status === 404){
          alert('Elemento non trovato!');
        }else if(error.status === 403){
          alert('Non hai i permessi per modificare questo corso!');
        }else{ //Gestione degli errori generica per i casi non gestiti direttamente
          alert('Errore!');
        }
      });
  }

  /**
   * Metodo per cancellare un corso. Apre una dialog di conferma della scelta, se il ritorno è true chiama il service per
   * cancellare il corso
   * @param course
   */
  deleteCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      course,
    };
    this.dialog.open(DeleteCourseDialogComponent, dialogConfig).afterClosed()
      .subscribe(x => {
        if (x == true) {
          this.teacherService.deleteCourse(course.name).subscribe(subs => this.teacherService.getCourses().subscribe(x => this.courses = x));
        }
      },
        error => {
        //Gestione degli errori
          if(error.status === 400){
            alert('Errore nella richiesta!');
          }else if(error.status === 404){
            alert('Elemento non trovato!');
          }else if(error.status === 403){
            alert('Non hai i permessi per eliminare questo corso!');
          }else{ //Gestione errori generico per i casi non valutati direttamente
            alert('Errore!');
          }
        });
  }
}
