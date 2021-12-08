import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ModelloVM} from '../../../models/modelloVM.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {TeacherService} from '../../../services/teacher.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {

  /**
   * Attributi
   */
  modelloVM: ModelloVM;
  error: boolean;
  update: boolean;

  form = new FormGroup({
    numVcpu: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('[0-9]+')]),
    diskSpaceMB: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('[0-9]+')]),
    ramMB: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('[0-9]+')]),
    maxActiveVM: new FormControl('', [Validators.required, Validators.min(0), Validators.pattern('[0-9]+')]),
    maxTotalVM: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('[0-9]+')])
  });
  cardinalityError: boolean;

  constructor(private teacherService: TeacherService, public dialogRef: MatDialogRef<SettingsDialogComponent>) {

    this.error = false;
    this.update = false;
    this.cardinalityError = false;


    teacherService.getModelloVMForCourse().subscribe(x => {
      this.modelloVM = x;
      this.form.setValue({
        numVcpu: this.modelloVM.numVcpu,
        diskSpaceMB: this.modelloVM.diskSpaceMB,
        ramMB: this.modelloVM.ramMB,
        maxActiveVM: this.modelloVM.maxActiveVM,
        maxTotalVM: this.modelloVM.maxTotalVM
      });
    });
  }

  ngOnInit(): void {
  };

  /**
   * Chiude la dialog passando i dati del nuovo modello di macchina virtuale
   */
  updateModelloVM() {
    const val = this.form.value;
    var vmModel = new ModelloVM(val.numVcpu, val.diskSpaceMB, val.ramMB, val.maxActiveVM, val.maxTotalVM);
    this.dialogRef.close(vmModel);

  }

  /**
   * Chiude la dialog
   */
  close() {
    this.dialogRef.close();
  }

  getErrorNumVCPU() {
    if (this.form.controls.numVcpu.hasError('min') ){
      return 'Inserire un valore positivo'
    }
    if (this.form.controls.numVcpu.hasError('pattern') ){
      return 'Inserire un valore numerico'
    }
  }

  getErrorDisk(){
    if (this.form.controls.diskSpaceMB.hasError('min') ){
      return 'Inserire un valore positivo'
    }
    if (this.form.controls.diskSpaceMB.hasError('pattern') ){
      return 'Inserire un valore numerico'
    }

  }
  getErrorRam(){
    if (this.form.controls.ramMB.hasError('min') ){
      return 'Inserire un valore positivo'
    }
    if (this.form.controls.ramMB.hasError('pattern') ){
      return 'Inserire un valore numerico'
    }
  }

  getErrorVmAttive(){
    if (this.form.controls.maxActiveVM.hasError('min') ){
      return 'Inserire un valore positivo'
    }
    if (this.form.controls.maxActiveVM.hasError('pattern') ){
      return 'Inserire un valore numerico'
    }
  }

  getErrorVmTotal(){
    if (this.form.controls.maxTotalVM.hasError('min') ){
      return 'Inserire un valore positivo'
    }
    if (this.form.controls.maxTotalVM.hasError('pattern') ){
      return 'Inserire un valore numerico'
    }
  }


  checkForm() {

    if (this.form.controls.numVcpu.valid &&
      this.form.controls.diskSpaceMB.valid &&
      this.form.controls.ramMB.valid &&
      this.form.controls.maxActiveVM.valid &&
      this.form.controls.maxTotalVM.valid) {
      return false;
    } else {
      return true;
    }

  }

}
