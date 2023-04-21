import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  user: string = "";
  password: string = "";

  login() {
      if(this.user === 'admin' && this.password === '1234'){
        this.authService.setLoggedIn(true);
        this.router.navigate(['/', 'dashboard'])
      }
    }
}


