import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.css']
})
export class RegistrationDialogComponent implements OnInit {


  ngOnInit(): void {
  }

  constructor(private formBuilder: FormBuilder, private authService: AuthService, public dialogRef: MatDialogRef<RegistrationDialogComponent>, private router: Router) {
  }

  invalidRegistration: boolean = false;
  invalidRegistrationMail: boolean = false;
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required]);
  nomeControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]+')]);
  cognomeControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]+')]);
  matricolaControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]);


  /**
   * Gestione errori dei campi del form
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

  getErrorNome() {
    if (this.nomeControl.hasError('required')) {
      return 'Inserire un valore';
    }
    if (this.nomeControl.hasError('pattern')) {
      return 'Inserire lettere maiuscole o minuscole';
    }
  }

  getErrorCognome() {
    if (this.cognomeControl.hasError('required')) {
      return 'Inserire un valore';
    }
    if (this.nomeControl.hasError('pattern')) {
      return 'Inserire lettere maiuscole o minuscole';
    }
  }

  getErrorMatricola() {
    if (this.matricolaControl.hasError('required')) {
      return 'Inserire un valore';
    }
    if (this.matricolaControl.hasError('pattern')) {
      return 'Inserire solamente valori numerici';
    }
  }

  /**
   * Metodo per la registrazione
   */

  register() {
    //controllo che non ci siano errori nel form
    if (!this.emailControl.hasError('required') && !this.emailControl.hasError('email')
      && !this.passwordControl.hasError('required') && !this.nomeControl.hasError('required')
      && !this.cognomeControl.hasError('required') && !this.matricolaControl.hasError('required')
      && !this.nomeControl.hasError('pattern') && !this.cognomeControl.hasError('pattern') && !this.matricolaControl.hasError('pattern')) {

      let rightEmailStudent = 's' + this.matricolaControl.value.toString() + '@studenti.polito.it';
      let rightEmailTeacher = 'd' + this.matricolaControl.value.toString() + '@polito.it';

      if (this.emailControl.value != rightEmailStudent && this.emailControl.value != rightEmailTeacher) {
        this.invalidRegistrationMail = true;
      } else {

        this.authService.register(this.matricolaControl.value, this.nomeControl.value,
          this.cognomeControl.value, this.emailControl.value, this.passwordControl.value).subscribe(
          x => {
            //avviso lo studente che la procedura è andata a buon fine ma deve essere terminata tramite l'invito nella mail
            alert('Per completare la registrazione accettare l\'invito spedito al suo indirizzo e-mail.');
            this.invalidRegistration = false;
            this.invalidRegistrationMail = false;
            this.router.navigate(['/home']);
            this.dialogRef.close();
          },
          (err) => {
            //Gestione errori ricevuti dal server
            if (err.status === 400) {
              alert('Errore in fase di registrazione. Controllare che i parametri inseriti siano corretti');
            } else if (err.status === 504) { //gateway timeout
              alert('Server irraggiungibile');
            } else if (err.status === 409){
              alert('ID già associato ad un utente')
            }
            else {
              //Errore generico che avvisa in tutti i casi che non comprendono quelli precedenti
              alert('La registrazione non è andata a buon fine!');
            }
            //setto un flag che si occupa di visualizzare un errore a schermo
            this.invalidRegistration = true;
          });
      }
    }


  }
}
