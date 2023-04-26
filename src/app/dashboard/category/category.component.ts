import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories!: Array<any>;
  newRow: any = {};

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    const url = 'https://server151wer-wird-arm.azurewebsites.net/kategorien';
    this.http.get<Array<any>>(url).subscribe((response) => {
      this.categories = response;
    });
  }

  addNewRow() {
    this.newRow = {
      editing: true
    };
    this.categories.push(this.newRow);
  }

  submitNewCategory(category: any) {
    if (category.name) {
      const url = `https://server151wer-wird-arm.azurewebsites.net/kategorien?name=${category.name}`;
      this.http.post(url, {}).subscribe(() => {
        this.newRow = {};
        category.editing = false;
      });
    }
  }

  deleteCategory(category: any) {
    const url = `https://server151wer-wird-arm.azurewebsites.net/kategorien/${category.id}`;
    this.http.delete(url).subscribe(() => {
      this.categories = this.categories.filter(c => c.id !== category.id);
    });
  }

  editCategory(category: any) {
    category.editing = true;
  }

  updateCategory(category: any) {
    if (category.name) {
      const url = `https://server151wer-wird-arm.azurewebsites.net/kategorien/${category.id}?name=${category.name}`;
      this.http.put(url, {}).subscribe(() => {
        category.editing = false;
      });
    }
  }
}
