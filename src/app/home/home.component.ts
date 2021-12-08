import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {LoginDialogComponent} from '../auth/login-dialog/login-dialog.component';
import {RegistrationDialogComponent} from '../auth/registration-dialog/registration-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog, private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  clickLogin() {
    this.dialog.open(LoginDialogComponent);
  }

  clickRegistration() {
    this.dialog.open(RegistrationDialogComponent);
  }

}
