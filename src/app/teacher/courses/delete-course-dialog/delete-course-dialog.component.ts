import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Course} from "../../../models/course.model";

@Component({
  selector: 'app-delete-course-dialog',
  templateUrl: './delete-course-dialog.component.html',
  styleUrls: ['./delete-course-dialog.component.css']
})
export class DeleteCourseDialogComponent implements OnInit {

  /**
   * Attributi
   */
  course: Course;

  constructor(public dialogRef: MatDialogRef<DeleteCourseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.course = data.course;
  }

  ngOnInit(): void {
  }

  /**
   * Chiude la dialog e passa true se vuoi davvero rimuovere il corso o false
   * @param b
   */
  close(b: boolean) {
    this.dialogRef.close(b);
  }
}
