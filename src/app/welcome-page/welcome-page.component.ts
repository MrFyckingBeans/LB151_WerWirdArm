import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit{

  categories: any;
  user: string = "";
  category: any;
  loggedIn!: boolean;
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }
  

  ngOnInit() {
    const url = 'http://localhost:5002/kategorien';
    this.http.get(url).subscribe((response) => {
      this.categories = response;
    });
    this.loggedIn = this.authService.isLoggedIn();
  }




  startGame() {
    console.log(this.user);
    console.log(this.category);
    if (this.user !== "" && this.category !== "") {
      // get the selected category and name inputs
  
      const date = new Date(); // convert date later when making the post request to spiele, now it's easyier to calculate
      //const formattedDateTime = date.toISOString();
  
      const data = { kategorien_id: this.category, spieler: this.user, start: date };
      localStorage.setItem('playerdata', JSON.stringify(data));
      this.router.navigate(['/quiz']);
    } else {  
      alert("Please set your name and choose a category!");
    }
  }
}
