import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TransactionComponent } from './transaction/transaction.component';
import { ApiService } from '../../services/api.service';
import { SharedService } from '../../services/shared.service';
import Transaction from '../models/transaction';
import Categorization from '../models/categorization';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, TransactionComponent],
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css']
})
export class TransactionsListComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  categories: Categorization[] = [];
  selectedTransactionIds: Set<string> = new Set();
  isSelectingMultipleTransactions: boolean = false;
  private subscription: Subscription;

  constructor(
    private apiService: ApiService, 
    private sharedService: SharedService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactions();

    this.subscription = this.sharedService.update$.subscribe(() => {
      console.log("updated")
      this.loadTransactions();  
      this.transactions=this.assignCategoriesToTransactions(this.transactions)
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

 

  private loadCategories() {
    this.apiService.getCategories().subscribe(
      (data: { items: Categorization[] }) => {
        this.categories = [...data.items];
        console.log('Loaded categories:', this.categories);
        this.transactions=this.assignCategoriesToTransactions(this.transactions); // Enrich after loading categories
      },
      error => console.error('Error fetching categories:', error)
    );
  }
  
  private loadTransactions() {
    const storedTransactions = localStorage.getItem('transactions');
    
    if (storedTransactions) {
      this.transactions = JSON.parse(storedTransactions);
      console.log('Loaded transactions from localStorage:', this.transactions);
      this.transactions=this.assignCategoriesToTransactions(this.transactions);  // Re-enrich transactions
    } else {
      this.apiService.getTransactions().subscribe(
        (data: any) => {
          this.transactions = data.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          localStorage.setItem('transactions', JSON.stringify(this.transactions));
          console.log('Fetched and stored transactions:', this.transactions);
          this.transactions=this.assignCategoriesToTransactions(this.transactions);  // Re-enrich transactions
        },
        error => console.error('Error fetching transactions:', error)
      );
    }
  }
  assignCategoriesToTransactions(transactions: Transaction[]): Transaction[] {
    const categoryMap = new Map(this.categories.map((cat) => [cat.code, cat]));
    return transactions.map((transaction) => ({
      ...transaction,
      category: categoryMap.get(transaction.catcode) || undefined,
    }));
  }

  

  handleTransactionSelection(event: { id: string, checked: boolean }) {
    if (event.checked) {
      this.selectedTransactionIds.add(event.id);
    } else {
      this.selectedTransactionIds.delete(event.id);
    }
  }

  toggleSelectionMode() {
    this.isSelectingMultipleTransactions = !this.isSelectingMultipleTransactions;
    if (!this.isSelectingMultipleTransactions) {
      this.selectedTransactionIds.clear();
    }
  }

  navigateToCategorization() {
    if (this.selectedTransactionIds.size > 0) {
      this.router.navigate(['categorization'], { queryParams: { transactionIds: Array.from(this.selectedTransactionIds).join(',') } });
    }
  }
}
