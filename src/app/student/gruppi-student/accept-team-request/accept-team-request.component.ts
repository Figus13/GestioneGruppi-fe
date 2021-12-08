import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Proposta} from '../../../models/proposta.model';
import {StudentWithStatus} from '../../../models/studentWithStatus.model';
import {animate, state, style, transition, trigger} from '@angular/animations';

/**
 * Interfaccia base per lo studente
 */
interface Student_status{
  matricola: string;
  nome: string;
  cognome: string;
  stato: string
}

@Component({
  selector: 'app-accept-team-request',
  templateUrl: './accept-team-request.component.html',
  styleUrls: ['./accept-team-request.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AcceptTeamRequestComponent implements OnInit {

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  /**
   * Attributi
   */
  students: Student_status[];

  dataSource: MatTableDataSource<Proposta>;

  proposteData: Proposta[] = [];

  //nome, cognome, matricola dello studente a cui corrisponde, lo stato e il timestamp
  displayedColumns: string[] = ['name', 'proponenteId', 'actions'];
  innerDisplayedColumns: string[] = ['id', 'name', 'firstName', 'status'];

  expandedElement: Proposta | null;

  /**
   * Input e output
   */

  @Input()
  attesaConferma: boolean;

  @Input()
  set proposte(proposteArray: Proposta[]){
    if (proposteArray != null) {
      this.proposteData = [];
      proposteArray.forEach(p => {
        if (p.studenti && Array.isArray(p.studenti) && p.studenti.length) {
          this.proposteData = [...this.proposteData, {...p, studenti: new MatTableDataSource(p.studenti)}];
        } else {
          this.proposteData = [...this.proposteData, p];
        }
      });

      this.dataSource = new MatTableDataSource(this.proposteData);

    } else {
      this.dataSource = new MatTableDataSource<Proposta>(Array<Proposta>());
    }
  }

  @Output('accetta')
  accettaPropostaEmitter = new EventEmitter();

  @Output('rifiuta')
  rifiutaPropostaEmitter = new EventEmitter();

  /**
   * Toggle della riga cliccata
   * @param row
   */
  toggleRow(row: Proposta) {
    row.studenti && (row.studenti as MatTableDataSource<StudentWithStatus>).data.length ? (this.expandedElement = this.expandedElement === row ? null : row) : null;
    this.cd.detectChanges();
  }

  /**
   * Metodo che emette l'output relativo all'accettare una proposta di team
   * @param element
   */
  accetta(element : Proposta) {
    this.accettaPropostaEmitter.emit(element.token)
  }

  /**
   * Metodo che emette l'output relativo al rifiutare una proposta di team
   * @param element
   */
  rifiuta(element : Proposta) {
    this.rifiutaPropostaEmitter.emit(element.token)
  }
}

