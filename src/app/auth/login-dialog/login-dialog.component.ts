import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Route, Router} from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  loginFailed: boolean = false;
  unreachableServer: boolean = false;
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required]);

  ngOnInit(): void {
  }

  constructor(private authService: AuthService, public dialogRef: MatDialogRef<LoginDialogComponent>, private router: Router) {
  }

  /**
   * Gestione errori per il form
   */

  getErrorEmail() {
    if (this.emailControl.hasError('required')) {
      return 'Inserire un valore';
    }
    return this.emailControl.hasError('email') ? 'Email non valida' : '';
  }
  getErrorPassword() {
    if (this.passwordControl.hasError('required')) {
      return 'Inserire un valore';
    }
  }
  /**
   * Implementazione del metodo di login
   */
  login() {
    if (!this.emailControl.hasError('required')
      && !this.emailControl.hasError('email')
      && !this.passwordControl.hasError('required')){

      const letter: string = this.emailControl.value.substring(0,1);
      let host = this.emailControl.value.split('@')[1];

      if((letter.toLowerCase() == 'd' && host === 'polito.it') ||
        (letter.toLowerCase() == 's' && host === 'studenti.polito.it')){

        this.authService.login(this.emailControl.value,this.passwordControl.value).subscribe(
          result =>{
            //salvo il token risultante dal login in localstorage nei suoi vari pezzi
            const jwtParsed = JSON.parse(atob(result.token.split('.')[1]));
            const role = jwtParsed.roles[0].authority;

            //controllo il primo carattere del login, se d è un tentativo di login di un docente, se s di uno studente
            const letter: string = this.emailControl.value.substring(0,1);
            let host = this.emailControl.value.split('@')[1];
            if(letter.toLowerCase() == 'd' && host === 'polito.it' && role === 'ROLE_TEACHER'){
              localStorage.setItem('accessToken', result.token);
              localStorage.setItem('userId',jwtParsed.sub );
              localStorage.setItem('expiresAt', jwtParsed.exp);
              localStorage.setItem('ROLE', 'TEACHER');
              this.loginFailed = false;
              this.dialogRef.close()
              const url = '/' + localStorage.getItem('ROLE').toLowerCase() + '/selectCourse'
              this.router.navigate([url]);
            }else if (letter.toLowerCase() == 's' && host === 'studenti.polito.it' && role === 'ROLE_STUDENT'){
              localStorage.setItem('accessToken', result.token);
              localStorage.setItem('userId',jwtParsed.sub );
              localStorage.setItem('expiresAt', jwtParsed.exp);
              localStorage.setItem('ROLE', 'STUDENT');
              this.loginFailed = false;
              this.dialogRef.close()
              const url = '/' + localStorage.getItem('ROLE').toLowerCase() + '/selectCourse'
              this.router.navigate([url]);
            }else{
              this.loginFailed = true;
            }
          },
          (error) => {
            //gestione degli errori ritornati dal server.
            //mantengo la dialog aperta visualizzando nel caso i rispettivi errori
            if(error.status === 504){ //gateway timeout
              this.unreachableServer = true;
            }else if(error.status === 401){ //unhauthorized
              this.loginFailed = true;
            }else{
              //gestione di un errore generico che non corrisponda ai 2 precedenti
              alert('Errore!');
            }
          }
        );
      }else{
        this.loginFailed = true;
      }
    }
  }

}
