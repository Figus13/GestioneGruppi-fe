import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpParams} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TeacherService} from '../../../services/teacher.service';
import {Consegna} from '../../../models/consegna.model';

@Component({
  selector: 'app-elaborati-dialog',
  templateUrl: './elaborato-dialog.component.html',
  styleUrls: ['./elaborato-dialog.component.css']
})
export class ElaboratoDialogComponent implements OnInit {


  /**
   * Attributi
   */
  img: any;
  lastOne: boolean;
  consegna: Consegna;
  checked = false;
  errore: boolean = false;
  uploadForm: FormGroup;
  votoGroup: FormGroup;
  elaborato: any;

  @ViewChild('slideVoto') slideVoto;
  @ViewChild('slideRiconsegna') riconsegna;


  constructor(private formBuilder: FormBuilder, private teacherService: TeacherService, public dialogRef: MatDialogRef<ElaboratoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.img = data.img;
    this.lastOne = data.lastOne;
    this.consegna = data.consegna;
  }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      revisioneElaborato: ''
    });

    this.votoGroup = this.formBuilder.group({
      voto: ''
    });

    this.votoGroup.get('voto').disable();
  }

  /**
   * Chiusura della dialog
   */
  close() {
    this.dialogRef.close(null);
  }

  /**
   * Setta l'immagine del file nel form
   * @param event
   */
  revisione(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('revisioneElaborato').setValue(file);
    }
  }

  /**
   * Al click del pulsante di conferma carico la revisione o il voto in base ai flag appositi,
   * passo i valori poi alla chiusura della dialog
   */
  onSubmit() {
    if (this.riconsegna != undefined) {
      if ((this.riconsegna.checked && this.votoGroup.get('voto').value == '') || (!this.riconsegna.checked && this.votoGroup.get('voto').value != '')) {
        const formData = new FormData();
        formData.append('file', this.uploadForm.get('revisioneElaborato').value);
        let voto;

        if (this.votoGroup.get('voto').value == '') {
          voto = '-';
        } else {
          voto = this.votoGroup.get('voto').value;
        }
        const options = {params: new HttpParams().set('voto', voto).set('possibileRiconsegna', this.riconsegna.checked.toString()).set('Content-Type', 'multipart/form-data')};
        this.dialogRef.close({options, formData});

      } else {
        this.errore = true;
      }
    } else {

      if (this.votoGroup.get('voto').value == '') {
        this.errore = true;
      }else{
        const formData = new FormData();
        formData.append('file', this.uploadForm.get('revisioneElaborato').value);
        let voto = this.votoGroup.get('voto').value;
        const options = {params: new HttpParams().set('voto', voto).set('possibileRiconsegna', 'false').set('Content-Type', 'multipart/form-data')};
        this.dialogRef.close({options, formData});
      }
    }
  }


  /**
   * Cambia i due slider di voto e riconsegna in modo che uno escluda l'altro
   * @param prova
   */
  changeSlide(prova: any) {
   if(this.riconsegna != undefined) {
     if (this.slideVoto.checked && !this.riconsegna.checked) {
       this.votoGroup.controls['voto'].enable();
     }
     if (!this.slideVoto.checked) {
       this.votoGroup.controls['voto'].disable();
       this.votoGroup.controls['voto'].setValue('');
     }

     if ('slideVoto' === prova && this.riconsegna.checked) {
       this.votoGroup.controls['voto'].enable();
       this.riconsegna.toggle();
     }
     if (this.slideVoto.checked && 'slideRiconsegna' === prova) {

       this.votoGroup.controls['voto'].disable();
       this.votoGroup.controls['voto'].setValue('');
       this.slideVoto.toggle();

     }
   }else{

     if(this.slideVoto.checked){
       this.votoGroup.controls['voto'].enable();
     }else{
       this.votoGroup.controls['voto'].disable();
       this.votoGroup.controls['voto'].setValue('');
     }
   }


  }

  /**
   * Ritorna true se la consegna è scaduta, altrimenti false
   */
  consegnaScaduta() {
    let date = new Date();
    let scadenza = new Date(this.consegna.scadenza);

    if (scadenza.getTime() < date.getTime()) {
      return true;
    }
    return false;
  }

  /**
   * Ritorna true se l'immagine è vuota, altrimenti false
   */
  emptyImg(){
    return this.img === "vuoto";
  }

  /**
   * Controlla se ho caricato  l'immagine,
   * se non l'ho fatto non devo visualizzare il bottone di submit
   */
  checkFilesOrVoto() {
    return (this.uploadForm.get('revisioneElaborato').value === '');
  }

  /**
   * Controllo se il mio elemento è quello in cima alla lista degli elaborati
   */
  checkLast() {
    return this.lastOne;
  }
}
