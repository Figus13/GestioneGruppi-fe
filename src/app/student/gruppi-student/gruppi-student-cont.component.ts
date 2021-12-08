import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Course} from '../../models/course.model';
import {pipe, Subscription} from 'rxjs';
import {TeacherService} from '../../services/teacher.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StudentService} from '../../services/student.service';
import {Team} from '../../models/team.model';
import {Student} from '../../models/student.model';
import {PropostaTeam} from '../../models/propostaTeam.model';
import {Proposta} from '../../models/proposta.model';
import {StudentWithStatus} from '../../models/studentWithStatus.model';
import {interval} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-gruppi-student-cont',
  templateUrl: './gruppi-student-cont.component.html',
  styleUrls: ['./gruppi-student-cont.component.css']
})
export class GruppiStudentContComponent implements OnDestroy, OnInit {

  /**
   * Attributi
   */
  team: Team;

  //Valore numerico. 3 possibilità: 0 indeterminato, -1 team non presente, +1 team presente
  teamPresent: number = 0;

  members: Student[];
  proposte: Proposta[];
  private teamSub: Subscription;
  private membersSub: Subscription;
  private requestsSub: Subscription;
  attesaConferma: boolean = false;
  private intervalSub : Subscription;
  course : Course;
  corsoAttivato: boolean;


  constructor(private route: ActivatedRoute, private studentService: StudentService, private router: Router) {

    this.route.paramMap.subscribe(x => {
      this.teamPresent = 0;
      this.studentService.setCourse(x.get('courseName'));
      this.teamSub = this.studentService.getTeamForStudentAndCourse().subscribe(team => {
        this.team = team;

        /**
         * Aggiunto il controllo sullo stato del team per vedere se tutti hanno accettato
         */

        if (this.team !== null && this.team.status != 0) {
          /* Lo studente ha già un gruppo */
          this.studentService.getSelectedCourse().subscribe(x  => {
            this.course = x;
            this.corsoAttivato = x.enabled;
            this.teamPresent = 1;
          });
          this.membersSub = this.studentService.getMembersForTeam(this.team.id).subscribe(members => this.members = members, err => this.router.navigate(['/']));
        } else {
          this.studentService.getSelectedCourse().subscribe(x  => {
            this.course = x;
            this.corsoAttivato = x.enabled;
            this.teamPresent = -1;
          });
          this.membersSub = this.studentService.getAvailableMembers().subscribe(
            members => {
              const studentId = localStorage.getItem('userId');
              this.members = members.filter(m => m.id !== studentId);
            }
            , err => this.router.navigate(['/']));
          this.getTeamRequests();

        }

      }, err => this.router.navigate(['/']));
    });
  }

  /**
   * Ogni minuto aggiorna le richieste di adesione ad un gruppo
   */
  ngOnInit() {
    this.intervalSub = interval(60000).subscribe(x => {
      this.getTeamRequests();

      if (this.attesaConferma) {
        this.studentService.getTeamForStudentAndCourse().subscribe(
          team => {
            if(team === null){
              this.attesaConferma = false;
            }
          })
      }
    });
  }

  ngOnDestroy() {
    this.teamSub.unsubscribe();
    this.intervalSub.unsubscribe();
  }
  /**
   * Ottieni le richieste di team pendenti, inoltre setto un flag attesaConferma come risultato della richiesta
   * se ci sono richieste già accettate
   */
  getTeamRequests() {
    this.studentService.hasAcceptedRequest().subscribe( accepted => this.attesaConferma = accepted);
    let proposteFinali: Proposta[] = new Array<Proposta>();
    this.requestsSub = this.studentService.getTeamRequests().subscribe(
      proposteTeam => {

        proposteTeam.forEach(
          propostaTeam => {
            let sws = new Array<StudentWithStatus>();

            propostaTeam.studentWithStatusDTOS.forEach(student => {
              let studentWithStatus = new StudentWithStatus(student.id, student.name, student.firstName, student.status);
              sws.push(studentWithStatus);
            });

            let proposta = new Proposta(propostaTeam.teamDTO.id, propostaTeam.teamDTO.name, propostaTeam.teamDTO.proponenteId, propostaTeam.token, sws);
            proposteFinali.push(proposta);
          }
        );
        this.proposte = proposteFinali;
      }, err => this.router.navigate(['/']));


  }

  /**
   * Quando viene creata la richiesta per un gruppo, vengono automaticamente rifiutate tutte le altre richieste pendenti
   */
  proposeTeam(proposta) {
    this.studentService.proposeTeam(proposta).subscribe(x => {
        this.attesaConferma = true;
        this.proposte.forEach(p => {
            this.studentService.rifiutaProposta(p.token).subscribe();
          }
        );
        this.proposte = [];
      },
      err => {
        // Gestione degli errori
        if(err.status === 400){
          alert('Errore nella richiesta!');
        }else if(err.status === 404){
          alert('Elemento non trovato!');
        }else if(err.status === 403){
          alert('Operazione non permessa!');
        }else if(err.status === 409){
          alert('Nome del team è vuoto o già utilizzato!');
        }else{
          alert('Errore!');
        }
      }
    );
  }

  /**
   * Metodo per accettare la proposta, una volta accettata deve rifiutare tutte le altre,
   * poi aggiorno il contenuto della pagina con il team attuale
   * @param token
   */
  accettaProposta(token: string) {
    this.studentService.accettaProposta(token).subscribe( x => {
      this.proposte.forEach(p => {
          if (p.token !== token) {
            this.studentService.rifiutaProposta(p.token).subscribe();
          }
        }
      );
      this.getTeamRequests();
      this.studentService.getTeamForStudentAndCourse().subscribe(
        team => {
          if (team != null && team.status === 1){
            this.team = team;
            this.studentService.getMembersForTeam(team.id).subscribe(members => {
              this.members = members;
              this.teamPresent = 1;
            });
          }
        })

    },
      error => {
      //Gestione degli errori
        if(error.status === 400){
          alert('Proposta scaduta!');
        }else if(error.status === 404){
          alert('Proposta non trovata!');
        }else{
          alert('Errore!');
        }

      });


  }

  /**
   * Metodo per rifiutare una proposta di team.
   * @param token
   */
  rifiutaProposta(token: string) {
    this.studentService.rifiutaProposta(token).subscribe( x => this.getTeamRequests(),
      error => {
      //Gestione errori
        if(error.status === 400){
          alert('Proposta scaduta!');
        }else if(error.status === 404){
          alert('Proposta non trovata!');
        }else{
          alert('Errore!');
        }
      });
  }
}
