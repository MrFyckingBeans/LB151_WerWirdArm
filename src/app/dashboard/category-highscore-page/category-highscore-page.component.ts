import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-highscore-page',
  templateUrl: './category-highscore-page.component.html',
  styleUrls: ['./category-highscore-page.component.css']
})
export class CategoryHighscorePageComponent implements OnInit {
  highscore!: Array<any>;
  newRow: any = {};

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    const url = 'http://localhost:5002/spiele';
    this.http.get<Array<any>>(url).subscribe((response) => {
      
      this.highscore = response;
    });
  }

  prepareScoreData(score: any) {
    const startISO = this.convertToISODate(score.start);
    const endeISO = this.convertToISODate(score.ende);

    return {
      spieler: score.spieler,
      punktzahl: score.punktzahl,
      start: startISO,
      ende: endeISO,
      kategorien_id: score.kategorien_id
    };
  }

  convertToISODate(dateString: string) {
    const date = new Date(dateString);
    return date.toISOString();
  }

  addNewRow() {
    this.newRow = {
      editing: true
    };
    this.highscore.push(this.newRow);
  }

  submitNewScore(score: any) {
    if (score.spieler && score.punktzahl && score.start && score.ende && score.kategorien_id) {
      const url = 'http://localhost:5002/spiele';
      this.http.post(url, this.prepareScoreData(score)).subscribe(() => {
        this.newRow = {};
        score.editing = false;
      });
    }
  }

  deleteScore(score: any) {
    const url = `http://localhost:5002/spiele/${score.id}`;
    this.http.delete(url).subscribe(() => {
      this.highscore = this.highscore.filter(s => s.id !== score.id);
    });
  }

  editScore(score: any) {
    score.editing = true;
  }

  updateScore(score: any) {
    if (score.spieler && score.punktzahl && score.start && score.ende && score.kategorien_id) {
      const url = `http://localhost:5002/spiele/${score.id}`;
      this.http.put(url, this.prepareScoreData(score)).subscribe(() => {
        score.editing = false;
      });
    }
  }
  

  durationQuiz(score: any): number {
    const start = new Date(score.start);
    const end = new Date(score.ende);
    const duration = (end.getTime() - start.getTime()) / 1000;
    return duration;
  }

  weightedPoints(score: any): number {
    const duration = this.durationQuiz(score);
    const weightedPoints = score.punktzahl / duration;
    return weightedPoints;
  }
}
