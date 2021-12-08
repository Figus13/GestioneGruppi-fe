import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {from, Observable, Subject, throwError} from 'rxjs';
import {Student} from '../models/student.model';
import {catchError, concatMap, map, toArray} from 'rxjs/operators';
import {Course} from '../models/course.model';
import {ModelloVM} from '../models/modelloVM.model';
import {Parametri} from '../models/parametri.model';
import {Consegna} from '../models/consegna.model';
import {ElaboratoBE} from '../models/elaboratoBE.model';
import {Team} from '../models/team.model';
import {VirtualMachine} from '../models/virtualMachine.model';
import {AuthService} from '../auth/auth.service';
import {ElaboratoForTeacher} from '../models/elaboratoForTeacher';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TeacherService{

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json', Authorization: 'my-auth-token' })};
  private API_PATH = 'http://localhost:4200/api';

  private courseName: string;
  private subject = new Subject<string>();
  courseObs = this.subject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {
    this.courseName = null;
  }

  /**
   * Setta il nome del corso attualmente selezionato
   * @param courseName
   */
  setCourse(courseName: string) {
    if (courseName !== null) {
      this.subject.next(courseName);
      this.courseName = courseName;
    }
  }

  /**
   *Metodo per ottenere i dati del corso selezionato
   */
  getSelectedCourse() {
    return this.http.get<Course>(`${this.API_PATH}/courses/${this.courseName}`)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(`Error get course: ${err.message}`);
        })
      );
  }

  /**
   * Metodo per ottenere tutti i corsi relativi a un docente (ottenuto tramite lettura dello userId)
   */
  getCourses(): Observable<Course[]> {
    const teacherId = localStorage.getItem('userId');
    return this.http
      .get<Course[]>(`${this.API_PATH}/teachers/` + teacherId + `/courses`)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(`error getCourses: ${err.message}`);
        })
      );
  }

  /**
   * Metodo per aggiungere un corso di un docente
   * @param parametriDTO
   */
  addCourse(parametriDTO: Parametri){
    return this.http.post<Course>(`${this.API_PATH}/courses`, parametriDTO, this.httpOptions).pipe(
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    );
  }

  /**
   * Metodo per ottenere le consegne relative a un corso
   */
  getConsegneForCourse(): Observable<Consegna[]> {
    return this.http.get<Consegna[]>(`${this.API_PATH}/courses/${this.courseName}/consegne`);
  }

  /**
   * Metodo per ottenere gli elaborati relativi a una consegna del corso selezionato
   * @param consegnaId
   */
  getElaboratiForCourseAndConsegnaId( consegnaId: string): Observable<ElaboratoForTeacher[]>{
    return this.http.get<ElaboratoForTeacher[]>(`${this.API_PATH}/courses/${this.courseName}/consegne/${consegnaId}/elaborati`);
  }

  /**
   * Metodo per caricare l'immagine profilo del docente loggato
   * @param image
   * @param options
   */
  uploadImage(image: any, options: any) {
    const teacherId = localStorage.getItem('userId');
    return this.http.post( `${this.API_PATH}/teachers/${teacherId}/uploadImage`, image, options ).pipe(
      catchError(err => {
        return throwError(err); } )
    );
  }

  /**
   * Metodo per ottenere un elaborato data la consegnaId e l'elaboratoId (ElaboratoBE sta per Elaborato Back End,
     così come è salvato sul server, mentre lato client viene rielaborato con all'interno i precedenti)
   * @param consegnaId
   * @param elaborato
   */
  getElaborato(  consegnaId: string, elaborato: ElaboratoBE){
    return this.http.get(`${this.API_PATH}/courses/${this.courseName}/students/${elaborato.studentId}/consegne/${consegnaId}/elaborati/${elaborato.id}`, {responseType: 'text'} ).pipe(
      catchError(err => {
        return throwError(`error: ${err.message}`);
      })
    );
  }

  /**
   * Metodo per caricare una revisione di un elaborato
   * @param consegnaId
   * @param elaboratoId
   * @param options
   * @param image
   */
  uploadRevisione( consegnaId: string, elaboratoId: string, options: any, image: any){
    return this.http.post( `${this.API_PATH}/courses/${this.courseName}/consegne/${consegnaId}/elaborati/${elaboratoId}`, image, options ).pipe(
      catchError(err => {
        console.log('Errore upload');
        return throwError(err); } )
    );
  }

  /**
   * Metodo per aggiungere una consegna
   * @param options
   * @param image
   */
  addConsegna(options: any, image: any){
    return this.http.post(`${this.API_PATH}/courses/${this.courseName}/consegne`, image, options).pipe(
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    );
  }

  /**
   * Metodo per rimuovere uno studente dal corso selezionato
   * @param student
   */
  removeStudentFromCourse(student: Student): Observable<Student> {
    return this.http.post<any>(`${this.API_PATH}/courses/${this.courseName}/unEnrollOne`,
      {id: student.id}, this.httpOptions)
      .pipe(catchError(err => {
        console.error(err);
        return throwError(err);
      }));
  }

  /**
   * Metodo per rimuovere più studenti dal corso selezionato, richiama con concatMap il metodo precedente
   * @param students
   */
   removeStudentsFromCourse(students: Student[]): Observable<any>{
    return from(students).pipe(
      concatMap((student) => {
        return this.removeStudentFromCourse(student) as Observable<Student>;
      }),
      catchError(err => throwError(err)),
      toArray()
    );
  }

  /**
  Metodo per ottenere gli studenti iscritti al corso selezionato
   */
  getEnrolledStudents(): Observable<Student[]>{
    return this.http
      .get<Student[]>(`${this.API_PATH}/courses/${this.courseName}/enrolled`)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(`error: ${err.message}`);
        })
      );
  }

  /**
   * Metodo per iscrivere uno studente al corso selezionato
   * @param studentId
   */
  enrollStudent(studentId: string ): Observable<any>{

    return this.http.post(`${this.API_PATH}/courses/${this.courseName}/enrollOne`, {id: studentId} )
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(err);
        })
      );

  }

  /**
   * Metodo per ottenere tutti gli studenti non iscritti al corso selezionato
   */
  getNotEnrolledStudent(): Observable<Student[]> {
    return this.http
      .get<Student[]>(`${this.API_PATH}/courses/${this.courseName}/notEnrolled`)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(`error getAllStudents: ${err.message}`);
        })
      );
  }

  /**
   * Metodo per iscrivere più studenti tramite un file CSV al corso selezionato
   * @param file
   */
  enrollStudentsCSV(file){
    return this.http.post(`${this.API_PATH}/courses/${this.courseName}/enrollMany`, file).pipe(
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    );
  }

  /**
   * Metodo per ottenere i team relativi al corso selezionato
   */
  getTeamsForCourse() {
    return this.http
      .get<Team[]>(`${this.API_PATH}/courses/${this.courseName}/teams`)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(`error: ${err.message}`);
        })
      );
  }

  /**
   * Metodo per ottenere le macchine virtuali relative a un certo teamId
   * @param id
   */
  getVmsForTeam( id: number) {

    return this.http
      .get<VirtualMachine[]>(`${this.API_PATH}/courses/${this.courseName}/teams/${id}/virtualMachines`)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(`error: ${err.message}`);
        })
      );
  }

  /**
   * Metodo per ottenere il modello (i vincoli) delle macchine virtuali per il corso selezionato
   */
  getModelloVMForCourse(){
    return this.http.get<ModelloVM>(`${this.API_PATH}/courses/${this.courseName}/modelloVM`).pipe(
      catchError(err => {
        console.error(err);
        return throwError(`error: ${err.message}`);
      })
    );
  }

  /**
   * Metodo per aggiornare i dati del modello di macchina virtuale del corso selezionato
   * @param vmModel
   */
  updateModelloVM(vmModel: ModelloVM) {
    return this.http.put<ModelloVM>(`${this.API_PATH}/courses/${this.courseName}/modelloVM`, vmModel).pipe(
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    );
  }

  /**
   * Metodo per ottenere una macchina virtuale dato il suo Id e il teamId
   * @param vmId
   * @param teamId
   */
  getVm(vmId: string, teamId: string): Observable<any>{
    return this.http.get(`${this.API_PATH}/courses/${this.courseName}/teams/${teamId}/virtualMachines/${vmId}`, {responseType: 'text'} ).pipe(
      catchError(err => {
        console.log('errore errore errore');

        console.error(err);
        return throwError(`error: ${err.message}`);
      })
    );

  }

  /**
   * Metodo per ottenere l'immagine di profilo di un docente
   */
  getImageForTeacher(): Observable<any>{
    const teacherId = localStorage.getItem('userId');
    return this.http.get(`${this.API_PATH}/teachers/${teacherId}/getImage`, {responseType: 'text'} ).pipe(
      catchError(err => {
        return throwError(`error: ${err.message}`);
      })
    );

  }

  /**
   * Metodo per modificare i dati del corso selezionato
   * @param course
   */
  modifyCourse(course: Course) {
    return this.http.put<any>(`${this.API_PATH}/courses/${this.courseName}`, course ).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }

  /**
   * Metodo per cancellare un corso dato il suo nome
   * @param courseName
   */
  deleteCourse(courseName: string){
    return this.http.delete(`${this.API_PATH}/courses/${courseName}` ).pipe(
      catchError(err => {
        return throwError(err);
      })
    );

  }

  /**
   * Metodo per ottenere una consegna del corso selezionato tramite il suo Id
   * @param consegnaId
   */
  getConsegna(consegnaId: string) {
    return this.http.get(`${this.API_PATH}/courses/${this.courseName}/consegne/${consegnaId}` , {responseType: 'text'}).pipe(
      catchError(err => {
        return throwError(`error: ${err.message}`);
      }))
  }
}
