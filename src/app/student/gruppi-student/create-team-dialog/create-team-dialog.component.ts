import {Component, Inject, OnInit} from '@angular/core';
import {Student} from '../../../models/student.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StudentService} from '../../../services/student.service';
import {Course} from '../../../models/course.model';

@Component({
  selector: 'app-create-team-dialog',
  templateUrl: './create-team-dialog.component.html',
  styleUrls: ['./create-team-dialog.component.css']
})
export class CreateTeamDialogComponent implements OnInit {

  /**
   * Attributi
   */
  students: Student[];
  formGroup = new FormGroup({
    groupName: new FormControl('', Validators.required),
    scadenza: new FormControl(0, Validators.required)
  });
  course: Course;

  constructor(private studentService: StudentService, public dialogRef: MatDialogRef<CreateTeamDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.students = data.students;
  }

  ngOnInit(): void {

  }

  /**
   * Metodo per creare il team, alla chiusura della dialog passo il parametro con nome team, membri e scadenza
   */
  crea() {
    this.studentService.getSelectedCourse().subscribe(course => {
      this.course = course;
      let ids = this.students.map(s => s.id).slice();
      ids.push(localStorage.getItem('userId'));
      //controlli sulla dimensione nel team
      if (ids.length < this.course.min) {
        this.dialogRef.close("notEnough");
      } else if (ids.length > this.course.max) {
        this.dialogRef.close("moreThanEnough");
      } else {
        const propostaTeam = {
          teamName: this.formGroup.get('groupName').value,
          memberIds: ids,
          oreScadenza: this.formGroup.get('scadenza').value
        }
        this.dialogRef.close(propostaTeam);
      }
    });
  }

  /**
   * Chiusura della dialog
   */
  close() {
    this.dialogRef.close(null);
  }
}
