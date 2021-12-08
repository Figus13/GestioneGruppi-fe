import {Component, Inject, OnInit} from '@angular/core';
import {TeacherService} from '../../../services/teacher.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ModelloVM} from '../../../models/modelloVM.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StudentService} from '../../../services/student.service';
import {VirtualMachine} from '../../../models/virtualMachine.model';

@Component({
  selector: 'app-modify-vm-dialog',
  templateUrl: './modify-vm-dialog.component.html',
  styleUrls: ['./modify-vm-dialog.component.css']
})
export class ModifyVMDialogComponent implements OnInit {


  /**
   * Attributi
   */
  risorseDisponibili: ModelloVM;
  virtualMachine: VirtualMachine;
  error: boolean;
  update: boolean;
  form = new FormGroup({
    numVcpu: new FormControl('', [Validators.required, Validators.min(1)]),
    diskSpaceMB: new FormControl('', [Validators.required, Validators.min(1)]),
    ramMB: new FormControl('', [Validators.required, Validators.min(1)]),

  });


  constructor(public dialogRef: MatDialogRef<ModifyVMDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.error = false;
    this.update = false;

    this.virtualMachine = data.vm;

    this.risorseDisponibili = data.risorseDisponibili;

    this.form.setValue({
        numVcpu: this.virtualMachine.numVcpu,
        diskSpaceMB: this.virtualMachine.diskSpaceMB,
        ramMB: this.virtualMachine.ramMB,
    });
  }

  ngOnInit(): void {
  };

  /**
   * Aggiorno il modello della macchine virtuale passando il nuovo oggetto alla chiusura della dialog
   */
  updateModelloVM() {
    const val = this.form.value;
    const virtualMachine = new VirtualMachine(this.virtualMachine.id, val.numVcpu, val.diskSpaceMB, val.ramMB, false, this.virtualMachine.creator);
    this.dialogRef.close(virtualMachine);

  }

  /**
   * Gestioni errori della dialog
   */

  getErrorNumVcpu() {
    if (this.form.controls.numVcpu.hasError('required')) {
      return 'Inserire un valore';
    } else if (this.form.controls.numVcpu.hasError('min')) {
      return 'Inserire valore positivo';
    }
  }

  getErrorDiskSpaceMB() {
    if (this.form.controls.diskSpaceMB.hasError('required')) {
      return 'Inserire un valore';
    } else if (this.form.controls.diskSpaceMB.hasError('min')) {
      return 'Inserire valore positivo';
    }
  }

  getErrorRamMB() {
    if (this.form.controls.ramMB.hasError('required')) {
      return 'Inserire un valore';
    } else if (this.form.controls.ramMB.hasError('min')) {
      return 'Inserire valore positivo';
    }
  }

  /**
   * Chiusura della dialog
   */
  close() {
    this.dialogRef.close(null);
  }
}

