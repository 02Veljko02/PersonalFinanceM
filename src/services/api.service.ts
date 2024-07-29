import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Transaction from '../app/models/transaction';
import Categorization from '../app/models/categorization';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  baseUrl = "http://127.0.0.1:4010";
  readonly http = inject(HttpClient);

  getTransactions(): any {
    return this.http.get<Transaction>(`${this.baseUrl}/transactions`);
  }
  
  getCategories(): any {
    return this.http.get<Categorization>(`${this.baseUrl}/categories`);
  }

  importCategory(code: string, parentCode: string, name: string): Observable<HttpResponse<any>> {
    // Format CSV data
    const csvData = `code,parent-code,name\n${code},${parentCode},${name}\n`;

    // Set the headers to indicate content type
    const headers = new HttpHeaders({
      'Content-Type': 'text/csv'  // Correct content type for CSV data
    });

    // Send POST request with CSV data
    return this.http.post<any>(`${this.baseUrl}/categories/import`, csvData, { headers, observe: 'response' });
  }

  categoriseTransaction(category:string, transactionId: string): Observable<HttpResponse<any>> {
    let data = {
      catcode: category
    }
    return this.http.post<any>('${this.baseUrl}/transaction/${transactionId}/categorize', data, { observe: 'response' });
  }
}