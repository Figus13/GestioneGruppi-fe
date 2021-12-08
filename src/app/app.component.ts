import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /**
   * Attributi
   */
  title = 'VirtualLabs';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
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
