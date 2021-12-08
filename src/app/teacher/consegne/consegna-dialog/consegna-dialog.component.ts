import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-consegna-dialog',
  templateUrl: './consegna-dialog.component.html',
  styleUrls: ['./consegna-dialog.component.css']
})
export class ConsegnaDialogComponent implements OnInit {

  /**
   * Attributi
   */
  file: File;
  date: Date;
  errors = false;
  formGroup: FormGroup;


  ngOnInit() {
    this.formGroup = this.fb.group({
      nameControl: ['', Validators.required],
      imageInput: [''],
      deliveryDate: [new Date()]
    });
  }

  constructor(public dialogRef: MatDialogRef<ConsegnaDialogComponent>, public fb: FormBuilder) {
  }

  /**
   * Assegna l'immagine ottenuta nel formGroup
   * @param imageInput
   */
  processFile(imageInput: any) {
    if (imageInput.target.files.length > 0) {
      const file = imageInput.target.files[0];
      this.formGroup.get('imageInput').setValue(file);
    }

  }

  /**
   * Metodo per aggiungere una nuova consegna
   */
  addNewConsegna() {
    // se sono presenti errori nel formGroup non faccio l'operazione ma visualizzo nella dialog tramite flag gli errori
    if (this.formGroup.get('imageInput').value === null || this.formGroup.controls.deliveryDate.value === null
      || this.formGroup.get('imageInput').value === undefined || this.formGroup.controls.deliveryDate.value === undefined ) {
      this.errors = true;
    } else {
      //altrimenti inizializzo i parametri necessari: la scadenza e il nome
      this.errors = false;
      const formData = new FormData();
      formData.append('file', this.formGroup.get('imageInput').value);
       let date  = this.formGroup.controls.deliveryDate.value;
       let day = date.getDate();
       let dayStr;
       if( day < 10){
         dayStr = '0' + day.toString();
       }else{
         dayStr = day.toString();
       }
      let month = date.getMonth() + 1;
      let monthStr;
      if( month < 10){
        monthStr = '0' + month.toString();
      }else{
        monthStr = month.toString();
      }

      let yearStr = date.getFullYear().toString();
      const options = {
        params: new HttpParams().set('scadenza', dayStr+'/'+monthStr+'/'+yearStr)
          .set('consegna', this.formGroup.controls.nameControl.value)
          .set('Content-Type', 'multipart/form-data')
      };
      this.dialogRef.close({formData, options});
    }
  }

  /**
   * Metodo per ottenere la data attuale
   */
  dataOdierna() {
    return new Date();
  }

  /**
   * Gestione degli errori del form
   */
  getErrorName() {
    if (this.formGroup.controls.nameControl.hasError('required')) {
      return 'Inserire un valore';
    }
  }


}
