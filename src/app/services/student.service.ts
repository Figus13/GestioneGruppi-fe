import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {Observable, Subject, throwError} from "rxjs";
import {Course} from "../models/course.model";
import {catchError} from "rxjs/operators";
import {Team} from "../models/team.model";
import {Student} from "../models/student.model";
import {PropostaTeam} from "../models/propostaTeam.model";
import {VirtualMachine} from '../models/virtualMachine.model';
import {ModelloVM} from '../models/modelloVM.model';
import {ElaboratoForTeacher} from '../models/elaboratoForTeacher';
import {Consegna} from '../models/consegna.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  /**
   * Attributi
   */
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json', Authorization: 'my-auth-token'})};

  private API_PATH = 'http://localhost:4200/api';
  private NOTIFY_PATH = 'http://localhost:4200/notify';

  private courseName: string;
  private subject = new Subject<string>();
  courseObs = this.subject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.courseName = null;
  }
  /*
  Tutte le get come errore tornano un messaggio, gli altri metodi tornano l'errore intero, che verrà valutato
  nella subscribe in base al tipo di ritorno
   */
  /**
   * Chiamata per ottenere i dati del corso selezionato
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
   * Metodo per settare il corso attualmente selezionato
   */
  setCourse(courseName: string) {
    if (courseName !== null) {
      this.subject.next(courseName);
      this.courseName = courseName;
    }
  }

  /**
   * Metodo per ottenere tutti i corsi relativi a uno studente
   */
  getCourses(): Observable<Course[]> {
    const studentId = localStorage.getItem('userId');
    return this.http
      .get<Course[]>(`${this.API_PATH}/students/` + studentId + `/courses`)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(`error getCourses: ${err.message}`);
        })
      );
  }

  /**
   * Metodo per ottenere i team dati studente e corso
   */
  getTeamForStudentAndCourse() {
    const studentId = localStorage.getItem('userId');
    return this.http
      .get<Team>(`${this.API_PATH}/students/` + studentId + `/courses/` + this.courseName + `/team/`)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(`error getCourses: ${err.message}`);
        })
      );
  }

  /**
   * Metodo per ottenere i membri di un team dato il teamId
   */
  getMembersForTeam(teamId: number) {
    return this.http
      .get<Student[]>(`${this.API_PATH}/teams/` + teamId + `/members/`)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(`error getCourses: ${err.message}`);
        })
      );
  }

  /**
   * Metodo per ottenere l'immagine relativa a uno studente
   */
  getImageForStudent() {
    const studentId = localStorage.getItem('userId');
    return this.http.get(`${this.API_PATH}/students/${studentId}/getImage`, {responseType: 'text'}).pipe(
      catchError(err => {
        console.error(err);
        return throwError(`error: ${err.message}`);
      })
    );
  }

  /**
   * Metodo per fare caricare un immagine profilo relativa a uno studente
   */
  uploadImage(img: any, options: any) {
    const studentId = localStorage.getItem('userId');
    return this.http.post(`${this.API_PATH}/students/${studentId}/uploadImage`, img, options).pipe(
      catchError(err => {
        console.error(err);
        return throwError(err);
      }));
  }

  /**
   * Metodo per ottenere gli studenti che sono attualmente liberi e potrebbero essere disponibili a formare un team
   */
  getAvailableMembers() {
    return this.http
      .get<Student[]>(`${this.API_PATH}/courses/` + this.courseName + `/availableStudents`)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(`error getCourses: ${err.message}`);
        })
      );
  }

  /**
   * Metodo per ottenere le richieste di team per un singolo studente
   */
  getTeamRequests() {
    const studentId = localStorage.getItem('userId');
    const options = {params: new HttpParams().set('courseName', this.courseName)};
    return this.http
      .get<PropostaTeam[]>(`${this.API_PATH}/students/` + studentId + `/proposteTeams`, options)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(`error getCourses: ${err.message}`);
        })
      );
  }

  /**
   * Metodo per fare la proposta di un team
   */
  proposeTeam(proposta: any) {
    return this.http.post<any>(`${this.API_PATH}/courses/${this.courseName}/proposeTeam`, proposta)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(err);
        })
      );
  }

  /**
   * Metodo per accettare la proposta di un team
   */
  accettaProposta(token: string) {
    return this.http.get(`${this.NOTIFY_PATH}/notification/confirm/${token}`)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(err);
        })
      );
  }

  /**
   * Metodo per rifiutare la proposta di un team
   */
  rifiutaProposta(token: string) {
    return this.http.get(`${this.NOTIFY_PATH}/notification/reject/${token}`)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(err);
        })
      );

  }

  /**
   * Metodo per creare una macchina virtuale
   */
  createVM(vm: VirtualMachine, teamId: string) {
    const id = localStorage.getItem('userId')
    return this.http.post( `${this.API_PATH}/students/${id}/courses/${this.courseName}/teams/${teamId}/virtualMachines`, vm)
      .pipe(
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    );
  }

  /**
   * Metodo per ottenere le macchine virtuali dello studente loggato
   */
  getVMs(teamId:string): Observable<VirtualMachine[]> {
    const id = localStorage.getItem('userId')
    return this.http.get<any>( `${this.API_PATH}/students/${id}/courses/${this.courseName}/teams/${teamId}/virtualMachines`)
  }

  /**
   * Metodo per ottenere le macchine virtuali possedute dallo studente loggato
   */
  getOwnedVMs(teamId: string) {
    const id = localStorage.getItem('userId');
    return this.http.get<any>( `${this.API_PATH}/students/${id}/courses/${this.courseName}/teams/${teamId}/virtualMachines/owned`)

  }

  /**
   * Metodo per spegnere una macchina virtuale
   */
  turnOffVm(vm: VirtualMachine, team: Team) {
    const id = localStorage.getItem('userId');
    let vmToSend = new VirtualMachine(vm.id, vm.numVcpu, vm.diskSpaceMB, vm.ramMB, false, vm.creator);
    return this.http.put<VirtualMachine>(`${this.API_PATH}/students/${id}/courses/${this.courseName}/teams/${team.id}/virtualMachines/${vm.id}`, vmToSend)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(err);
        })
      );
  }

  /**
   * Metodo per accendere una macchina virtuale
   */
  turnOnVm(vm: VirtualMachine, team: Team) {
    const id = localStorage.getItem('userId');
    let vmToSend = new VirtualMachine(vm.id, vm.numVcpu, vm.diskSpaceMB, vm.ramMB, true, vm.creator);
    return this.http.put<VirtualMachine>(`${this.API_PATH}/students/${id}/courses/${this.courseName}/teams/${team.id}/virtualMachines/${vm.id}`,vmToSend )
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(err);
        })
      );
  }

  /**
   * Metodo per modificare una macchina virtuale
   */
  modifyVm(vm: VirtualMachine, team: Team) {
    const id = localStorage.getItem('userId');
    let vmToSend = new VirtualMachine(vm.id, vm.numVcpu, vm.diskSpaceMB, vm.ramMB, true, vm.creator);
    return this.http.put<any>(`${this.API_PATH}/students/${id}/courses/${this.courseName}/teams/${team.id}/virtualMachines/${vm.id}`, vmToSend)
      .pipe(
        catchError(err => {
          console.error(err);
          return throwError(err);
        })
      );
  }

  /**
   * Metodo per cancellare una macchina virtuale
   */
  deleteVm(vm: VirtualMachine, team: Team) {
    const id = localStorage.getItem('userId');
    return this.http.delete<any>(`${this.API_PATH}/students/${id}/courses/${this.courseName}/teams/${team.id}/virtualMachines/${vm.id}`)
      .pipe(
        catchError(err => {
          console.error(err);
          return  throwError(err);
        })
      );
  }

  /**
   * Metodo per ottenere il modello delle macchina virtuale del corso, che definisce le risorse disponibili
   */
  getModelloVM(){
    return this.http.get<ModelloVM>(`${this.API_PATH}/courses/${this.courseName}/modelloVM`);
  }

  /**
   * Metodo per ottenere le consegne relative allo studente loggato per il corso selezionato
   */
  getConsegneForStudentAndCourse() {
    const id = localStorage.getItem('userId');
    const options = { params : new HttpParams().set('courseName', this.courseName)}
    return this.http.get<any>(`${this.API_PATH}/students/${id}/consegne`, options);
  }

  /**
   * Metodo per ottenere gli elaborati relativi allo studente loggato e alla consegna passata
   */
  getElaboratiByConsegnaId( consegnaId: string){
    const id = localStorage.getItem('userId');
    return this.http.get<ElaboratoForTeacher[]>( `${this.API_PATH}/students/${id}/consegne/${consegnaId}/elaborati`);

  }

  /**
   * Metodo per ottenere una consegna dato l'id
   */
  getConsegna(consegnaId: string) {
    const id = localStorage.getItem('userId');
    return this.http.get(`${this.API_PATH}/students/${id}/consegne/${consegnaId}` , {responseType: 'text'}).pipe(
      catchError(err => {
        console.error(err);
        return throwError(`error: ${err.message}`);
      }))
  }

  /**
   * Metodo per ottenere un elaborato dato l'id e la consegna relativa
   */
  getElaborato(map: Map<string, string>) {
    const id = localStorage.getItem('userId');
    let consegnaId: string;
    let elaboratoId: string;
    //controllo se i parametri passati sono corretti, se non lo sono non proseguo nella richiesta
    if(map.get('consegnaId') != undefined){
       consegnaId = map.get('consegnaId');
    }else{
      return throwError(new Error('ID consegna non passato!'));
    }
    if(map.get('elaboratoId') != undefined){
      elaboratoId = map.get('elaboratoId');
    }else{
      return throwError(new Error('ID elaborato non passato!'));
    }

    return this.http.get(`${this.API_PATH}/students/${id}/consegne/${consegnaId}/elaborati/${elaboratoId}` , {responseType: 'text'}).pipe(
      catchError(err => {
        console.error(err);
        return throwError(`error: ${err.message}`);
      }))
  }

  /**
   * Metodo per segnalare la lettura di una correzione, ritorna l'immagine
   */
  leggiCorrezione(map: Map<string, string>) {
    const id = localStorage.getItem('userId');
    let consegnaId: string;
    let elaboratoId: string;
    //controllo se i parametri passati sono corretti, se non lo sono non proseguo nella richiesta
    if(map.get('consegnaId') != undefined){
      consegnaId = map.get('consegnaId');
    }else{
      return throwError(new Error('ID consegna non passato!'));
    }
    if(map.get('elaboratoId') != undefined){
      elaboratoId = map.get('elaboratoId');
    }else{
      return throwError(new Error('ID elaborato non passato!'));
    }
    return this.http.get(`${this.API_PATH}/students/${id}/consegne/${consegnaId}/correzioni/${elaboratoId}` , {responseType: 'text'}).pipe(
      catchError(err => {
        console.error(err);
        return throwError(`error: ${err.message}`);
      }))
  }

  /**
   * Metodo per caricare un elaborato
   */
  uploadElaborato(consegnaId: string, img: any, options: any) {
    const id = localStorage.getItem('userId');
    return this.http.post( `${this.API_PATH}/students/${id}/consegne/${consegnaId}/elaborati`, img, options).pipe(
      catchError(err => {
        return throwError(err);
      }))

  }

  /**
   * Metodo per ottenere gli studenti non owner di una data macchina virtuale
   */
  getAvailableStudentsForVM(vmId: string, teamId: string){
    const id = localStorage.getItem('userId');
    return this.http.get<Student[]>(`${this.API_PATH}/students/${id}/courses/${this.courseName}/teams/${teamId}/virtualMachines/${vmId}/availableStudents`).pipe(
      catchError(err => {
        console.error(err);
        return throwError(`error: ${err.message}`);
      }))

  }

  /**
   * Metodo per condividere l'ownership con una lista di utenti di un certo team
   */

  shareOwnership(vmId: string, teamId: string, ownerIds: string[]){
    const id = localStorage.getItem('userId');
    return this.http.post(`${this.API_PATH}/students/${id}/courses/${this.courseName}/teams/${teamId}/virtualMachines/${vmId}/owners`, ownerIds).pipe(
      catchError(err => {
        console.error(err);
        return throwError(err);
      }))

  }

  /**
   * Metodo per ottenere i dati di una singola macchina virtuale
   */
  getVm(vmId: any, teamId: string) {
    const id = localStorage.getItem('userId');
    return this.http.get(`${this.API_PATH}/students/${id}/courses/${this.courseName}/teams/${teamId}/virtualMachines/${vmId}`, {responseType:'text'} ).pipe(
      catchError(err => {
        console.error(err);
        return throwError(`error: ${err.message}`);
      })
    );

  }

  /**
   * Metodo per controllare se ci sono richieste accettate da un singolo studente, ritorna true o false nel caso
   */
  hasAcceptedRequest(){
    const id = localStorage.getItem('userId');
    return this.http.get<boolean>(`${this.API_PATH}/students/${id}/courses/${this.courseName}/teams/acceptedRequest`).pipe(
      catchError(err => {
        console.error(err);
        return throwError(`error: ${err.message}`);
      })
    );
  }

}
