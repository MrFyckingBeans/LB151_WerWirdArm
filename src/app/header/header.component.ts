import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() pageTitle: string | undefined;
  @Input() pageTitleRight: string | undefined;
  @Input() admNav1: String | undefined;
  @Input() admNav2: String | undefined;
  @Input() admNav3: String | undefined;
  @Input() logInBtn: boolean | undefined;
  @Input() logOutBtn: boolean | undefined;

  @Output() admNav1Clicked = new EventEmitter<void>();
  @Output() admNav2Clicked = new EventEmitter<void>();
  @Output() admNav3Clicked = new EventEmitter<void>();

  constructor(private router: Router, private authService: AuthService) { }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }
  goToHomePage() {
    this.router.navigate(['']);
    this.authService.clearLoggedIn()
    window.sessionStorage.setItem('activeComponent', "")
  }
  setActiveComponentCategory(){
    window.sessionStorage.setItem('activeComponent', 'category');
  }
  setActiveComponentHighscore(){
    window.sessionStorage.setItem('activeComponent', 'highscore');
  }
  setActiveComponentQuestions(){
    window.sessionStorage.setItem('activeComponent', 'questions');
  }
}