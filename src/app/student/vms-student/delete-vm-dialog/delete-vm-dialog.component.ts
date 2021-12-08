import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VirtualMachine} from "../../../models/virtualMachine.model";

@Component({
  selector: 'app-delete-vm-dialog',
  templateUrl: './delete-vm-dialog.component.html',
  styleUrls: ['./delete-vm-dialog.component.css']
})
export class DeleteVmDialogComponent implements OnInit {

  /**
   * Attributi
   */
  vm: VirtualMachine;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<DeleteVmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.vm = data.vm;
  }

  ngOnInit(): void {
  }

  /**
   * Chiude la dialog
   * @param b
   */
  close(b:boolean){
    this.dialogRef.close(b);
  }
}
