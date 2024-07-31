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
  private updateSubscription: Subscription;

  constructor(private router: Router, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.updateSubscription = this.sharedService.update$.subscribe(() => {
      this.selectedCategories = this.sharedService.getSelectedCategories(this.transaction.id);
    });

    // Initial load of selected categories
    this.selectedCategories = this.sharedService.getSelectedCategories(this.transaction.id);
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
    localStorage.setItem("transactionId", this.transaction.id);
    this.router.navigate(['split']);
  }

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checkboxChange.emit({ id: this.transaction.id, checked: input.checked });
  }
}
