import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { Subscription } from 'rxjs';

interface CategoryWithAmount {
  name: string;
  amount: number;
}

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit, OnDestroy {
  @Input() transaction: any;
  @Input() isSelectingMultipleTransactions: boolean = false;
  @Output() checkboxChange = new EventEmitter<{ id: string, checked: boolean }>();
  
  selectedCategories: CategoryWithAmount[] = [];
  private updateSubscription: Subscription;

  constructor(private router: Router, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.updateSubscription = this.sharedService.update$.subscribe(() => {
      const selected = this.sharedService.getSelectedCategories(this.transaction.id);
      this.selectedCategories = selected.categories.map((cat, index) => ({
        name: cat,
        amount: selected.amounts[index]
      }));
    });

    // Initial load of selected categories and amounts
    const selected = this.sharedService.getSelectedCategories(this.transaction.id);
    this.selectedCategories = selected.categories.map((cat, index) => ({
      name: cat,
      amount: selected.amounts[index]
    }));
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  navigateToCategorization() {
    localStorage.setItem("transactionId", this.transaction.id);
    this.router.navigate(['categorization']);
  }

  navigateToSplit() {
    localStorage.setItem("transaction", JSON.stringify(this.transaction));
    this.router.navigate(['split']);
  }

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checkboxChange.emit({ id: this.transaction.id, checked: input.checked });
  }
}
