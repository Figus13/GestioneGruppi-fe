import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, ViewChild} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import { StudentsComponent } from './teacher/students/students.component';
import { StudentsContComponent } from './teacher/students/students-cont.component';
import {PageNotFoundComponent} from './pageNotFound.component';
import {EmptyComponent} from './empty.component';
import { VmsContComponent } from './teacher/vms/vms-cont.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {AuthTokenInterceptor} from './auth/auth.interceptor';
import { VmsComponent } from './teacher/vms/vms.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { ConsegneComponent } from './teacher/consegne/consegne.component';
import { ConsegneContComponent } from './teacher/consegne/consegne-cont.component';
import { SettingsDialogComponent } from './teacher/vms/settings-dialog/settings-dialog.component';
import { VmDialogComponent } from './vm-dialog/vm-dialog.component';
import { ElaboratoDialogComponent } from './teacher/consegne/elaborato-dialog/elaborato-dialog.component';
import { ConsegnaDialogComponent } from './teacher/consegne/consegna-dialog/consegna-dialog.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {CoursesComponent} from './teacher/courses/courses.component';
import { CoursesContComponent } from './teacher/courses/courses-cont.component';
import { SelectCourseComponent } from './select-course.component';
import {MatStepperModule} from "@angular/material/stepper";
import { TeacherHomeComponent } from './teacher/teacher-home/teacher-home.component';
import { LoginDialogComponent } from './auth/login-dialog/login-dialog.component';
import { RegistrationDialogComponent } from './auth/registration-dialog/registration-dialog.component';
import { HomeComponent } from './home/home.component';
import {MatSelectModule} from '@angular/material/select';
import { StudentHomeComponent } from './student/student-home/student-home.component';
import { GruppiStudentComponent } from './student/gruppi-student/gruppi-student.component';
import { ConsegneStudentComponent } from './student/consegne-student/consegne-student.component';
import { VmsStudentComponent } from './student/vms-student/vms-student.component';
import { CoursesStudentComponent } from './student/courses-student/courses-student.component';
import { CoursesStudentContComponent } from './student/courses-student/courses-student-cont.component';
import { GruppiStudentContComponent } from './student/gruppi-student/gruppi-student-cont.component';
import { ConsegneStudentContComponent } from './student/consegne-student/consegne-student-cont.component';
import { VmsStudentContComponent } from './student/vms-student/vms-student-cont.component';
import {NewCourseDialogWindowComponent} from './teacher/courses/newCourse-dialog/newCourse-dialog-window.component';
import {MatMenuModule} from '@angular/material/menu';
import { SetImageDialogComponent } from './set-image-dialog/set-image-dialog.component';
import { ModifyCourseDialogComponent } from './teacher/courses/modify-course-dialog/modify-course-dialog.component';
import { CreateTeamComponent } from './student/gruppi-student/create-team/create-team.component';
import { AcceptTeamRequestComponent } from './student/gruppi-student/accept-team-request/accept-team-request.component';
import { CreateTeamDialogComponent } from './student/gruppi-student/create-team-dialog/create-team-dialog.component';
import { NewVirtualMachineDialogComponent } from './student/vms-student/new-virtual-machine-dialog/new-virtual-machine-dialog.component';
import { ModifyVMDialogComponent } from './student/vms-student/modify-vm-dialog/modify-vm-dialog.component';
import { ConsegneDialogComponent } from './student/consegne-student/consegne-dialog/consegne-dialog.component';
import { ShareVmDialogComponent } from './student/vms-student/share-vm-dialog/share-vm-dialog.component';
import { DeleteCourseDialogComponent } from './teacher/courses/delete-course-dialog/delete-course-dialog.component';
import { DeleteVmDialogComponent } from './student/vms-student/delete-vm-dialog/delete-vm-dialog.component';
import { VisualizzaConsegnaDialogComponent } from './teacher/consegne/visualizza-consegna-dialog/visualizza-consegna-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentsComponent,
    StudentsContComponent,
    EmptyComponent,
    PageNotFoundComponent,
    VmsContComponent,
    VmsComponent,
    SettingsDialogComponent,
    CoursesComponent,
    CoursesContComponent,
    SelectCourseComponent,
    ConsegneComponent,
    ConsegneContComponent,
    SettingsDialogComponent,
    VmDialogComponent,
    NewCourseDialogWindowComponent,
    ElaboratoDialogComponent,
    ConsegnaDialogComponent,
    TeacherHomeComponent,
    LoginDialogComponent,
    RegistrationDialogComponent,
    HomeComponent,
    StudentHomeComponent,
    GruppiStudentComponent,
    ConsegneStudentComponent,
    VmsStudentComponent,
    CoursesStudentComponent,
    CoursesStudentContComponent,
    GruppiStudentContComponent,
    ConsegneStudentContComponent,
    VmsStudentContComponent,
    SetImageDialogComponent,
    ModifyCourseDialogComponent,
    CreateTeamComponent,
    AcceptTeamRequestComponent,
    CreateTeamDialogComponent,
    NewVirtualMachineDialogComponent,
    ModifyVMDialogComponent,
    ConsegneDialogComponent,
    ShareVmDialogComponent,
    DeleteCourseDialogComponent,
    DeleteVmDialogComponent,
    VisualizzaConsegnaDialogComponent
  ],
    imports: [
        MatDialogModule,
        HttpClientModule,
        MatButtonModule,
        MatTabsModule,
        MatListModule,
        MatSidenavModule,
        MatIconModule,
        MatToolbarModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        FormsModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatInputModule,
        MatPaginatorModule,
        MatExpansionModule,
        MatStepperModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCardModule,
        MatSlideToggleModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatMenuModule
    ],
  entryComponents: [HomeComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent],
  providers: [{
    provide: HTTP_INTERCEPTORS ,
    useClass: AuthTokenInterceptor,
    multi: true
  },{ provide: MAT_DATE_LOCALE, useValue:'it-IT'}]
})
export class AppModule {}

