import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StudentService} from '../../../services/student.service';
import {VirtualMachine} from '../../../models/virtualMachine.model';
import {ModelloVM} from '../../../models/modelloVM.model';

@Component({
  selector: 'app-new-virtual-machine-dialog',
  templateUrl: './new-virtual-machine-dialog.component.html',
  styleUrls: ['./new-virtual-machine-dialog.component.css']
})
export class NewVirtualMachineDialogComponent implements OnInit {

  /**
   * Attributi
   */
  risorseDisponibili : ModelloVM;

  form = new FormGroup({
    numVcpu: new FormControl('', [Validators.required, Validators.min(1)]),
    diskSpaceMB: new FormControl('', [Validators.required, Validators.min(1)]),
    ramMB: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  constructor(public dialogRef: MatDialogRef<NewVirtualMachineDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.risorseDisponibili = data.risorseDisponibili;
  }

  ngOnInit(): void {
  }

  /**
   * Chiusura della dialog
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Creazione della nuova vm passando il nuovo oggetto alla chiusura della dialog
   */
  createNewVM() {
    const val = this.form.value;
    const vm = new VirtualMachine(null,val.numVcpu,val.diskSpaceMB,val.ramMB,false,localStorage.getItem('userId'));
    this.dialogRef.close(vm);
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
}
