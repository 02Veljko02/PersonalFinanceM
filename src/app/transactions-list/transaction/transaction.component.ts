import { Component, Input } from '@angular/core';
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

  constructor(private router: Router) {}

  navigateToCategorization() {
    localStorage.setItem("transaction", JSON.stringify(this.transaction));
    this.router.navigate(['categorization']);
  }
  
  }

