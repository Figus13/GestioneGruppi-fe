import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-vm-dialog',
  templateUrl: './vm-dialog.component.html',
  styleUrls: ['./vm-dialog.component.css']
})
export class VmDialogComponent implements OnInit {
  /**Attributi*/
  img: any;

  constructor(public dialogRef: MatDialogRef<VmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.img = data.img;
  }

  ngOnInit(): void {
  }

  /**
   * Chiusura della dialog
   */
  close() {
    this.dialogRef.close();
  }
}
