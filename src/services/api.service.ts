import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Transaction from '../app/models/transaction';
import Categorization from '../app/models/categorization';
import { SharedService } from './shared.service';  // Adjust the import path as needed

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private sharedService: SharedService) { }

  baseUrl = "http://127.0.0.1:4010";
  readonly http = inject(HttpClient);

  getTransactions(): any {
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions`);
  }
  
  getCategories(): any {
    return this.http.get<Categorization[]>(`${this.baseUrl}/categories`);
  }

  updateTransactionsCategory(transactionIds: string[], catcode: string): any {
    // Fetch transactions from local storage
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    // Update the category code for each transaction
    const updatedTransactions = transactions.map(transaction => {
      if (transactionIds.includes(transaction.id)) {
        return { ...transaction, catcode };
      }
      return transaction;
    });

    // Save the updated transactions back to local storage
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    // Notify other components about the update
    this.sharedService.notifyUpdate();

    // Return observable for further processing
    return of({ success: true, message: 'Category updated successfully' }).pipe(
      catchError(error => {
        console.error('Error updating transactions:', error);
        return of({ success: false, message: 'Error updating transactions' });
      })
    );
  }
}
