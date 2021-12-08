import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Consegna} from '../../models/consegna.model';
import {ElaboratoForTeacher} from '../../models/elaboratoForTeacher';
import {MatTableDataSource} from '@angular/material/table';
import {Elaborato} from '../../models/elaborato.model';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConsegneDialogComponent} from './consegne-dialog/consegne-dialog.component';
import {VmDialogComponent} from '../../vm-dialog/vm-dialog.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-consegne-student',
  templateUrl: './consegne-student.component.html',
  styleUrls: ['./consegne-student.component.css']
})
export class ConsegneStudentComponent implements OnInit {

  constructor(public dialog: MatDialog, public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      imageInput: ['']
    });
  }

  /**
   * Attributi utilizzati
   */
  formGroup: FormGroup;
  _consegne: Consegna[];
  consegnaSelezionata: Consegna;
  _elaborati: ElaboratoForTeacher[];
  lastElaborato: ElaboratoForTeacher = null;
  dataSource: MatTableDataSource<ElaboratoForTeacher>;
  displayedColumns: string[] = ['stato', 'dataCaricamento', 'actions'];

  /**
   * Output e input
   */

  @Output('getElaboratiEmitter')
  elaboratiEmitter = new EventEmitter();

  @Output('getConsegna')
  consegnaEmitter = new EventEmitter();

  @Output('getElaborato')
  elaboratoEmitter = new EventEmitter();

  @Output('newElaborato')
  newElaboratoEmitter = new EventEmitter();

  @Input()
  set img(consegnaImg: any) {
  }

  @Input()
  set elaboratoImg(elaboratoImg: any) {
  }

  @Input()
  set elaborati(elaboratiArray: ElaboratoForTeacher[]) {
    if (elaboratiArray != null) {
      elaboratiArray.sort((a, b) => a['dataCaricamento'] > b['dataCaricamento'] ? -1 : a['dataCaricamento'] === b['dataCaricamento'] ? 0 : +1);
      this._elaborati = elaboratiArray;
      this.lastElaborato = this._elaborati[0];
      this.dataSource = new MatTableDataSource<ElaboratoForTeacher>(elaboratiArray.filter( el => el.stato != 'LETTO' && el.stato != 'NULL'));
    } else {
      this._elaborati = Array<ElaboratoForTeacher>();
      this.dataSource = new MatTableDataSource<ElaboratoForTeacher>();
    }
  }

  @Input()
  set consegne(consegneArray: Consegna[]) {
    if (consegneArray != null) {
      consegneArray.sort((a, b) => a['rilascio'] > b['rilascio'] ? -1 : a['rilascio'] === b['rilascio'] ? 0 : +1);
      this._consegne = consegneArray;
    } else {
      this._consegne = Array<Consegna>();
    }
  }


  /**
   * Seleziona la consegna
   * @param consegna
   */
  setStep(consegna: Consegna) {
    this.consegnaSelezionata = consegna;
    this.elaboratiEmitter.emit(consegna.id);
  }

  /**
   * Emette l'output per leggere la consegna
   * @param consegna
   */
  leggiConsegna(consegna: Consegna) {
    this.consegnaEmitter.emit(consegna.id);
  }

  /**
   * Osserva il cambiamento dell'immagine (che è un input settato esternamente) e apre la dialog quando necessario
   * @param changes
   */
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if (changes.img != undefined && changes.img.currentValue != null) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.data = {
        img: changes.img.currentValue
      };
      this.dialog.open(ConsegneDialogComponent, dialogConfig).afterClosed().subscribe(x => {
        this.consegnaEmitter.emit(null);
      });
    }
    if (changes.elaboratoImg != undefined && changes.elaboratoImg.currentValue != null) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.data = {
        img: changes.elaboratoImg.currentValue
      };
      this.dialog.open(ConsegneDialogComponent, dialogConfig).afterClosed().subscribe(x => {
        this.elaboratoEmitter.emit(null);
      });
    }
  }

  /**
   * Emette l'output per leggere l'elaborato, passando una mappa con tutti i dati necessari all'interno
   * @param element
   */
  leggiElaborato(elaborato: ElaboratoForTeacher) {
    let map = new Map<string, string>();
    map.set('elaboratoId', elaborato.id.toString());
    map.set('consegnaId', this.consegnaSelezionata.id.toString());
    map.set('stato', elaborato.stato);
    this.elaboratoEmitter.emit(map);
  }

  /**
   * Assegna al campo relativo nel formGroup l'immagine in input
   * @param imageInput
   */
  processFile(imageInput: any) {
    if (imageInput.target.files.length > 0) {
      const file = imageInput.target.files[0];
      this.formGroup.get('imageInput').setValue(file);
    }
  }

  /**
   * Emette l'output per caricare un nuovo elaboratom passando l'immagine del formGroup e l'Id della consegna relativa
   * come parametri di una mappa.
   */
  upload() {
    let map = new Map<string,string>();
    map.set('consegnaId', this.consegnaSelezionata.id.toString());
    map.set('img', this.formGroup.get('imageInput').value);
    this.newElaboratoEmitter.emit(map);
  }

  /**
   * Controlla se la consegna è scaduta
   * @param consegna
   */
  consegnaScaduta(consegna: Consegna) {
    let date = new Date();
    let scadenza = new Date(consegna.scadenza);
    if(scadenza.getTime() <  date.getTime()){
      return true;
    }
    return false;
  }

}
