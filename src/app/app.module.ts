import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { QuizPageComponent } from './quiz-page/quiz-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QuestionPageComponent } from './dashboard/question-page/question-page.component';
import { CategoryHighscorePageComponent } from './dashboard/category-highscore-page/category-highscore-page.component';
import { CategoryComponent } from './dashboard/category/category.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    QuizPageComponent,
    LoginPageComponent,
    HeaderComponent,
    DashboardComponent,
    QuestionPageComponent,
    CategoryHighscorePageComponent,
    CategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule, 
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
