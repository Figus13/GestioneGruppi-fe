import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "./auth/auth.service";

@Component({
  selector: 'app-page-not-found',
  template: `
    <h2 style="padding: 15px">Error 404: Page Not Found</h2>
    <h3 style="padding: 15px">Scegli un corso</h3>
  `
})
export class PageNotFoundComponent implements OnInit{
  path: string;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if(this.isAuthenticated()){
      if(this.isTeacher()){
        this.router.navigate(['/teacher/selectCourse']);
      }else if(this.isStudent()){
        this.router.navigate(['/student/selectCourse']);
      }
    }
  }

  /**
   * Metodo che verifica se l'utente è autenticato
   */
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();

  }

  /**
   * Metodo che verifica se l'utente è un docente
   */
  isTeacher(): boolean {
    return localStorage.getItem('ROLE') == 'TEACHER';
  }

  /**
   * Metodo che verifica se l'utente è uno studente
   */
  isStudent(): boolean {
    return localStorage.getItem('ROLE') === 'STUDENT';
  }
}
