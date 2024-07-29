import { Routes } from '@angular/router';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { CategorizationComponent } from './categorization/categorization.component';
import { MultipleCategorizationComponent } from './multiple-categorization/multiple-categorization.component';

export const routes: Routes = [
    {path : '', component : TransactionsListComponent},
    {path : 'categorization', component : CategorizationComponent},
    {path: 'multiple-categorization', component: MultipleCategorizationComponent}
];
