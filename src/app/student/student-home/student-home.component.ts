import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {MatSidenav} from '@angular/material/sidenav';
import {Course} from '../../models/course.model';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {StudentService} from '../../services/student.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SetImageDialogComponent} from '../../set-image-dialog/set-image-dialog.component';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {


  /**
   * Attributi
   */
  email: string;
  img: string;
  @ViewChild('side') sidenav: MatSidenav;
  selectedCourse = 'Seleziona un corso';
  viewCourseName = 'Seleziona un corso';
  navLinks = [
    {path: '/student/selectCourse', label: 'Gruppi'},
    {path: '/student/selectCourse', label: 'Macchine Virtuali'},
    {path: '/student/selectCourse', label: 'Consegne & Elaborati'}

  ];

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router, private studentService: StudentService, private dialog: MatDialog) {
    this.studentService.courseObs.subscribe((data) => {
      this.selectCourse(data);
    });

    const id = localStorage.getItem('userId');
    this.email = 's' + id + '@studenti.polito.it';
    studentService.getImageForStudent().subscribe(x => this.img = 'data:image/png;base64,' + x);
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && val.url === '/student/selectCourse') {
        this.selectedCourse = 'Seleziona un corso';
        this.viewCourseName = 'Seleziona un corso';
        this.navLinks = [
          {path: '/student/selectCourse', label: 'Gruppi'},
          {path: '/student/selectCourse', label: 'Macchine Virtuali'},
          {path: '/student/selectCourse', label: 'Consegne & Elaborati'}
        ];
      }
    });
  }

  ngOnInit(): void {
  }

  /**
   * Toggle del menu
   */
  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  /**
   * Metodo per selezionare il corso, imposta anche gli url relativi al corso per le sottoviste
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
      if (x.label === 'Gruppi') {
        x.path = '/student/courses/' + this.selectedCourse + '/teams';
      } else if (x.label === 'Macchine Virtuali') {
        x.path = '/student/courses/' + this.selectedCourse + '/vms';
      } else if (x.label === 'Consegne & Elaborati') {
        x.path = '/student/courses/' + this.selectedCourse + '/consegne-elaborati';
      }
    });
  }

  /**
   * Metodo per il redirect
   */
  redirect() {
    this.selectedCourse = 'Seleziona un corso';
    this.viewCourseName = 'Seleziona un corso';
    this.router.navigate(['student/selectCourse']);
  }

  /**
   * Metodo per il logout
   */
  logout() {
    this.authService.logout();
  }

  /**
   * Metodo per aprire la dialog relativa al selezionare l'immagine, al ritorno dalla dialog
   * se è stata cacricata un'immagine la carica.
   */
  setImg() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    this.dialog.open(SetImageDialogComponent, dialogConfig).afterClosed().subscribe(x => {
      if (x != null) {
        this.studentService.uploadImage(x.img, x.options).subscribe(
          y => this.studentService.getImageForStudent().subscribe(img => this.img = 'data:image/png;base64,' + img),
          error => {
            if(error.status === 400){
              alert('Errore nella richiesta!');
            }else if(error.status === 500){
              alert('Eccezione interna al server!');
            }else if(error.status === 404){
              alert('Studente non trovato!');
            }
          });
      }
    });
  }
}
