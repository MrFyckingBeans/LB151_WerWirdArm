import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-question-page',
  templateUrl: './question-page.component.html',
  styleUrls: ['./question-page.component.css']
})
export class QuestionPageComponent implements OnInit {
  questions: Array<any> = [];
  categories: Array<any> = [];
  answers: Array<any> = [];
  newRow: any = {};
  questionsResponse: Array<any> = [];


  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadData();
    console.log("question array 1" + this.questions);
    console.log("fett");
  }

  loadData() {
    console.log("allu");
    const categoriesUrl = 'http://localhost:5002/kategorien';
    const questionsUrl = 'http://localhost:5002/fragen';
    const answersUrl = 'http://localhost:5002/antworten';

    forkJoin([
      this.http.get<Array<any>>(categoriesUrl),
      this.http.get<Array<any>>(questionsUrl),
      this.http.get<Array<any>>(answersUrl)
    ]).subscribe(([categoriesResponse, questionsResponse, answersResponse]) => {
      this.categories = categoriesResponse;
      this.answers = answersResponse;
      this.questionsResponse = questionsResponse; // Set the questionsResponse property
      console.log(questionsResponse);
      this.questions = questionsResponse.map(question => {
        const category = this.categories.find(cat => cat.id === question.kategorien_id);
        const answers = [
          this.getAnswerById(question.falscheAntwort1),
          this.getAnswerById(question.falscheAntwort2),
          this.getAnswerById(question.falscheAntwort3),
          this.getAnswerById(question.richtigeAntwort),
        ];
        return { ...question, categoryName: category?.name, falscheAntwort1:answers[0],falscheAntwort2:answers[1], falscheAntwort3:answers[2], richtigeAntwort:answers[3] };
      });
    });
  }

  getAnswerById(answerId: number): string {
    const answer = this.answers.find(a => a.id === answerId);
    return answer ? answer.antwort : '';
  }

  addNewRow() {
    this.newRow = {
      editing: true
    };
    this.questions.push(this.newRow);
  }

  submitNewAnswers(answer: any) {
    const answersUrl = 'http://localhost:5002/antworten';
    const answersSubmitted = [
      this.newRow.falscheAntwort1,
      this.newRow.falscheAntwort2,
      this.newRow.falscheAntwort3,
      this.newRow.richtigeAntwort,
    ];

    console.log("newRow:", this.newRow);
    console.log("answersSubmitted:", answersSubmitted);

    if (answersSubmitted.some((answer) => !answer || answer.trim() === "")) {
      console.error("One or more answers are empty. Please provide valid answers.");
      return;
    }
    const postRequests = [];
  
    for (let index = 0; index < answersSubmitted.length; index++) {
      const postRequest = this.http.post(answersUrl, { antwort: answersSubmitted[index] });
      postRequests.push(postRequest);
    }
  
    forkJoin(postRequests).subscribe(
      (responses) => {
        this.loadData();
        this.submitNewQuestion(this.newRow, responses);
      },
      (error) => {
        console.error('Error submitting new question:', error);
      }
    );

  }

  submitNewQuestion(question: any, answerAll: any[]) {
    
    console.log("alla");
    //console.log(question);
    const questionsUrl = 'http://localhost:5002/fragen';
    const newQuestion = {
      frage: this.newRow.question,
      falscheAntwort1: answerAll[0].id,
      falscheAntwort2: answerAll[1].id,
      falscheAntwort3: answerAll[2].id,
      richtigeAntwort: answerAll[3].id,
      kategorien_id: this.newRow.kategorien_id,
    };
    
    
    console.log(newQuestion);
    this.http.post(questionsUrl, newQuestion).subscribe(
      response => {
        this.loadData();
      },
      error => {
        console.error('Error submitting new question:', error);
      }
    );
  }

  deleteQuestion(question: any) {
    const originalQuestion = this.questionsResponse.find(q => q.id === question.id);
  
    if (!originalQuestion) {
      console.error("Original question not found.");
      return;
    }
  
    const answerIds = [
      originalQuestion.falscheAntwort1,
      originalQuestion.falscheAntwort2,
      originalQuestion.falscheAntwort3,
      originalQuestion.richtigeAntwort,
    ];
  
    const questionUrl = `http://localhost:5002/fragen/${question.id}`;
    this.http.delete(questionUrl).subscribe(
      (response) => {
        const deleteRequests = answerIds.map((answerId) => {
          const answerUrl = `http://localhost:5002/antworten/${answerId}`;
          return this.http.delete(answerUrl);
        });
  
        forkJoin(deleteRequests).subscribe(
          (responses) => {
            this.loadData();
          },
          (error) => {
            console.error("Error deleting answers:", error);
          }
        );
      },
      (error) => {
        console.error("Error deleting question:", error);
      }
    );
  }
  
  
  

  editQuestion(question: any) {
    question.editing = true;
  }

  updateQuestion(question: any) {
    const originalQuestion = this.questionsResponse.find(q => q.id === question.id);
  
    if (!originalQuestion) {
      console.error("Original question not found.");
      return;
    }
  
    const answerUpdates = [
      { id: originalQuestion.falscheAntwort1, newAnswer: question.falscheAntwort1 },
      { id: originalQuestion.falscheAntwort2, newAnswer: question.falscheAntwort2 },
      { id: originalQuestion.falscheAntwort3, newAnswer: question.falscheAntwort3 },
      { id: originalQuestion.richtigeAntwort, newAnswer: question.richtigeAntwort },
    ];
  
    const putAnswerRequests = answerUpdates.map(answerUpdate => {
      const answerUrl = `http://localhost:5002/antworten/${answerUpdate.id}`;
      return this.http.put(answerUrl, { antwort: answerUpdate.newAnswer });
    });
  
    forkJoin(putAnswerRequests).subscribe(
      responses => {
        const updatedQuestion = {
          kategorien_id: question.kategorien_id, // Use the selected category id from the question object
          frage: question.frage,
        };
  
        // Use the 'updatefrage' endpoint for updating the question
        const questionsUrl = `http://localhost:5002/fragen/updatefrage/${question.id}`;
        this.http.put(questionsUrl, updatedQuestion).subscribe(
          response => {
            this.loadData();
          },
          error => {
            console.error('Error updating question:', error);
          }
        );
      },
      error => {
        console.error('Error updating answers:', error);
      }
    );
  }
  
  
  
}
