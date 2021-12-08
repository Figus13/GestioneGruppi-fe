import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, QueryList, SimpleChanges,
  ViewChildren
} from '@angular/core';
import {Consegna} from '../../models/consegna.model';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Elaborato} from '../../models/elaborato.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ElaboratoDialogComponent} from './elaborato-dialog/elaborato-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConsegnaDialogComponent} from './consegna-dialog/consegna-dialog.component';
import {ElaboratoForTeacher} from '../../models/elaboratoForTeacher';
import {MatSelectChange} from '@angular/material/select';
import {VisualizzaConsegnaDialogComponent} from './visualizza-consegna-dialog/visualizza-consegna-dialog.component';

@Component({
  selector: 'app-consegne',
  templateUrl: './consegne.component.html',
  styleUrls: ['./consegne.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ConsegneComponent implements OnInit, OnChanges {

  /**
   * Attributi
   */

  stati: string[] = ['ALL', 'NULL', 'LETTO', 'CONSEGNATO', 'RIVISTO'];
  dataSource: MatTableDataSource<Elaborato>;
  elaboratiData: Elaborato[] = [];
  //nome, cognome, matricola dello studente a cui corrisponde, lo stato e il timestamp
  displayedColumns: string[] = ['name', 'firstName', 'studentId', 'stato', 'dataCaricamento'];
  innerDisplayedColumns: string[] = ['name', 'firstName', 'studentId', 'stato', 'dataCaricamento', 'possibileRiconsegna', 'voto'];
  expandedElement: ElaboratoForTeacher | null;
  lastOne: boolean = false;
  _consegne: Consegna[];
  actualConsegna: Consegna;
  private idExternal: number;
  private elaborato: any;
  private noConsegnaMaRevisione: boolean;

  @ViewChildren('innerTables') innerTables: QueryList<MatTable<ElaboratoForTeacher>>;

  /**
   * Input e output
   */

  @Input()
  set consegne(consegneArray: Consegna[]) {
    if (consegneArray != null) {
      consegneArray.sort((a, b) => a['rilascio'] > b['rilascio'] ? -1 : a['rilascio'] === b['rilascio'] ? 0 : +1);
      this._consegne = consegneArray;
    } else {
      this._consegne = Array<Consegna>();
    }
  }

  @Input()
  set elaborati(elaboratiArray: Elaborato[]) {
    if (elaboratiArray != null) {
      elaboratiArray.sort((a, b) => a['dataCaricamento'] > b['dataCaricamento'] ? -1 : a['dataCaricamento'] === b['dataCaricamento'] ? 0 : +1);
      this.elaboratiData = new Array<Elaborato>();
      elaboratiArray.forEach(elab => {
        if (elab.precedenti && Array.isArray(elab.precedenti) && elab.precedenti.length) {
          this.elaboratiData = [...this.elaboratiData, {...elab, precedenti: new MatTableDataSource(elab.precedenti)}];
        } else {
          this.elaboratiData = [...this.elaboratiData, elab];
        }
      });

      this.dataSource = new MatTableDataSource(this.elaboratiData);

    } else {
      this.dataSource = new MatTableDataSource<Elaborato>(Array<Elaborato>());

    }
  }
  //servono a trasmettere il fatto che sono arrivate nuove immagini alla onChanges
  @Input() set img(elaboratoImg: any) {
  }
  @Input() set imgConsegna(imgConsegna: any){}


  @Output('newConsegnaEmitter')
  newConsegna = new EventEmitter();

  // tslint:disable-next-line:no-output-rename
  @Output('getElaboratiEmitter')
  elaboratiEmitter = new EventEmitter();

  @Output('elaborato')
  elaboratoEmitter = new EventEmitter();

  @Output('uploadRevisione')
  uploadEmitter = new EventEmitter();

  @Output('getConsegna')
  consegnaEmitter = new EventEmitter();

  constructor(private cd: ChangeDetectorRef, public dialog1: MatDialog, public dialog2: MatDialog) {
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: Elaborato, filter: string) => {
      return data.stato === filter;
    };
  }

  /**
   * Al cambiamento degli attributi delle immagini capiscono che è stata caricata una nuova immagine da aprire in una dialog
   * vengono quindi configurati i dati e aperte le dialog corrispondenti, che alla loro chiusura scatenano gli eventi
   * appositi: di upload di una revisione o per la visualizzazione di una consegna
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.img != undefined && changes.img.currentValue != null) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.data = {
        img: changes.img.currentValue,
        lastOne: this.lastOne,
        elaborato: this.elaborato,
        consegna: this.actualConsegna,
        noConsegnaMaRevisione: this.noConsegnaMaRevisione
      };

      this.dialog2.open(ElaboratoDialogComponent, dialogConfig).afterClosed()
        .subscribe(x => {
            this.elaboratoEmitter.emit(null);
            if (x != null) {
              this.uploadEmitter.emit({
                consegnaId: this.actualConsegna.id,
                elaboratoId: this.elaborato.id,
                options: x.options,
                formData: x.formData
              });
              this.elaboratiEmitter.emit(this.actualConsegna.id);
            }
          }
        );

    } if (changes.imgConsegna != undefined && changes.imgConsegna.currentValue != null) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.data = {
        img: changes.imgConsegna.currentValue
      };
      this.dialog2.open(VisualizzaConsegnaDialogComponent, dialogConfig).afterClosed().subscribe(x => {
        this.consegnaEmitter.emit(null);
      });
    }
  }

  /**
   * Seleziona una consegna
   * @param consegna
   */
  setStep(consegna: Consegna) {
    this.actualConsegna = consegna;
    this.elaboratiEmitter.emit(consegna.id);
  }

  /**
   * Applica i filtri sullo stato degli elaborati
   * @param $event
   */
  applyFilter($event: MatSelectChange) {
    if ($event.value === 'ALL') {
      $event.value = '';
    }
    this.dataSource.filter = $event.value;
  }

  /**
   * Toggle per le righe, idExternal è l'id della tabella esterna, che viene salvato per fare successivamente confronti con
   * quella interna
   * @param row
   */
  toggleRow(row: Elaborato) {
    row.precedenti && (row.precedenti as MatTableDataSource<ElaboratoForTeacher>).data.length ? (this.expandedElement = this.expandedElement === row ? null : row) : null;
    this.cd.detectChanges();
    this.idExternal = row.id;
  }

  /**
   * Apertura della dialog per la consegna, alla chiusura se sono stati ritornati dati scatena l'evento per una nuova consegna.
   */
  openDialogConsegna() {
    const dialogRef = this.dialog1.open(ConsegnaDialogComponent);
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data != undefined && data.formData != undefined && data.options != undefined) {
          let map = new Map<string, any>();
          map.set('formData', data.formData);
          map.set('options', data.options);
          this.newConsegna.emit(map);
        }
      }
    );
  }

  /**
   * Se l'elaborato ha stato "CONSEGNATO", "RIVISTO", o è l'ultimo
   * @param row
   */
  openElaborato(row) {
    const consegnaId = this.actualConsegna.id;
    this.elaborato = row;
    if (this.idExternal === row.id) {
      this.lastOne = true;
    }else{
      this.lastOne = false;
    }
    this.noConsegnaMaRevisione = this.trovaElaboratoLength(this.elaborato.id) > 2;
    if(this.elaborato.stato === 'CONSEGNATO' || this.elaborato.stato === 'RIVISTO' || this.checkLast(row)){
      let data = {consegnaId: consegnaId, elaborato: row};
      this.elaboratoEmitter.emit(data);
    }
  }

  /**
   *
   * @param id
   */
  trovaElaboratoLength(id: any): number {
    let index = this.elaboratiData.findIndex(x => x.id === id);
    if(index != -1){
      let tmp  = this.elaboratiData[index].precedenti as MatTableDataSource<ElaboratoForTeacher>;
      return tmp.data.length;
    }
    else{
      return 0;
    }
  }

  /**
   * Controlla se la riga cliccata è ha id uguale a quello della tabella esterna e quindi se è l'ultima in ordine temporale
   * @param row
   */
  checkLast(row: any) {
    if (this.idExternal === row.id) {
      return true;
    }else{
      return false;
    }
  }

  /**
   * Lancia l'evento di apertura di una consegna.
   */
  openConsegna(consegna : Consegna) {
    this.consegnaEmitter.emit(consegna.id);
  }
}

