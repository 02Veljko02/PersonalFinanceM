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
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  paginatedTransactions: Transaction[] = [];

  constructor(
    private apiService: ApiService, 
    private sharedService: SharedService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactions();

    this.subscription = this.sharedService.update$.subscribe(() => {
      this.loadTransactions();
      this.transactions = this.assignCategoriesToTransactions(this.transactions);
      this.updatePagination();
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
        this.transactions = this.assignCategoriesToTransactions(this.transactions);
        this.updatePagination();
      },
      error => console.error('Greška pri preuzimanju kategorija:', error)
    );
  }

  private loadTransactions() {
    const storedTransactions = localStorage.getItem('transactions');
    
    if (storedTransactions) {
      this.transactions = JSON.parse(storedTransactions);
      this.transactions = this.assignCategoriesToTransactions(this.transactions);
      this.updatePagination();
    } else {
      this.apiService.getTransactions().subscribe(
        (data: any) => {
          this.transactions = data.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          localStorage.setItem('transactions', JSON.stringify(this.transactions));
          this.transactions = this.assignCategoriesToTransactions(this.transactions);
          this.updatePagination();
        },
        error => console.error('Greška pri preuzimanju transakcija:', error)
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

  private updatePagination() {
    this.totalPages = Math.ceil(this.transactions.length / this.itemsPerPage);
    this.paginateTransactions();
  }

  private paginateTransactions() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTransactions = this.transactions.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateTransactions();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateTransactions();
    }
  }
}
