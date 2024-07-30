import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private updateSubject = new BehaviorSubject<void>(undefined);

  get update$(): Observable<void> {
    return this.updateSubject.asObservable();
  }

  notifyUpdate(): void {
    this.updateSubject.next();
  }
}
