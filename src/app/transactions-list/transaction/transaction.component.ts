// transaction.component.ts

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { Subscription } from 'rxjs';

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

  selectedCategories: string[] = [];
  private subscription: Subscription;

  constructor(private router: Router, private sharedService: SharedService) {}

  ngOnInit() {
    this.selectedCategories = this.sharedService.getSelectedCategories(this.transaction.id);

    this.subscription = this.sharedService.selectedCategoriesMap$.subscribe(categoriesMap => {
      this.selectedCategories = categoriesMap.get(this.transaction.id) || [];
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  navigateToCategorization() {
    localStorage.setItem("transactionId", this.transaction.id);
    this.router.navigate(['categorization']);
  }

  navigateToSplit() {
    localStorage.setItem("transactionId", this.transaction.id);
    this.router.navigate(['split']);
  }

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checkboxChange.emit({ id: this.transaction.id, checked: input.checked });
  }
}
