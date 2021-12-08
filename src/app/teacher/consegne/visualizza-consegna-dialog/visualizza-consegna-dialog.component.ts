import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-visualizza-consegna-dialog',
  templateUrl: './visualizza-consegna-dialog.component.html',
  styleUrls: ['./visualizza-consegna-dialog.component.css']
})
export class VisualizzaConsegnaDialogComponent implements OnInit {
  /**
   * Attributi
   */
  img: any;

  constructor(public dialogRef: MatDialogRef<VisualizzaConsegnaDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
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
   * Ritorna true se l'immagine è vuota, altrimenti false
   */
  emptyImg(){
    return this.img === 'vuoto';
  }

}
