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
  selector: 'app-multiple-categorization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multiple-categorization.component.html',
  styleUrl: './multiple-categorization.component.css'
})
export class MultipleCategorizationComponent implements OnInit{
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
}