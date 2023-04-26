import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.css']
})
export class QuizPageComponent implements OnInit {
  playerData: any;
  questions: any[] = [];
  currentQuestion: any = null;
  currentAnswers: any[] = [];
  jokerUsed: boolean  = false;


  constructor(private http: HttpClient, private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit() {
    const storedPlayerData = localStorage.getItem('playerdata');

    if (storedPlayerData) {
      this.playerData = JSON.parse(storedPlayerData);
    }
    //this.playerData = JSON.parse(localStorage.getItem('playerdata') || '{}');
    console.log(this.playerData);
    this.getQuestions();
  }

  getQuestions() {
    const questionsUrl = 'https://server151wer-wird-arm.azurewebsites.net/fragen';
    const answersUrl = 'https://server151wer-wird-arm.azurewebsites.net/antworten';
    this.http.get<any[]>(questionsUrl).subscribe((questionsResponse: any[]) => {
      console.log('questionsResponse:', questionsResponse);
      this.http.get<any[]>(answersUrl).subscribe((answersResponse: any[]) => {
        const filteredQuestions = questionsResponse.filter(q => q.kategorien_id === parseInt(this.playerData.kategorien_id));
        console.log('filteredQuestions:', filteredQuestions);

        this.questions = filteredQuestions.map(question => {
          const questionAnswers = [
            { id: question.richtigeAntwort, isCorrect: true },
            { id: question.falscheAntwort1, isCorrect: false },
            { id: question.falscheAntwort2, isCorrect: false },
            { id: question.falscheAntwort3, isCorrect: false },
          ].map(answer => {
            const answerDetails = answersResponse.find(a => a.id === answer.id);
            return { ...answerDetails, ...answer };
          });

          return {
            ...question,
            answers: questionAnswers,
          };
        });

        console.log('questions:', this.questions);

        this.displayRandomQuestion();
      });
    });
  }




  displayRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * this.questions.length);
    this.currentQuestion = this.questions[randomIndex];
    this.currentAnswers = this.currentQuestion.answers;

    this.shuffle(this.currentAnswers); // Shuffle the answers before displaying them

    console.log('currentQuestion:', this.currentQuestion);
    console.log('currentAnswers:', this.currentAnswers);
  }




  shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  answerQuestion(selectedAnswer: any) {
    console.log('User selected answer:', selectedAnswer);
    //Disables buttons
    const answerButtons = document.getElementsByClassName("answer-button") as HTMLCollectionOf<HTMLButtonElement>;
    for (let i = 0; i < answerButtons.length; i++) {
      answerButtons[i].disabled = true;
    }
    // Check if the selected answer is correct
    if (selectedAnswer.isCorrect) {
      // Update button color to green for correct answer
      const correctBtn = this.el.nativeElement.querySelector(`#answer-${selectedAnswer.id}`);
      this.renderer.setStyle(correctBtn, 'background-color', 'green');
      this.updateCountsCorrect(this.currentQuestion.id);
    } else {
      // Update button color to red for incorrect answer
      const incorrectBtn = this.el.nativeElement.querySelector(`#answer-${selectedAnswer.id}`);
      this.renderer.setStyle(incorrectBtn, 'background-color', 'red');
      // Update button color to green for the correct answer
      const correctAnswer = this.currentAnswers.find(answer => answer.isCorrect);
      const correctBtn = this.el.nativeElement.querySelector(`#answer-${correctAnswer.id}`);
      this.renderer.setStyle(correctBtn, 'background-color', 'lightgreen');
      this.updateCountsIncorrect(this.currentQuestion.id);
    }
  }



  updateCountsCorrect(questionId: number) {
    this.http.put(`https://server151wer-wird-arm.azurewebsites.net/fragen/updatecounts/${questionId}`, {
      countRichtigeAntwort: 1,
      countFalscheAntwort: 0
    }).subscribe(response => {
      console.log('Updated counts for correct answer:', response);
    }, error => {
      console.error('Error updating counts for correct answer:', error);
    });
  }

  updateCountsIncorrect(questionId: number) {
    this.http.put(`https://server151wer-wird-arm.azurewebsites.net/fragen/updatecounts/${questionId}`, {
      countRichtigeAntwort: 0,
      countFalscheAntwort: 1
    }).subscribe(response => {
      console.log('Updated counts for incorrect answer:', response);
    }, error => {
      console.error('Error updating counts for incorrect answer:', error);
    });
  }

  nextRoundPreparation() {

  }

  Joker() {
    localStorage.setItem('joker', true.toString());
    this.jokerUsed = true;
    const buttons = Array.from(this.el.nativeElement.querySelectorAll('.answer-button')) as HTMLElement[];
    const falseAnswers = [this.currentAnswers[1].id,
    this.currentAnswers[2].id,
    this.currentAnswers[3].id]
    const randomFalseAnswers = falseAnswers.sort(() => 0.5 - Math.random()).slice(0, 2);
    const buttonIds = randomFalseAnswers.slice(0, 2).map(id => `answer-${id}`);
    for (const id of buttonIds) {
      const button = Array.from(buttons).find((btn: HTMLElement) => btn.id === id) as HTMLButtonElement;
      if (button) {
        button.disabled = true; button.classList.add('disabled-button');
      }
    }
  }

}









