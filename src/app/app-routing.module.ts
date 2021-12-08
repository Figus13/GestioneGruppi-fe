import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StudentsContComponent} from './teacher/students/students-cont.component';
import {PageNotFoundComponent} from './pageNotFound.component';
import {EmptyComponent} from './empty.component';
import {VmsContComponent} from './teacher/vms/vms-cont.component';
import {AuthGuard} from './auth/auth.guard';
import {ConsegneContComponent} from './teacher/consegne/consegne-cont.component';
import {SelectCourseComponent} from './select-course.component';
import {GruppiStudentContComponent} from "./student/gruppi-student/gruppi-student-cont.component";
import {VmsStudentContComponent} from "./student/vms-student/vms-student-cont.component";
import {ConsegneStudentContComponent} from "./student/consegne-student/consegne-student-cont.component";
import {HomeComponent} from './home/home.component';


const routes: Routes = [
  {
    path: 'teacher',
    canActivate: [AuthGuard],
    children: [
      {path: 'selectCourse', component: SelectCourseComponent},
      {path: 'courses/newCourse', component: EmptyComponent},
      {path: 'courses/:courseName/students', component: StudentsContComponent},
      {path: 'courses/:courseName/vms', component: VmsContComponent},
      {path: 'courses/:courseName/consegne-elaborati', component: ConsegneContComponent}
        ]
  },
  {
    path: 'student',
    canActivate: [AuthGuard],
    children: [
      {path: 'selectCourse', component: SelectCourseComponent},
      {path: 'courses/:courseName/teams', component: GruppiStudentContComponent},
      {path: 'courses/:courseName/vms', component: VmsStudentContComponent},
      {path: 'courses/:courseName/consegne-elaborati', component: ConsegneStudentContComponent}
    ]
  },
  {path: '**', component: PageNotFoundComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
