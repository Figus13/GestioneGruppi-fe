import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Student} from "../../../models/student.model";
import {VirtualMachine} from "../../../models/virtualMachine.model";

@Component({
  selector: 'app-share-vm-dialog',
  templateUrl: './share-vm-dialog.component.html',
  styleUrls: ['./share-vm-dialog.component.css']
})
export class ShareVmDialogComponent implements OnInit {

  /**
   * Attributi
   */
  componentList: Student[];
  vm: VirtualMachine;
  form : FormGroup;

  constructor(public dialogRef: MatDialogRef<ShareVmDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any, private fb: FormBuilder) {
    this.componentList = data.students;
    this.vm = data.vm;
  }

  ngOnInit(): void {
    this.form = this.fb.group({studentSelect: new FormControl([''])})
  }

  /**
   * Chiusura della dialog
   */
  close() {
    this.dialogRef.close(null);
  }

  /**
   * Metodo per condividere l'ownership di una macchina virtuale, se ho un valore nel form lo inoltro alla chiusura della dialog
   */
  shareOwnership() {
     let studentSelect = this.form.get("studentSelect").value;
     if(studentSelect === []){
       this.dialogRef.close(null);
     }else{
       this.dialogRef.close(studentSelect);
     }
  }
}
