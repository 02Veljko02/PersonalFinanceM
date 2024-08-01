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
  difference?: string;

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
  transaction: any = {}; // Dodajte polje za transakciju

  categorySections: CategorySection[] = [{ mainCategory: '', subcategory: '', amount: '', difference: '' }];

  constructor(
    private apiService: ApiService, 
    private router: Router, 
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        const transaction = JSON.parse(localStorage.getItem('transaction') || '{}');
        this.transactionId = transaction.id;
        this.transaction = transaction; // Učitajte celu transakciju
    });

    this.apiService.getCategories().subscribe(
        (data: { items: Categorization[] }) => {
            this.categories = data.items;
            this.mainCategories = this.categories.filter(cat => !cat['parent-code']);
            this.addNewCategorySection(); // Dodaj jedan deo kategorije kada se podaci učitaju
        }
    );
}

  onCategoryChange(index: number) {
    const selectedMainCategory = this.categorySections[index].mainCategory;
    if (selectedMainCategory) {
      this.subcategories[index] = this.categories.filter(cat => cat['parent-code'] === selectedMainCategory);
    }
    this.calculateDifferences(); // Dodajte ovo
  }
  
  // Dodajte i ovu metodu za praćenje promene u iznosu
  onAmountChange() {
    this.calculateDifferences();
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
    const selectedCategories = this.categorySections.map(section => {
      const mainCategory = this.categories.find(cat => cat.code === section.mainCategory);
      const subcategory = this.categories.find(cat => cat.code === section.subcategory);
      return {
        name: subcategory ? subcategory.name : mainCategory ? mainCategory.name : '',
        amount: parseFloat(section.amount) // Pretvorite iznos u broj
      };
    });
  
    // Proverite da li ukupni iznos odgovara iznosu transakcije
    const totalAmount = selectedCategories.reduce((sum, cat) => sum + (cat.amount || 0), 0);
    if (this.transactionId && totalAmount === parseFloat(this.transaction.amount)) {
      this.sharedService.setSelectedCategories(this.transactionId, 
        selectedCategories.map(cat => cat.name), 
        selectedCategories.map(cat => cat.amount)
      );
      this.sharedService.notifyUpdate();
      this.router.navigate(['']);
    } else {
      alert('The total amount does not match the transaction amount!');
    }
  }

  backToMain() {
    this.router.navigate(['']);
  }

  calculateDifferences() {
    const totalEnteredAmount = this.categorySections.reduce((sum, section) => sum + parseFloat(section.amount || '0'), 0);
    const totalTransactionAmount = parseFloat(this.transaction.amount);
    
    // Reset differences for all sections
    this.categorySections.forEach((section, index) => {
        section.difference = '';
    });

    // Calculate difference for the most recently added section
    const lastIndex = this.categorySections.length - 1;
    const lastSection = this.categorySections[lastIndex];
    const remainingAmount = totalTransactionAmount - totalEnteredAmount + parseFloat(lastSection.amount || '0');
    
    lastSection.difference = remainingAmount > 0 ? `Remaining: ${remainingAmount.toFixed(2)}` : `Over: ${Math.abs(remainingAmount).toFixed(2)}`;
}

  }
  


