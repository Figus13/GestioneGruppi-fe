import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TeacherService} from '../../../services/teacher.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from '../../../models/course.model';

@Component({
  selector: 'app-modify-course-dialog',
  templateUrl: './modify-course-dialog.component.html',
  styleUrls: ['./modify-course-dialog.component.css']
})
export class ModifyCourseDialogComponent implements OnInit {

  courseName: string;
  selectedCourse: Course;
  error: boolean;
  update: boolean;
  form = new FormGroup({
    min: new FormControl('', [Validators.required, Validators.min(1)]),
    max: new FormControl('', [Validators.required, Validators.min(1)]),
    enabled: new FormControl('', [Validators.required])

  });
  checked: boolean;
  minMaxError: boolean = false;

  constructor(private teacherService: TeacherService, public dialogRef: MatDialogRef<ModifyCourseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.error = false;
    this.update = false;
    this.teacherService.courseObs.subscribe((data) => {
      this.courseName = data;
    });
    this.selectedCourse = data.course;
    this.form.setValue({
      min: this.selectedCourse.min,
      max: this.selectedCourse.max,
      enabled: this.selectedCourse.enabled
    });
  }

  ngOnInit(): void {
  }

  /**
   * Chiusura di una dialog
   */
  close() {
    this.dialogRef.close(null);
  }

  /**
   * Aggiornamento dei dati di un corso se il minimo è minore non è maggiore del massimo, chiude la dialog passando il corso
   * aggiornato
   */
  updateCorso() {
    if(this.form.get('min').value > this.form.get('max').value){
      this.minMaxError = true;
    }else{
      this.minMaxError = false;
      this.selectedCourse.enabled = this.form.get('enabled').value;
      this.selectedCourse.max = this.form.get('max').value;
      this.selectedCourse.min = this.form.get('min').value;
      this.dialogRef.close(this.selectedCourse);
    }
  }

  /**
   * Controllo sulla validita del form
   */
  checkForm() {
    if (this.form.controls.min.valid && this.form.controls.max.valid) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Gestione errori del form
   */
  getErrorMin() {
    if (this.form.controls.min.hasError('required')) {
      return 'Inserire un valore';
    } else if (this.form.controls.min.hasError('min')) {
      return 'Inserire valore positivo';
    }
  }

  getErrorMax() {
    if (this.form.controls.max.hasError('required')) {
      return 'Inserire un valore';
    } else if (this.form.controls.max.hasError('min')) {
      return 'Inserire valore positivo';
    }
  }
}
