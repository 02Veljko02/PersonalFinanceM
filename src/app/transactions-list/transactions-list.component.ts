import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction/transaction.component';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TransactionComponent],
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css']
})
export class TransactionsListComponent implements OnInit {
  transactions: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>('http://127.0.0.1:4010/transactions?page=271&page-size=401&sort-by=repellat&sort-order=asc')
      .subscribe(data => {
        this.transactions = data.items; 
        console.log(this.transactions);
      });
  }
}


