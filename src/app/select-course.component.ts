import { Component, OnInit } from '@angular/core';
import {TeacherService} from './services/teacher.service';

@Component({
  selector: 'app-select-course',
  template: `
    <h2 style="padding: 15px">Seleziona un corso prima di procedere.</h2>`
})
export class SelectCourseComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
