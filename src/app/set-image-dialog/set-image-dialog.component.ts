import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-teacher-image-dialog',
  templateUrl: './set-image-dialog.component.html',
  styleUrls: ['./set-image-dialog.component.css']
})
export class SetImageDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SetImageDialogComponent>, public fb: FormBuilder) { }

  formGroup: FormGroup;

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      imageInput: ['']
    });
  }

  /**
   * Setta il campo nel formGroup con l'immagine ricevuta in input
   * @param imageInput
   */
  processFile(imageInput: any) {
    if (imageInput.target.files.length > 0) {
      const file = imageInput.target.files[0];
      this.formGroup.get('imageInput').setValue(file);
    }
  }

  /**
   * Chiude la dialog
   */
  close(){
    this.dialogRef.close(null);
  }

  /**
   * Chiude la dialog passando nei dati l'immagine salvata nel formGroup
   */
  upload() {
    const options = { params : new HttpParams().set('Content-Type', 'multipart/form-data')}
    const formData = new FormData();
    formData.append('file', this.formGroup.get('imageInput').value);
    this.dialogRef.close({img:formData, option:options});
  }
}
