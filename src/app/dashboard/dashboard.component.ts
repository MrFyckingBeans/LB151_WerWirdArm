import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  ngOnInit() {
    if(window.sessionStorage.getItem('activeComponent') == ""){
      this.activeComponent = 'highscore';
    } else{
      this.activeComponent == window.sessionStorage.getItem('activeComponent');
      if (!window.sessionStorage.getItem('activeComponent')) {
        this.activeComponent = 'highscore';
      }
    }
  }
  activeComponent!: 'highscore' | 'question' | 'category';
}
