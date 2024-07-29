import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import Categorization from '../models/categorization';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-categorization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorization.component.html',
  styleUrl: './categorization.component.css'
})
export class CategorizationComponent implements OnInit{
  categories: Categorization[] = [];
  subcategories: Categorization[] = [];

  category: string;
  subcategory: string;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.apiService.getCategories().subscribe(
      (      data: { items: Categorization[]; }) => 
      this.categories = data.items
    )

    this.subcategories = this.categories;
  }

  backToMain() {
    this.router.navigate(['']);
  }

  selectCategories() {
    let transaction = localStorage.getItem("transaction");
    let t = JSON.parse(transaction);
    let cat = this.categories.find(category1 => category1.name === this.category);
  
    this.apiService.importCategory(cat.code, cat.parentCode, cat.name).pipe(
      switchMap((respObj: HttpResponse<any>) => {
        if (respObj.status === 200) {
          return this.apiService.categoriseTransaction(cat.code, t.id);
        } else {
          console.log("Failed to import category");
          return of(null); // Return an empty observable to terminate the chain
        }
      }),
      catchError(error => {
        console.error('Import category failed', error);
        return of(null); // Return an empty observable to terminate the chain
      })
    ).subscribe(
      (respObj: HttpResponse<any> | null) => {
        if (respObj && respObj.status === 200) {
          console.log("Transaction categorised successfully");
        } else if (respObj) {
          console.log("Failed to categorise transaction");
        }
      },
      error => {
        console.error('Categorise transaction failed', error);
      }
    );
  
    this.ngOnInit();
  }
  
  
  
}
