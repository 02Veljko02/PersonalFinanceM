import { Routes } from '@angular/router';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { CategorizationComponent } from './categorization/categorization.component';

export const routes: Routes = [
    {path : '', component : TransactionsListComponent},
    {path : 'categorization', component : CategorizationComponent},
];
