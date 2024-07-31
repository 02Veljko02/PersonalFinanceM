import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private updateSubject = new BehaviorSubject<void>(undefined);
  private selectedCategoriesMapSubject = new BehaviorSubject<Map<string, { categories: string[], amounts: number[] }>>(new Map());

  get update$(): Observable<void> {
    return this.updateSubject.asObservable();
  }

  get selectedCategoriesMap$(): Observable<Map<string, { categories: string[], amounts: number[] }>> {
    return this.selectedCategoriesMapSubject.asObservable();
  }

  notifyUpdate(): void {
    this.updateSubject.next();
  }

  setSelectedCategories(transactionId: string, categories: string[], amounts: number[]): void {
    const currentMap = this.selectedCategoriesMapSubject.getValue();
    currentMap.set(transactionId, { categories, amounts });
    this.selectedCategoriesMapSubject.next(new Map(currentMap));
  }

  getSelectedCategories(transactionId: string): { categories: string[], amounts: number[] } {
    return this.selectedCategoriesMapSubject.getValue().get(transactionId) || { categories: [], amounts: [] };
  }
}
