import {Component, Input, OnInit} from '@angular/core';
import {Team} from '../../models/team.model';
import {Student} from "../../models/student.model";
import {MatDialog} from '@angular/material/dialog';
import {ConsegnaDialogComponent} from '../../teacher/consegne/consegna-dialog/consegna-dialog.component';
import {CreateTeamDialogComponent} from './create-team-dialog/create-team-dialog.component';

@Component({
  selector: 'app-gruppi-student',
  templateUrl: './gruppi-student.component.html',
  styleUrls: ['./gruppi-student.component.css']
})
export class GruppiStudentComponent implements OnInit {

  /**
   * Attributi e input
   */
  displayedColumns: string[] = ['id', 'name', 'firstName'];
  @Input()
  team: Team;
  @Input()
  members: Student[];


  constructor() {
  }

  ngOnInit(): void {
  }


}
