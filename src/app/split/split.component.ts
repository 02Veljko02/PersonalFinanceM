import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import Categorization from '../models/categorization';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';

interface CategorySection {
  mainCategory: string;
  subcategory: string;
  amount: string;
}

@Component({
  selector: 'app-split-categorization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './split.component.html',
  styleUrls: ['./split.component.css']
})
export class SplitCategorizationComponent implements OnInit {
  categories: Categorization[] = [];
  subcategories: { [key: number]: Categorization[] } = {};
  
  mainCategories: Categorization[] = [];
  transactionId: string | null = null;
  transactionIds: string[] = [];

  categorySections: CategorySection[] = [{ mainCategory: '', subcategory: '', amount: '' }];

  constructor(
    private apiService: ApiService, 
    private router: Router, 
    private route: ActivatedRoute,
    private sharedService: SharedService
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
      }
    );
  }

  onCategoryChange(index: number) {
    const selectedMainCategory = this.categorySections[index].mainCategory;
    if (selectedMainCategory) {
      this.subcategories[index] = this.categories.filter(cat => cat['parent-code'] === selectedMainCategory);
    }
  }

  addNewCategorySection() {
    this.categorySections.push({ mainCategory: '', subcategory: '', amount: '' });
  }

  removeCategorySection(index: number) {
    if (this.categorySections.length > 1) {
      this.categorySections.splice(index, 1);
    }
  }

  isFormValid() {
    return this.categorySections.every(section => section.mainCategory || section.subcategory);
  }

  applyCategory() {
    const selectedCategories: string[] = this.categorySections.map(section => {
      const mainCategory = this.categories.find(cat => cat.code === section.mainCategory);
      const subcategory = this.categories.find(cat => cat.code === section.subcategory);
      return subcategory ? subcategory.name : mainCategory ? mainCategory.name : '';
    });
  
    // Save selected categories to SharedService
    if (this.transactionId) {
      this.sharedService.setSelectedCategories(this.transactionId, selectedCategories);
    }
  
    // Notify update
    this.sharedService.notifyUpdate();
  
    // Navigate back to the main page
    this.router.navigate(['']);
  }
  
  

  backToMain() {
    this.router.navigate(['']);
  }
}