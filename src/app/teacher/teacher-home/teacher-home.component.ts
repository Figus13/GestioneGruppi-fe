import {Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Course} from '../../models/course.model';
import {AuthService} from '../../auth/auth.service';
import {NavigationEnd, Router} from '@angular/router';
import {TeacherService} from '../../services/teacher.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SetImageDialogComponent} from '../../set-image-dialog/set-image-dialog.component';
import {MatTab, MatTabNav} from '@angular/material/tabs';

@Component({
  selector: 'app-teacher-home',
  templateUrl: './teacher-home.component.html',
  styleUrls: ['./teacher-home.component.css']
})
export class TeacherHomeComponent implements OnInit{

  /**
   * Attributi
   */
  email: string;
  img: string;
  selectedCourse = 'Seleziona un corso';
  viewCourseName = 'Seleziona un corso';

  navLinks = [
    { path: '/teacher/selectCourse', label: 'Studenti' },
    { path: '/teacher/selectCourse', label: 'Macchine Virtuali' },
    { path: '/teacher/selectCourse', label: 'Consegne & Elaborati' }
  ];

  @ViewChild('side') sidenav: MatSidenav;

  constructor(private authService: AuthService, private router: Router, private teacherService : TeacherService, public dialog: MatDialog) {
    this.teacherService.courseObs.subscribe((data) => {
      this.selectCourse(data);
    });
    const id = localStorage.getItem('userId');
    this.email = 'd' + id + '@polito.it';
    teacherService.getImageForTeacher().subscribe( x => this.img = 'data:image/png;base64,' + x );
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && val.url === '/teacher/selectCourse'){
        this.selectedCourse = 'Seleziona un corso';
        this.viewCourseName = 'Seleziona un corso';
        this.navLinks = [
          { path: '/teacher/selectCourse', label: 'Studenti' },
          { path: '/teacher/selectCourse', label: 'Macchine Virtuali' },
          { path: '/teacher/selectCourse', label: 'Consegne & Elaborati' }
        ];
      }
    });
  }

  ngOnInit(): void {
  }

  /**
   * Toggler per il menu
   */
  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  /**
   * Se viene selezionato un corso aggiorna gli indirizzi di navigazione con i dati del corso corrispondente
   * @param courseName
   */
  selectCourse(courseName: string) {
    if (courseName.length > 130){
      this.viewCourseName = courseName.substr(0, 130);
      this.viewCourseName += '...';
    }else{
      this.viewCourseName = courseName;
    }
    this.selectedCourse = courseName;
    this.navLinks.forEach(x => {
      if (x.label === 'Studenti'){
        x.path = '/teacher/courses/' + this.selectedCourse + "/students";
      }else if (x.label === 'Macchine Virtuali'){
        x.path = "/teacher/courses/" + this.selectedCourse + "/vms";
      }else if (x.label === 'Consegne & Elaborati'){
        x.path = "/teacher/courses/" + this.selectedCourse + "/consegne-elaborati";
      }else {

      }
    });
  }

  /**
   * Chiama authService per il logout
   */
  logout() {
    this.authService.logout();
  }

  /**
   * Se clicchi il logo VirtualLabs reinidirizza alla pagina iniziale
   */
  redirect() {
    this.selectedCourse = 'Seleziona un corso';
    this.viewCourseName = 'Seleziona un corso';
    this.router.navigate(['teacher/selectCourse']);
  }

  /**
   * Metodo per aprire una dialog apposita per cambiare l'immagine di profilo del docente,
   * al ritorno se è modificata ne fa l'upload e aggiorna la vista
   */
  setImg() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    this.dialog.open(SetImageDialogComponent, dialogConfig)
      .afterClosed().subscribe(x =>
    {
      if( x!=null){
        this.teacherService.uploadImage(x.img, x.options)
          .subscribe(y =>
            this.teacherService.getImageForTeacher().subscribe(img =>
              this.img = 'data:image/png;base64,' + img ),
            error => {
            //Gestione degli errori
              if(error.status === 404){
                alert('Docente non trovato!');
              }else if(error.status === 500){
                alert('Eccezione interna al server!');
              }else if(error.status === 400){
                alert('Errore nella richiesta!');
              }else{ //Gestione degli errori non valutati direttamente
                alert('Errore')
              }
            }
          )}
    })
  }
}
