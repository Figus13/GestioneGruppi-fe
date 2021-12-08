import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-consegne-dialog',
  templateUrl: './consegne-dialog.component.html',
  styleUrls: ['./consegne-dialog.component.css']
})
export class ConsegneDialogComponent implements OnInit {

  img: any;

  constructor(public dialogRef: MatDialogRef<ConsegneDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.img = data.img;
  }

  ngOnInit(): void {
  }

  /**
   * Chiude la dialog
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Controlla se l'immagine è vuota
   */
  emptyImg(){
    return this.img === 'vuoto';
  }
}
