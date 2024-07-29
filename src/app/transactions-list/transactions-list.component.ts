import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction/transaction.component';
import { ApiService } from '../../services/api.service';
import Transaction from '../models/transaction';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, TransactionComponent],
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css']
})
export class TransactionsListComponent implements OnInit {
  transactions: Transaction[] = [];

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.apiService.getTransactions().subscribe(
      (      data: { items: Transaction[]; }) => 
      this.transactions = data.items
    )

    this.transactions.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
  }
  navigateToMultipleCategorization(){
    this.router.navigate(['multiple-categorization'])
  }

  
}
