import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatDialogConfig} from "@angular/material/dialog";
import {NewCourseDialogWindowComponent} from "./teacher/courses/newCourse-dialog/newCourse-dialog-window.component";

@Component({
  selector: 'app-empty',
  template: ``
})
export class EmptyComponent implements OnInit {
  path: string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
  }
}
