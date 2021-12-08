import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../models/user.model';
import * as moment from 'moment';
import {JwtToken} from '../models/jwtToken.model';
import {Router} from '@angular/router';
import {RegisterUser} from '../models/registerUser.model';
import {observable} from 'rxjs';
import {AuthResult} from '../models/authResult.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_PATH = 'http://localhost:4200/api';
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })};
  //redirectUrl: string = '/selectCourse';

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Metodo per lanciare la richiesta di login dati email e password
   * @param email
   * @param password
   */
  login(email: string, password: string){
    const username: string = email.split("@")[0].substr(1);
    let user = new User(username, password);
    return this.http.post<any>(`${this.API_PATH}/login/authenticate`, user, this.httpOptions);
  }

  /**
   * Metodo per controllare se l'utente è loggato o no, ritorna true o false
   */
  public isAuthenticated(): boolean {
   if(localStorage.getItem('accessToken') == null) return false;
   if(moment().isBefore(moment.unix(+localStorage.getItem('expiresAt'))) == false){
     localStorage.removeItem('accessToken')
     localStorage.removeItem('ROLE');
     localStorage.removeItem('userId')
     localStorage.removeItem('expiresAt')
     return false;
   }
   return true;
  }

  /**
   * Metodo per la registrazione
   * @param matricola
   * @param nome
   * @param cognome
   * @param email
   * @param password
   */
  register(matricola: string, nome: string, cognome: string, email: string, password: string) {
    let registerUser = new RegisterUser(matricola, nome, cognome, email, password);
    if (email.startsWith('d') && email.endsWith('@polito.it')) {
      return this.http.post<any>(`${this.API_PATH}/teachers`, registerUser, this.httpOptions)
    }
    if (email.startsWith('s') && email.endsWith('@studenti.polito.it')){
      return this.http.post<any>(`${this.API_PATH}/students`, registerUser, this.httpOptions)
    }
    alert('Registrazione fallita: la mail inserita non corrisponde né a un docente né a uno studente.');
  }

  /**
   * Metodo per il logout, rimuove dal local storage tutti i dati relativi all'utente precedentemente loggato
   * e riindirizza alla home.
   */
  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('ROLE');
    localStorage.removeItem('userId')
    localStorage.removeItem('expiresAt')
    this.router.navigate(['/home']);
  }
}
