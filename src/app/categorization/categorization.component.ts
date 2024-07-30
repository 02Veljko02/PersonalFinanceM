import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import Categorization from '../models/categorization';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';  // Import the SharedService

@Component({
  selector: 'app-categorization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorization.component.html',
  styleUrls: ['./categorization.component.css']
})
export class CategorizationComponent implements OnInit {
  categories: Categorization[] = [];
  subcategories: Categorization[] = [];
  
  mainCategories: Categorization[] = []; // For categories with parent-code=""
  mainCategory: string; // Selected main category
  subcategory: string; // Selected subcategory
  catcode: string; //SELECTED CATEGORY THAT GOES TO BACKEND
  
  transactionId: string | null = null;
  transactionIds: string[] = []; // To store multiple transaction IDs

  constructor(
    private apiService: ApiService, 
    private router: Router, 
    private route: ActivatedRoute,
    private sharedService: SharedService  // Inject the SharedService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const transactionIdsParam = params['transactionIds'];
      if (transactionIdsParam) {
        this.transactionIds = transactionIdsParam.split(',');
      } else {
        this.transactionId = localStorage.getItem('transactionId');
        this.transactionIds.push(this.transactionId);
      }
    });

    this.apiService.getCategories().subscribe(
      (data: { items: Categorization[] }) => {
        this.categories = data.items;
        this.mainCategories = this.categories.filter(cat => !cat['parent-code']);
        this.subcategories = this.categories;
      }
    );
  }

  onCategoryChange() {
    if (this.mainCategory) {
      this.subcategories = this.categories.filter(cat => cat['parent-code'] === this.mainCategory);
    }
  }

  applyCategory() {
    let categoryCode = '';

    if (this.subcategory) {
      categoryCode = this.subcategory;
    } else if (this.mainCategories) {
      categoryCode = this.mainCategory;
    } else {
      alert('Please select a category or subcategory.');
      return;
    }

    this.apiService.updateTransactionsCategory(this.transactionIds, categoryCode).subscribe(
      () => {
        // Notify other components about the update
        this.sharedService.notifyUpdate();
        this.router.navigate(['']);
      },
      error => console.error('Error updating transactions category:', error)
    );
  }

  backToMain() {
    this.router.navigate(['']);
  }
}
