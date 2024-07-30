import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent {
  @Input() transaction: any;
  @Input() isSelectingMultipleTransactions: boolean = false;
  @Output() checkboxChange = new EventEmitter<{ id: string, checked: boolean }>();

  constructor(private router: Router) {}

  navigateToCategorization() {
    localStorage.setItem("transactionId", this.transaction.id);
    this.router.navigate(['categorization']);
  }

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checkboxChange.emit({ id: this.transaction.id, checked: input.checked });
  }
}
